import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Container, Box } from '@mui/material'; 

// --- Humare Saare Pages aur Components ---
import Navbar from './components/Navbar';
import AlertSlider from './components/AlertSlider'; // Top wala slider
import BottomHelpline from './components/BottomHelpline';
import Footer from './components/Footer'; 
import CitizenComplaintsPage from './pages/CitizenComplaintsPage'; 
import ComplaintForm from './components/ComplaintForm';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import LandingPage from './pages/LandingPage'; 

// --- NAYE INFO PAGES (Jo warning de rahe the) ---
import CitizenServices from './pages/CitizenServices';
import CyberCrimeInfo from './pages/CyberCrimeInfo';
import LawInfo from './pages/LawInfo';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', 
        bgcolor: 'background.default' 
      }}>
        
        <Navbar />
<AlertSlider />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            
            {/* --- YEH LINES MISSING THIN (Ab add kar di hain) --- */}
            <Route path="/citizen-services" element={<CitizenServices />} />
            <Route path="/cyber-crime" element={<CyberCrimeInfo />} />
            <Route path="/law-rti" element={<LawInfo />} />
            
            {/* --- Baaki ke Routes --- */}
            <Route 
              path="/login" 
              element={
                !user ? (
                  <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}><LoginPage /></Container>
                ) : <Navigate to="/" />
              } 
            />
            <Route 
              path="/register" 
              element={
                !user ? (
                  <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}><RegisterPage /></Container>
                ) : <Navigate to="/" />
              } 
            />
            <Route 
              path="/new-complaint" 
              element={
                user && user.role === 'citizen' ? (
                  <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}><ComplaintForm /></Container>
                ) : <Navigate to="/login" />
              } 
            />
            
            {/* Home Page Route */}
            <Route 
              path="/" 
              element={
                !user ? ( 
                    <LandingPage /> 
                ) : 
                (user.role === 'citizen') ? ( 
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}><CitizenComplaintsPage /></Container> 
                ) : 
                ( 
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}><DashboardPage /></Container> 
                )
              } 
            />

          </Routes>
        </Box>
        <BottomHelpline />
        <Footer /> 

      </Box>
    </BrowserRouter>
  );
}

export default App;