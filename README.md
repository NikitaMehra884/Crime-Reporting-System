# 🚨 Crime Reporting System

A full-stack **Crime Reporting System** that allows citizens to report crimes, upload evidence, share location, and track complaint status. It helps authorities manage cases efficiently and respond faster.

---

## 🚀 Features

- 📝 Crime Complaint Submission  
- 📍 Live Location Tracking (Google Maps)  
- 📸 Evidence Upload (Images/Documents)  
- 📧 Email Notifications  
- 👤 User Authentication (Login/Register)  
- 📊 Admin Dashboard  
- 🧾 Complaint Status Tracking  
- 🔐 Secure Backend APIs  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- HTML  
- CSS  
- JavaScript  

### Backend
- Node.js  
- Express.js  

### Database
- MySQL  

### Tools & APIs
- Google Maps API  
- Nodemailer (Email Service)  
- Multer (File Uploads)  
- JWT Authentication  

---

## 📂 Project Structure

Crime-Reporting-System/
│
├── backend/
│   ├── certs/
│   ├── uploads/
│   ├── .env
│   ├── db.js
│   ├── index.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│
├── README.md
└── .gitignore

---

## ⚙️ How to Run the Project

### 🔹 Step 1: Clone Repository
```bash
git clone https://github.com/your-username/crime-reporting-system.git
cd crime-reporting-system
```

---

## 🔹 Step 2: Setup Backend (IMPORTANT)

```bash
cd backend
npm install
```

### ▶️ Run Backend Server

```bash
node index.js
```

✔️ Expected Output:
- Server running on port 5000  
- Database connected (MySQL)  

⚠️ Make sure MySQL server is running before starting backend.

---

## 🔹 Step 3: MySQL Database Setup

- MySQL server ON hona chahiye  
- Database create karo (example: `crime_db`)  
- Required tables create hone chahiye (users, complaints etc.)  

### Example DB Config (db.js)

```js
host: "localhost",
user: "root",
password: "your_password",
database: "crime_db"
```

---

## 🔹 Step 4: Setup Frontend

```bash
cd frontend
npm install
```

### ▶️ Run Frontend

```bash
npm start
```

✔️ Frontend runs on:
http://localhost:3000  

---

## 📍 Location Tracking

- Google Maps API used  
- User ka live location capture hota hai  
- Complaint ke saath location store hoti hai  

---

## 📧 Email Notifications

- Complaint submit hone par mail jata hai  
- Admin alerts bhi send hote hain  
- Nodemailer use kiya gaya hai  

---

## 📸 File Upload System

- Evidence upload (images/docs)  
- `/uploads` folder me store hota hai  
- Multer middleware use kiya gaya hai  

---

## 🔐 Authentication

- JWT based login system  
- Secure password handling  
- User sessions manage kiye gaye hain  

---

## 📊 Admin Dashboard

- Sab complaints view kar sakte hain  
- Status update kar sakte hain  
- Users manage kar sakte hain  

---

## 💡 Use Cases

- Public Crime Reporting  
- College Safety System  
- Smart City Applications  
- Emergency Reporting  

---

## 🧪 Future Enhancements

- 📱 Mobile App  
- 🧠 AI Crime Prediction  
- 🗺️ Crime Heatmap  
- 🔔 Real-time Notifications  
- 🆘 SOS Button  

---

## 👩‍💻 Author

Nikita Mehra  
B.Tech CSE | Full Stack Developer  

---

## 📌 Conclusion

This system provides a reliable way to report crimes with location tracking, evidence upload, and real-time updates, helping authorities take faster action.
