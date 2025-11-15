const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

// --- NAYA: CLOUDINARY SETUP ---
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Apni Cloudinary details yahan daalein (ya .env file se)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'Root', 
    api_key: process.env.CLOUDINARY_API_KEY || '558482177117282', 
    api_secret: process.env.CLOUDINARY_API_SECRET || 'i-hWMD3COFLN_nieBfadGVQJCSs' 
});

// Naya Multer Storage (ab yeh Cloudinary par save karega)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'crime_evidence', // Cloudinary mein 'crime_evidence' folder ban jayega
        resource_type: 'auto',    // Photo/Video kuch bhi detect kar lega
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});
// --- CLOUDINARY SETUP KHATAM ---

const app = express();

// --- CORS Setup ---
const allowedOrigins = [
    'https://crime-reporting-system-five.vercel.app', 
    'http://localhost:3000'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); 
        }
    }
}));
app.use(express.json());
// '/uploads' ki ab zaroorat nahi hai
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 1. DATABASE SETUP (Aiven) ---
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'crime-db-online-nikitamehra767-b937.k.aivencloud.com',       
    user: process.env.DB_USER || 'avnadmin',                            
    password: process.env.DB_PASSWORD || 'AVNS_QEwVq7AK7QbHinM5Pvw', 
    database: process.env.DB_NAME || 'defaultdb',                       
    port: process.env.DB_PORT || 25890, 
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 20000, 
    ssl: { rejectUnauthorized: false } 
});
pool.getConnection((err, c) => { if(err) console.error(err.message); else console.log('DB Connected'); if(c) c.release(); });

// --- 2. EMAIL SETUP ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: {
        user: process.env.GMAIL_USER || 'nikitamehra898@gmail.com',
        pass: process.env.GMAIL_PASS || 'oiuufrnnjjidmcor'
    }
});
transporter.verify((e, s) => { if(e) console.error(e.message); else console.log('Email Ready'); });

// --- 3. MULTER AB NAYA STORAGE USE KAREGA ---
const upload = multer({ storage: storage }); // 'storage' ab Cloudinary wala hai

// --- 4. API ROUTES ---
app.get('/', (req, res) => { res.send('Backend is Running!'); });

// Route 1: Register
app.post('/api/register', (req, res) => {
    // ... (Register ka code same rahega) ...
    const { username, password, email, full_name, role } = req.body;
    const sql = "INSERT INTO Users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)";
    pool.query(sql, [username, password, email, full_name, role], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error registering.' });
        res.status(201).send({ message: 'User registered successfully!' });
    });
});

// Route 2: File Complaint (Code Change)
app.post('/api/complaints', upload.single('evidence'), (req, res) => {
    const { user_id, title, description, location, latitude, longitude } = req.body;
    const lat = (latitude === 'null' || latitude === 'undefined') ? null : latitude;
    const lon = (longitude === 'null' || longitude === 'undefined') ? null : longitude;
    
    // NAYA: URL ab Cloudinary se aayega ('req.file.path')
    // Local 'uploads/' folder ki zaroorat nahi
    const evidenceUrl = req.file ? req.file.path : null; 
    
    const sql = "INSERT INTO Complaints (user_id, title, description, location, latitude, longitude, evidence_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    pool.query(sql, [user_id, title, description, location, lat, lon, evidenceUrl], (err, result) => {
        if (err) {
            console.error("Complaint Save Error:", err);
            return res.status(500).send({ message: 'Database Error' });
        }
        
        res.status(201).send({ message: 'Complaint filed successfully!', complaint_id: result.insertId });
        
        // Background mein Email (yeh code same hai)
        sendEmailNotification(result.insertId, title, description, location, lat, lon);
    });
});

// Helper Function for Email (Same)
function sendEmailNotification(complaintId, title, description, location, lat, lon) {
    const emailQuery = "SELECT email FROM Users WHERE (role = 'police' OR role = 'admin') AND email IS NOT NULL";
    
    pool.query(emailQuery, (emailErr, users) => {
        if (!emailErr && users.length > 0) {
            const emailList = users.map(user => user.email);
            let googleMapsLink = (lat && lon) ? `https://www.google.com/maps?q=${lat},${lon}` : "#";

            // --- YEH HAI AAPKA NAYA HTML EMAIL TEMPLATE ---
            const htmlBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #333; color: white; padding: 20px;">
                        <h2 style="margin: 0; color: #d32f2f; font-weight: bold;">🚨 New Crime Reported</h2>
                    </div>
                    <div style="padding: 25px; background-color: #222; color: #f1f1f1;">
                        <p style="font-size: 16px;"><strong>Title:</strong> ${title}</p>
                        <p style="font-size: 14px; line-height: 1.6;">
                            <strong>Description:</strong> ${description}
                        </p>
                        <hr style="border: 0; border-top: 1px solid #444; margin: 20px 0;" />
                        <h3 style="color: #f1f1f1;">Location Details</h3>
                        <p style="font-size: 14px;"><strong>Reported Address:</strong> ${location}</p>
                        
                        ${lat && lon ? `
                            <p style="font-size: 14px; margin-bottom: 20px;"><strong>Live GPS Location Detected:</strong></p>
                            <a href="${googleMapsLink}" target="_blank" style="background-color: #1565C0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                📍 View Exact Location on Google Maps
                            </a>
                        ` : `
                            <p style="color: #f4a261; font-weight: bold;">⚠️ User did not share GPS location.</p>
                        `}
                        
                        <hr style="border: 0; border-top: 1px solid #444; margin: 25px 0;" />
                        <p style="font-size: 12px; color: #888;">
                            Please login to the <a href="https://crime-reporting-system-five.vercel.app/" style="color: #90caf9;">Police Dashboard</a> to view evidence (Photos/Videos) and take action.
                        </p>
                    </div>
                </div>
            `;
            // --- HTML TEMPLATE KHATAM ---

            const msg = {
                to: emailList, 
                from: 'YOUR_VERIFIED_SENDER_EMAIL@gmail.com', // !! YAHAN APNA VERIFIED EMAIL DAALEIN !!
                subject: `🚨 ACTION REQUIRED: New Complaint #${complaintId} at ${location}`,
                html: htmlBody // Naya HTML template yahan daala
            };

            sgMail.sendMultiple(msg)
                .then(() => console.log('Notification email sent successfully via SendGrid.'))
                .catch(err => console.error("SendGrid Error (Background):", err.message));
        }
    });
}

// Route 3: Get All Complaints (Same)
app.get('/api/complaints', (req, res) => {
    const sql = "SELECT * FROM Complaints ORDER BY created_at DESC";
    pool.query(sql, (err, results) => {
        if (err) return res.status(500).send({ message: 'Error fetching data' });
        res.status(200).json(results);
    });
});

// Route 4: Login (Same)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; 
    const sql = "SELECT * FROM Users WHERE username = ? AND password = ?";
    pool.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).send({ message: 'Database error' });
        if (results.length > 0) {
            const user = results[0];
            delete user.password;
            res.status(200).send({ message: 'Login successful!', user: user });
        } else {
            res.status(401).send({ message: 'Invalid username or password' });
        }
    });
});

// Route 5: Citizen Complaints (Same)
app.get('/api/complaints/citizen/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM Complaints WHERE user_id = ? ORDER BY created_at DESC";
    pool.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send({ message: 'Error fetching data' });
        res.status(200).json(results);
    });
});

// Route 6: Update Status (Same)
app.put('/api/complaints/status/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    const sql = "UPDATE Complaints SET status = ? WHERE complaint_id = ?";
    pool.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error' });
        res.status(200).send({ message: 'Updated' });
    });
});

// Route 7 (AI wala, unused) - (Same)
app.put('/api/complaints/details/:id', (req, res) => { /* ... */ });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
