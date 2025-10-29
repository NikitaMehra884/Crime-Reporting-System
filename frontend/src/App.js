// ... baaki imports

import React, { useContext } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Container } from '@mui/material'; // Container ko import karein

// Pages and Components
import Navbar from './components/Navbar'; // Naya Navbar import karein
import ComplaintForm from './components/ComplaintForm';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // <-- YEH LINE ADD KAREIN
import HomePage from './pages/HomePage';
import CitizenComplaintsPage from './pages/CitizenComplaintsPage';
import Footer from './components/Footer';
function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="App">
        
        {/* Puraani Nav ki jagah naya AppBar Navbar */}
        <Navbar />

        {/* Pages ko ek Container mein daal rahe hain taaki side se padding rahe */}
        <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        
           <Routes>
            
            {/* Login aur Register ke Routes */}
            <Route path="/login/:role" element={!user ? <LoginPage /> : <Navigate to="/" />} /> {/* <-- :role add kiya */}
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route 
          path="/new-complaint" 
          element={
            user && user.role === 'citizen' ? <ComplaintForm /> : <Navigate to="/" />
          } 
        />
            {/* Home Page Route */}
            <Route 
              path="/" 
              element={
            !user ? ( <HomePage /> ) :                     
            (user.role === 'citizen') ? ( <CitizenComplaintsPage /> ) : // <-- YEH CHANGE HUA HAI
            ( <DashboardPage /> )                         
          }
            />

          </Routes>
        </Container>
        
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;