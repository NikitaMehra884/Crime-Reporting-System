require('dotenv').config();
// --- 1. Tools ko import karna ---
const express = require('express');
const mysql = require('mysql2'); // Hum 'mysql2' ka use kar rahe hain
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// --- 2. Express app ko setup karna ---
const app = express();

const allowedOrigins = [
    'https://crime-reporting-system-five.vercel.app', // Yahan aapka Vercel link hai
    // Agar aap local par test karna chahte hain toh yeh rakhein, warna hata dein
    'http://localhost:3000' 
];

app.use(cors({
    origin: function (origin, callback) {
        // Check karo ki request kahan se aa rahi hai
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow karo
        } else {
            callback(new Error('CORS Error: This origin is not allowed.')); // Block karo
        }
    }
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. Database Connection (POOL BANANA - YEH HAI FIX) ---
// createConnection ki jagah createPool ka istemaal
// --- 3. Database Connection (Aiven Cloud) ---
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Render yahan se value uthayega
    user: process.env.DB_USER, // Render yahan se value uthayega
    password: process.env.DB_PASSWORD, // Render yahan se value uthayega
    database: 'defaultdb',
    port: process.env.DB_PORT, // Render yahan se value uthayega
    ssl: { rejectUnauthorized: false }         // <-- YEH LINE AIVEN KE LIYE ZAROORI HAI
});

// Check karte hain ki Pool connect hua ya nahi
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database pool connection failed:', err.stack);
        return;
    }
    console.log('Successfully connected to database (crime_db) using pool.');
    connection.release(); // Connection ko waapis pool mein bhej do
});

// --- Email Transporter Setup ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // 'service: gmail' hata kar 'host' use karein
    port: 465,              // Port 587 use karein (yeh kam block hota hai)
    secure: true,          // 587 ke liye secure: false rakhein
    requireTLS: true,       // TLS zaroori hai
    auth: {
        user: process.env.GMAIL_USER, // Render yahan se value uthayega
        pass: process.env.GMAIL_PASS    // !! YAHAN GMAIL KA APP PASSWORD DAALEIN !!
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error setting up email transporter:', error);
    } else {
        console.log('Email transporter is ready to send emails.');
    }
});

// --- Multer (File Storage) ka Setup ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- 5. API Routes (URLs) ---
// Har jagah 'db.query' ko 'pool.query' se badal diya gaya hai

// Test Route
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Route 1: Register
app.post('/api/register', (req, res) => {
    const { username, password, email, full_name, role } = req.body;
    const sql = "INSERT INTO Users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)";
    
    // db.query -> pool.query
    pool.query(sql, [username, password, email, full_name, role], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error registering user', error: err });
        }
        res.status(201).send({ message: 'User registered successfully!' });
    });
});


// Route 2: File Complaint (With Location, Video & New Email Format)
app.post('/api/complaints', upload.single('evidence'), (req, res) => {
    
    // 1. Data nikaalo (Latitude/Longitude ke saath)
    const { user_id, title, description, location, latitude, longitude } = req.body;
    
    // Null check for location
    const lat = (latitude === 'null' || latitude === 'undefined') ? null : latitude;
    const lon = (longitude === 'null' || longitude === 'undefined') ? null : longitude;
    
    // Video/Image path fix
    const evidenceUrl = req.file ? req.file.path.replace(/\\/g, '/') : null; 

    // 2. Database mein save karo
    const sql = "INSERT INTO Complaints (user_id, title, description, location, latitude, longitude, evidence_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    pool.query(sql, [user_id, title, description, location, lat, lon, evidenceUrl], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error filing complaint', error: err });
        }
        
        res.status(201).send({ message: 'Complaint filed successfully!', complaint_id: result.insertId });

        // 3. Email Notification Logic (Updated HTML)
        const complaintId = result.insertId;
        const emailQuery = "SELECT email FROM Users WHERE (role = 'police' OR role = 'admin') AND email IS NOT NULL";
        
        pool.query(emailQuery, (emailErr, users) => {
            if (emailErr) { 
                console.error("Error fetching emails:", emailErr);
            } 
            else if (users.length > 0) {
                const emailList = users.map(user => user.email).join(', ');
                
                // Google Maps Link banana
                let googleMapsLink = "#";
                if (lat && lon) {
                    googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
                }

                const mailOptions = {
                    from: `"Crime Reporting System" <nikitamehra898@gmail.com>`, // !! APNA EMAIL YAHAN CHECK KAREIN !!
                    to: emailList,
                    subject: `🚨 ACTION REQUIRED: New Complaint #${complaintId} at ${location}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; border-top: 5px solid #d32f2f;">
                            <h2 style="color: #d32f2f;">New Crime Reported</h2>
                            <p><strong>Title:</strong> ${title}</p>
                            <p><strong>Description:</strong> ${description}</p>
                            <hr style="border: 0; border-top: 1px solid #eee;" />
                            
                            <h3>📍 Location Details</h3>
                            <p><strong>Reported Address:</strong> ${location}</p>
                            
                            ${lat && lon ? 
                                `<p style="margin-top: 15px;">
                                    <strong>Live GPS Location Detected:</strong><br/><br/>
                                    <a href="${googleMapsLink}" style="background-color: #1565C0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                        📍 View Exact Location on Google Maps
                                    </a>
                                </p>` 
                                : 
                                `<p style="color: red; font-weight: bold;">⚠️ User did not share GPS location.</p>`
                            }
                            
                            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;" />
                            <p style="font-size: 12px; color: #666;">
                                Please login to the <a href="http://localhost:3000">Police Dashboard</a> to view evidence (Photos/Videos) and take action.
                            </p>
                        </div>
                    `
                };

                transporter.sendMail(mailOptions, (mailError, info) => {
                    if (mailError) {
                        console.error('Error sending notification email:', mailError);
                    } else {
                        console.log('Notification email sent successfully to:', emailList);
                    }
                });
            }
        });
    });
});

// Route 3: Get all Complaints (Yeh Police/Admin Dashboard ke liye hai)
app.get('/api/complaints', (req, res) => {
    const sql = "SELECT * FROM Complaints ORDER BY created_at DESC";
    // db.query -> pool.query
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error fetching complaints', error: err });
        }
        res.status(200).json(results);
    });
});

/// Route 4: Login (Fixed - No Role Required)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; // Sirf username aur password lo

    // Humne role ka check hata diya hai
    
    const sql = "SELECT * FROM Users WHERE username = ? AND password = ?";
    
    pool.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error', error: err });
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

// Route 5: Get complaints for a specific citizen (Citizen "My Complaints" page)
app.get('/api/complaints/citizen/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM Complaints WHERE user_id = ? ORDER BY created_at DESC";
    
    pool.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error fetching your complaints', error: err });
        }
        // Yeh citizen ki complaints bhejega
        res.status(200).json(results);
    });
});

// Route 6: Update complaint status (Police/Admin Dashboard se)
app.put('/api/complaints/status/:id', (req, res) => {
    const { id } = req.params; // Complaint ki ID
    const { status } = req.body; // Naya status (jaise 'In Progress')

    const sql = "UPDATE Complaints SET status = ? WHERE complaint_id = ?";
    
    pool.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error updating status', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Complaint not found' });
        }
        res.status(200).send({ message: 'Status updated successfully' });
    });
});

// --- 6. Server ko 'ON' karna ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

