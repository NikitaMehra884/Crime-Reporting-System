const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
// dotenv ko zaroor import karein agar .env file use kar rahe hain
require('dotenv').config(); 

const app = express();

// --- CORS Setup (Aapki Vercel Website ke liye) ---
const allowedOrigins = [
    'https://crime-reporting-system-five.vercel.app', 
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

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    } else {
        console.log('✅ Successfully connected to Aiven Database.');
        connection.release();
    }
});

// --- 2. EMAIL SETUP ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465,              
    secure: true,           
    auth: {
        user: process.env.GMAIL_USER || 'nikitamehra898@gmail.com', // !! APNA EMAIL !!
        pass: process.env.GMAIL_PASS || 'oiuufrnnjjidmcor'    // !! APNA APP PASSWORD !!
    },
    connectionTimeout: 10000
});

transporter.verify((error, success) => {
    if (error) console.error('⚠️ Email Warning:', error.message);
    else console.log('✅ Email transporter is ready.');
});

// --- 3. MULTER SETUP ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// --- 4. API ROUTES ---

// Route 1: Register
app.post('/api/register', (req, res) => {
    const { username, password, email, full_name, role } = req.body;
    const sql = "INSERT INTO Users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)";
    pool.query(sql, [username, password, email, full_name, role], (err, result) => {
        if (err) {
            console.error("Register Error:", err);
            return res.status(500).send({ message: 'Username or Email might already exist.' });
        }
        res.status(201).send({ message: 'User registered successfully!' });
    });
});

// --- YEH HAI MAIN FIX ---
// Route 2: File Complaint
app.post('/api/complaints', upload.single('evidence'), (req, res) => {
    const { user_id, title, description, location, latitude, longitude } = req.body;
    const lat = (latitude === 'null' || latitude === 'undefined') ? null : latitude;
    const lon = (longitude === 'null' || longitude === 'undefined') ? null : longitude;
    const evidenceUrl = req.file ? req.file.path.replace(/\\/g, '/') : null; 
    
    const sql = "INSERT INTO Complaints (user_id, title, description, location, latitude, longitude, evidence_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    // 1. Complaint ko Database mein save karo
    pool.query(sql, [user_id, title, description, location, lat, lon, evidenceUrl], (err, result) => {
        if (err) {
            console.error("Complaint Save Error:", err);
            // Agar DB mein save nahi hua, tab error bhejo
            return res.status(500).send({ message: 'Error filing complaint. Database issue.' });
        }
        
        // 2. Database save hote hi, TURANT user ko response bhejo
        res.status(201).send({ message: 'Complaint filed successfully!', complaint_id: result.insertId });

        // 3. Ab, background mein araam se email bhejo
        console.log("Complaint saved. Sending email in background...");
        sendEmailNotification(result.insertId, title, description, location, lat, lon);
    });
});

// Email bhejne ke liye alag function (taaki crash na ho)
function sendEmailNotification(complaintId, title, description, location, lat, lon) {
    const emailQuery = "SELECT email FROM Users WHERE (role = 'police' OR role = 'admin') AND email IS NOT NULL";
    
    pool.query(emailQuery, (emailErr, users) => {
        if (emailErr) {
            console.error("Email DB Error:", emailErr.message);
            return;
        }
        if (users.length > 0) {
            const emailList = users.map(user => user.email).join(', ');
            let googleMapsLink = (lat && lon) ? `https://www.google.com/maps?q=${lat},${lon}` : "#";

            const mailOptions = {
                from: `"Crime Reporting System" <${process.env.GMAIL_USER || 'YOUR_GMAIL_ID'}>`, // !! APNA EMAIL CHECK KAREIN !!
                to: emailList,
                subject: `🚨 New Complaint (#${complaintId}) at ${location}`,
                html: `
                    <p>New complaint reported:</p>
                    <p><b>Title:</b> ${title}</p>
                    <p><b>Location:</b> ${location}</p>
                    <p><b>GPS Map:</b> <a href="${googleMapsLink}">Click to View</a></p>
                `
            };

            // Email bhejo (Fail hone par crash mat karo)
            transporter.sendMail(mailOptions)
                .then(info => console.log('Notification email sent successfully to:', emailList))
                .catch(err => console.error('Email Failed to Send (Ignored):', err.message));
        }
    });
}
// --- FIX KHATAM ---

// Route 3: Get All Complaints
app.get('/api/complaints', (req, res) => {
    const sql = "SELECT * FROM Complaints ORDER BY created_at DESC";
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("Get Complaints Error:", err);
            return res.status(500).send({ message: 'Error fetching data' });
        }
        res.status(200).json(results);
    });
});

// Route 4: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; 
    const sql = "SELECT * FROM Users WHERE username = ? AND password = ?";
    pool.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Login Error:", err);
            return res.status(500).send({ message: 'Database error' });
        }
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
        if (err) {
            console.error("My Complaints Error:", err);
            return res.status(500).send({ message: 'Error fetching data' });
        }
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
    const { id } = req.params;
    const { status, priority, category } = req.body;
    const sql = "UPDATE Complaints SET status = ?, ai_priority = ?, ai_category = ? WHERE complaint_id = ?";
    pool.query(sql, [status, priority, category, id], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error' });
        res.status(200).send({ message: 'Updated' });
    });
});

const PORT = process.env.PORT || 5000; // Render ke liye PORT ko update kiya
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
