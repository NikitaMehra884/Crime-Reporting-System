const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config(); 
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const sgMail = require('@sendgrid/mail');

const app = express();

// ==========================================
// 1. CREDENTIALS SECTION (FILL THIS CAREFULLY)
// ==========================================

// --- Cloudinary (For Image/Video) ---
cloudinary.config({ 
    cloud_name: 'dkse1hp6f', 
    api_key:    '558482177117282', 
    api_secret: 'i-hWMD3COFLN_nieBfadGVQJCSs' 
});

// --- SendGrid (For Emails) ---
sgMail.setApiKey('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'); 
const SENDER_EMAIL = 'nikitamehra898@gmail.com'; // e.g., nikita...@gmail.com

// --- Aiven Database (MySQL) ---
const DB_HOST = 'crime-db-online-nikitamehra767-b937.k.aivencloud.com';
const DB_USER = 'avnadmin';
const DB_PASS = 'AVNS_QEwVq7AK7QbHinM5Pvw';
const DB_NAME = 'defaultdb';
const DB_PORT = 25890; // Usually 12345 or check dashboard

// ==========================================
// END OF CREDENTIALS SECTION
// ==========================================

// --- Cloudinary Storage Config ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'crime_evidence',
        resource_type: 'auto', // Allows both images and videos
    },
});
const upload = multer({ storage: storage });

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
            callback(null, true); // Allow all for now to prevent issues
        }
    }
}));
app.use(express.json());

// --- Database Connection Pool ---
const pool = mysql.createPool({
    host: DB_HOST,       
    user: DB_USER,                            
    password: DB_PASS, 
    database: DB_NAME,                       
    port: DB_PORT, 
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 20000, 
    ssl: { rejectUnauthorized: false } 
});

pool.getConnection((err, c) => { 
    if(err) console.error('❌ DB Connection Failed:', err.message); 
    else { console.log('✅ DB Connected'); c.release(); }
});

// --- ROUTES ---
app.get('/', (req, res) => { res.send('Backend is Running!'); });

// Route 1: Register
app.post('/api/register', (req, res) => {
    const { username, password, email, full_name, role } = req.body;
    const sql = "INSERT INTO Users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)";
    pool.query(sql, [username, password, email, full_name, role], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error registering.' });
        res.status(201).send({ message: 'User registered successfully!' });
    });
});

// Route 2: File Complaint (Main Logic)
app.post('/api/complaints', upload.single('evidence'), (req, res) => {
    const { user_id, title, description, location, latitude, longitude } = req.body;
    const lat = latitude === 'null' ? null : latitude;
    const lon = longitude === 'null' ? null : longitude;
    const evidenceUrl = req.file ? req.file.path : null; 
    
    const sql = "INSERT INTO Complaints (user_id, title, description, location, latitude, longitude, evidence_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    pool.query(sql, [user_id, title, description, location, lat, lon, evidenceUrl], (err, result) => {
        if (err) {
            console.error("DB Save Error:", err);
            return res.status(500).send({ message: 'Database Error' });
        }
        
        // 1. Success Response immediately
        res.status(201).send({ message: 'Complaint filed successfully!', complaint_id: result.insertId });

        // 2. Background Email
        sendEmailNotification(result.insertId, title, description, location, lat, lon);
    });
});

// Helper Function for Email
function sendEmailNotification(complaintId, title, description, location, lat, lon) {
    const emailQuery = "SELECT email FROM Users WHERE (role = 'police' OR role = 'admin') AND email IS NOT NULL";
    
    pool.query(emailQuery, (emailErr, users) => {
        if (!emailErr && users.length > 0) {
            const emailList = users.map(user => user.email);
            
            let googleMapsLink = "#";
            let locationSection = `<p style="color: #f4a261; font-weight: bold;">⚠️ User did not share GPS location.</p>`;

            if (lat && lon) {
                googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
                locationSection = `
                    <p style="font-size: 14px; margin-bottom: 10px;"><strong>Live GPS Location Detected:</strong></p>
                    <a href="${googleMapsLink}" target="_blank" style="background-color: #1565C0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-family: sans-serif;">
                        📍 View Exact Location on Google Maps
                    </a>
                `;
            }

            // --- HTML Email Template ---
            const htmlBody = `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                    <div style="background-color: #1a2027; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; color: #d32f2f; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">🚨 Action Required</h2>
                        <p style="margin: 5px 0 0; color: #b0bec5; font-size: 14px;">New Complaint #${complaintId}</p>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <h3 style="color: #d32f2f; margin-top: 0;">New Crime Reported</h3>
                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1565C0; margin-bottom: 20px;">
                            <p style="margin: 5px 0;"><strong>Title:</strong> ${title}</p>
                            <p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <h4 style="margin-bottom: 10px;">📍 Location Details</h4>
                        <p style="margin-top: 0;"><strong>Reported Address:</strong> ${location}</p>
                        ${locationSection}
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 13px; color: #666; text-align: center;">
                            Please login to the <a href="https://crime-reporting-system-five.vercel.app/" style="color: #1565C0; font-weight: bold;">Police Dashboard</a> to take action.
                        </p>
                    </div>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                        © 2025 Police Citizen Portal. Automated System Alert.
                    </div>
                </div>
            `;

            const msg = {
                to: emailList, 
               from: 'nikitamehra898@gmail.com',
                subject: `🚨 URGENT: New Complaint #${complaintId} at ${location}`,
                html: htmlBody
            };

            sgMail.sendMultiple(msg)
                .then(() => console.log('Pro Email Sent via SendGrid'))
                .catch(err => console.error("SendGrid Error:", err.message));
        }
    });
}

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
        if (err) return res.status(500).send({ message: 'Error' });
        res.status(200).send({ message: 'Updated' });
    });
});

// Route 7: Update Details
app.put('/api/complaints/details/:id', (req, res) => {
    // Not currently used but kept for future AI features
    res.status(200).send({ message: 'Updated' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});