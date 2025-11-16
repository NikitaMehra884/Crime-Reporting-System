const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const sgMail = require('@sendgrid/mail');
require('dotenv').config(); 

const app = express();

// --- CREDENTIALS SETUP (Environment Variables Se) ---
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'nikitamehra898@gmail.com'; 

// Cloudinary
cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET 
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'crime_evidence',
        resource_type: 'auto', 
    },
});
const upload = multer({ storage: storage });

// SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- CORS Setup ---
const allowedOrigins = [
    'https://crime-reporting-system-five.vercel.app', 
    'http://localhost:3000'
];
app.use(cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200
}));
app.use(express.json());

// --- DATABASE SETUP (Aiven) ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER || 'avnadmin',                            
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME || 'defaultdb',                       
    port: process.env.DB_PORT, 
    waitForConnections: true,
    connectTimeout: 20000, 
    ssl: { rejectUnauthorized: false } 
});

pool.getConnection((err, c) => { 
    if(err) console.error('❌ DB Connection Failed:', err.message); 
    else { console.log('✅ DB Connected'); if(c) c.release(); }
});

// --- HELPER FUNCTION: EMAIL ---
function sendEmailNotification(complaintId, title, description, location, lat, lon) {
    const emailQuery = "SELECT email FROM Users WHERE (role = 'police' OR role = 'admin') AND email IS NOT NULL";
    
    pool.query(emailQuery, (emailErr, users) => {
        if (!emailErr && users.length > 0) {
            const emailList = users.map(user => user.email);
            let googleMapsLink = (lat && lon) ? `https://www.google.com/maps?q=${lat},${lon}` : "#";

            const htmlBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <div style="background-color: #1a2027; padding: 20px;">
                        <h2 style="color: #d32f2f;">🚨 New Crime Reported</h2>
                        <p>Complaint #${complaintId}</p>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <p><strong>Title:</strong> ${title}</p>
                        <p><strong>Description:</strong> ${description}</p>
                        <p><strong>Reported Address:</strong> ${location}</p>
                        ${lat && lon ? `<p><a href="${googleMapsLink}">📍 View Exact Location on Google Maps</a></p>` : `<p style="color: red;">⚠️ Location not shared.</p>`}
                    </div>
                </div>
            `;
            
            const msg = {
                to: emailList, 
                from: SENDER_EMAIL, 
                subject: `🚨 URGENT: New Complaint #${complaintId} at ${location}`,
                html: htmlBody
            };

            sgMail.sendMultiple(msg)
                .then(() => console.log('Pro Email Sent Successfully.'))
                .catch(err => console.error("SendGrid Error:", err.message));
        }
    });
}

// --- 4. API ROUTES ---

// Route 2: File Complaint
app.post('/api/complaints', upload.single('evidence'), (req, res) => {
    const { user_id, title, description, location, latitude, longitude } = req.body;
    const evidenceUrl = req.file ? req.file.path : null; 
    const lat = latitude === 'null' ? null : latitude;
    const lon = longitude === 'null' ? null : longitude;
    
    const sql = "INSERT INTO Complaints (user_id, title, description, location, latitude, longitude, evidence_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    pool.query(sql, [user_id, title, description, location, lat, lon, evidenceUrl], (err, result) => {
        if (err) {
            console.error("DB Save Error:", err);
            return res.status(500).send({ message: 'Database Error' });
        }
        
        res.status(201).send({ message: 'Complaint filed successfully!', complaint_id: result.insertId });

        sendEmailNotification(result.insertId, title, description, location, lat, lon);
    });
});

// Route 4: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; 
    pool.query("SELECT * FROM Users WHERE username = ? AND password = ?", [username, password], (err, r) => {
        if(err) return res.status(500).send({message: 'DB Error'});
        if(r.length > 0) res.status(200).send({message: 'Success', user: r[0]});
        else res.status(401).send({message: 'Invalid'});
    });
});

// Other Routes...
app.post('/api/register', (req, res) => {
    const { username, password, email, full_name, role } = req.body;
    pool.query("INSERT INTO Users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)", [username, password, email, full_name, role], (err) => {
        if(err) return res.status(500).send({message: 'Error'});
        res.status(201).send({message: 'Created'});
    });
});
app.get('/api/complaints', (req, res) => {
    pool.query("SELECT * FROM Complaints ORDER BY created_at DESC", (err, r) => {
        if(err) return res.status(500).send(err);
        res.json(r);
    });
});
app.get('/api/complaints/citizen/:userId', (req, res) => {
    pool.query("SELECT * FROM Complaints WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId], (err, r) => {
        if(err) return res.status(500).send(err);
        res.json(r);
    });
});
app.put('/api/complaints/status/:id', (req, res) => {
    const { status } = req.body;
    pool.query("UPDATE Complaints SET status = ? WHERE complaint_id = ?", [status, req.params.id], (err) => {
        if(err) return res.status(500).send(err);
        res.send({message: 'Updated'});
    });
});

// --- YEH HAI FIX ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Running on port ${PORT}`));
// --- FIX KHATAM ---