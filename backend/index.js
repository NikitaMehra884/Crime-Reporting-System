// --- 1. Tools ko import karna ---
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer'); // <-- NAYA: Multer ko import kiya
const path = require('path'); // <-- NAYA: File path ke liye 'path' package
const nodemailer = require('nodemailer'); // <-- Email ke liye Nodemailer ko import kiya


// --- 2. Express app ko setup karna ---
const app = express();
app.use(cors());
app.use(express.json());

// --- NAYA: 'uploads' folder ko public banana ---
// Isse humara frontend images ko dekh payega
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. Database Connection ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nikita@987', // !! YAHAN APNA PASSWORD DAALEIN !!
    database: 'crime_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Successfully connected to database (crime_db).');
});
// --- NAYA: Email Transporter Setup (Using Gmail) ---
// IMPORTANT: Aapko apne Gmail account mein 'App Password' generate karna hoga.
//            Google par search karein "Gmail App Password"
const transporter = nodemailer.createTransport({
    service: 'gmail', // Hum Gmail use kar rahe hain
    auth: {
        user: 'nikitamehra898@gmail.com', // !! YAHAN APNA GMAIL ID DAALEIN !!
        pass: 'oiuu frnn jjid mcor'    // !! YAHAN GMAIL KA APP PASSWORD DAALEIN !! (Normal password nahi)
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error setting up email transporter:', error);
    } else {
        console.log('Email transporter is ready to send emails.');
    }
});
// --- Email Setup Khatam ---
// --- NAYA: Multer (File Storage) ka Setup ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Images ko 'uploads/' folder mein save karo
    },
    filename: (req, file, cb) => {
        // File ka naam unique banao (Date + Original Naam)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// --- 5. API Routes (URLs) ---

// Test Route
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Route 1: Register
app.post('/api/register', (req, res) => {
    const { username, password, email, full_name, role } = req.body;
    const sql = "INSERT INTO Users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [username, password, email, full_name, role], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error registering user', error: err });
        }
        res.status(201).send({ message: 'User registered successfully!' });
    });
});

// Route 2: File Complaint (UPDATE HO GAYA)
// Pehle yeh sirf JSON leta tha, ab yeh 'FormData' (text + file) lega
// 'upload.single('evidence')' ka matlab hai ki 'evidence' naam ki ek file aa rahi hai
app.post('/api/complaints', upload.single('evidence'), (req, res) => {
    
    // Text data ab 'req.body' mein aayega
    const { user_id, title, description, location } = req.body;
    
    // NAYA: File ka path (link) 'req.file' se aayega
    // Hum 'uploads\' ko '/' se replace kar rahe hain taaki URL sahi bane
    const evidenceUrl = req.file ? req.file.path.replace(/\\/g, '/') : null; 

    // NAYA: SQL query mein 'evidence_url' add ho gaya hai
    const sql = "INSERT INTO Complaints (user_id, title, description, location, evidence_url) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [user_id, title, description, location, evidenceUrl], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error filing complaint', error: err });
        }
        res.status(201).send({ message: 'Complaint filed successfully!', complaint_id: result.insertId });
        // --- NAYA: Email Notification Logic ---
                const complaintId = result.insertId;
                const complaintTitle = title; // Use the title from req.body

                // 1. Police/Admin ke emails fetch karo
                const emailQuery = "SELECT email FROM Users WHERE (role = 'police' OR role = 'admin') AND email IS NOT NULL";
                db.query(emailQuery, (emailErr, users) => {
                    if (emailErr) {
                        console.error("Error fetching user emails for notification:", emailErr);
                        // Email nahi gaya toh bhi complaint submit ho chuki hai, isliye error mat bhejo
                    } else if (users.length > 0) {

                        // 2. Sabhi ko email bhejo
                        const emailList = users.map(user => user.email).join(', '); // Comma-separated list banao

                        const mailOptions = {
                            from: '"Crime Reporting System" <nikitamehra898@gmail.com>', // Sender ka naam aur email (Gmail ID)
                            to: emailList, // Sabhi police/admin ko bhejo
                            subject: `New Complaint Registered (#${complaintId})`, // Email ka subject
                            text: `A new complaint has been registered in the portal.\n\nComplaint ID: ${complaintId}\nTitle: ${complaintTitle}\n\nPlease log in to the dashboard to view details and take action.`, // Plain text body
                            html: `<p>A new complaint has been registered in the portal.</p>
                                   <p><b>Complaint ID:</b> ${complaintId}</p>
                                   <p><b>Title:</b> ${complaintTitle}</p>
                                   <p>Please log in to the dashboard to view details and take action.</p>` // HTML body (optional)
                        };

                        // 3. Email bhejne ki koshish karo
                        transporter.sendMail(mailOptions, (mailError, info) => {
                            if (mailError) {
                                console.error('Error sending notification email:', mailError);
                            } else {
                                console.log('Notification email sent successfully to:', emailList);
                            }
                        });
                    }
                });
                // --- Email Notification Logic Khatam ---
    });
});

// Route 3: Get all Complaints
app.get('/api/complaints', (req, res) => {
    const sql = "SELECT * FROM Complaints ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error fetching complaints', error: err });
        }
        res.status(200).json(results);
    });
});

// Route 4: Login
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    if (!role) {
        return res.status(400).send({ message: 'Role is required' });
    }
    const sql = "SELECT * FROM Users WHERE username = ? AND password = ? AND role = ?";
    db.query(sql, [username, password, role], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Database error', error: err });
        }
        if (results.length > 0) {
            const user = results[0];
            delete user.password;
            res.status(200).send({ message: 'Login successful!', user: user });
        } else {
            res.status(401).send({ message: 'Invalid credentials or wrong portal' });
        }
    });
});
// --- NAYE ROUTES ---

// Route 5: Update Complaint Status (Police/Admin ke liye)
// Yeh PUT request lega, e.g., /api/complaints/5/status
app.put('/api/complaints/:complaintId/status', (req, res) => {
    const { complaintId } = req.params; // URL se complaint ID nikalo
    const { status, remarks } = req.body; // Body se naya status aur remarks nikalo

    // Validate status (optional but good practice)
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: 'Invalid status value' });
    }

    // SQL query to update status and remarks
    const sql = "UPDATE Complaints SET status = ?, remarks = ? WHERE complaint_id = ?";
    
    db.query(sql, [status, remarks || null, complaintId], (err, result) => {
        if (err) {
            console.error("Error updating status:", err);
            return res.status(500).send({ message: 'Error updating complaint status', error: err });
        }
        if (result.affectedRows === 0) {
            // Agar us ID ki complaint mili hi nahi
            return res.status(404).send({ message: 'Complaint not found' });
        }
        res.status(200).send({ message: 'Complaint status updated successfully!' });
    });
});

// Route 6: Get ONLY My Complaints (Citizen ke liye)
// Yeh GET request lega, e.g., /api/my-complaints?userId=3
app.get('/api/my-complaints', (req, res) => {
    const userId = req.query.userId; // URL query se user ID nikalo (e.g., ?userId=1)

    if (!userId) {
        return res.status(400).send({ message: 'User ID is required' });
    }

    // SQL query sirf us user ki complaints layega
    const sql = "SELECT * FROM Complaints WHERE user_id = ? ORDER BY created_at DESC";
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user complaints:", err);
            return res.status(500).send({ message: 'Error fetching complaints', error: err });
        }
        res.status(200).json(results); // User ki complaints bhej do
    });
});

// --- NAYE ROUTES KHATAM ---
// --- 6. Server ko 'ON' karna ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
