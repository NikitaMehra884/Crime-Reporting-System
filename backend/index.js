// --- 1. Tools ko import karna ---
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// --- 2. Express app ko setup karna ---
const app = express();

// --- CORS SETUP (Vercel ke liye) ---
const allowedOrigins = [
    'https://crime-reporting-system-five.vercel.app', // Aapka Vercel Link
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS Error: This origin is not allowed.'));
        }
    }
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. Database Connection Pool (Aiven Cloud - Timeout Fix) ---
const pool = mysql.createPool({
    host: 'AIVEN_HOST_YAHAN_PASTE_KAREIN',       
    user: 'avnadmin',                            
    password: 'AIVEN_PASSWORD_YAHAN_PASTE_KAREIN', 
    database: 'defaultdb',                       
    port: 12345, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, // <-- FIX: 60 Seconds wait karega connect hone ke liye
    ssl: { rejectUnauthorized: false } 
});

// Connection Check (Log karega par app crash nahi karega)
pool.getConnection((err, connection) => {
    if (err) console.error('Database ERROR:', err.message); // Sirf message dikhao
    else {
        console.log('Successfully connected to Aiven Database.');
        connection.release();
    }
});

// --- Email Transporter Setup (Port 465 Fix) ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465,              // <-- FIX: Port 465 (Secure) use karein
    secure: true,           // <-- FIX: Secure true karein
    auth: {
        user: 'YOUR_GMAIL_ADDRESS@gmail.com', // !! EMAIL CHECK KAREIN !!
        pass: 'YOUR_GMAIL_APP_PASSWORD'    // !! PASSWORD CHECK KAREIN !!
    }
});

// Verify (Error aaye toh app crash mat karo)
transporter.verify((error, success) => {
    if (error) console.error('Email Error (Non-fatal):', error.message);
    else console.log('Email transporter is ready.');
});

// --- Multer Setup ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// --- 5. API Routes ---

app.get('/', (req, res) => { res.send('Backend is Live!'); });

// Route 1: Register
app.post('/api/register', (req, res) => {
    const { username, password, email, full_name, role } = req.body;
    const sql = "INSERT INTO Users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)";
    pool.query(sql, [username, password, email, full_name, role], (err, result) => {
        if (err) {
            console.error("Register Error:", err);
            return res.status(500).send({ message: 'Error registering user' });
        }
        res.status(201).send({ message: 'User registered successfully!' });
    });
});

// Route 2: File Complaint
app.post('/api/complaints', upload.single('evidence'), (req, res) => {
    const { user_id, title, description, location, latitude, longitude } = req.body;
    const lat = (latitude === 'null' || latitude === 'undefined') ? null : latitude;
    const lon = (longitude === 'null' || longitude === 'undefined') ? null : longitude;
    const evidenceUrl = req.file ? req.file.path.replace(/\\/g, '/') : null; 
    
    const sql = "INSERT INTO Complaints (user_id, title, description, location, latitude, longitude, evidence_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    pool.query(sql, [user_id, title, description, location, lat, lon, evidenceUrl], (err, result) => {
        if (err) {
            console.error("Complaint Error:", err);
            return res.status(500).send({ message: 'Error filing complaint' });
        }
        
        res.status(201).send({ message: 'Complaint filed successfully!', complaint_id: result.insertId });

        // Email Logic (Background)
        const complaintId = result.insertId;
        const emailQuery = "SELECT email FROM Users WHERE (role = 'police' OR role = 'admin') AND email IS NOT NULL";
        
        pool.query(emailQuery, (emailErr, users) => {
            if (!emailErr && users.length > 0) {
                const emailList = users.map(user => user.email).join(', ');
                let googleMapsLink = lat && lon ? `https://www.google.com/maps?q=${lat},${lon}` : "#";
                
                const mailOptions = {
                    from: `"Crime Reporting System" <YOUR_GMAIL_ADDRESS@gmail.com>`,
                    to: emailList,
                    subject: `🚨 New Complaint #${complaintId}`,
                    html: `<p>New complaint at <b>${location}</b>. <br> <a href="${googleMapsLink}">View Map</a></p>`
                };
                transporter.sendMail(mailOptions, (e) => { if(e) console.error("Mail Error:", e); });
            }
        });
    });
});

// Route 3: Get All Complaints
app.get('/api/complaints', (req, res) => {
    const sql = "SELECT * FROM Complaints ORDER BY created_at DESC";
    pool.query(sql, (err, results) => {
        if (err) return res.status(500).send({ message: 'Error fetching data' });
        res.status(200).json(results);
    });
});

// Route 4: Login
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

// Route 5: Citizen Complaints
app.get('/api/complaints/citizen/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM Complaints WHERE user_id = ? ORDER BY created_at DESC";
    pool.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send({ message: 'Error fetching data' });
        res.status(200).json(results);
    });
});

// Route 6: Update Status
app.put('/api/complaints/status/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    const sql = "UPDATE Complaints SET status = ? WHERE complaint_id = ?";
    pool.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error updating' });
        res.status(200).send({ message: 'Status updated' });
    });
});

// Route 7: Update Details
app.put('/api/complaints/details/:id', (req, res) => {
    const { id } = req.params;
    const { status, priority, category } = req.body;
    const sql = "UPDATE Complaints SET status = ?, ai_priority = ?, ai_category = ? WHERE complaint_id = ?";
    pool.query(sql, [status, priority, category, id], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error updating' });
        res.status(200).send({ message: 'Updated' });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});