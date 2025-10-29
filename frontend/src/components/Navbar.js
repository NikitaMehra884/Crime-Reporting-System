import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Logout ke baad home page (portal) par bhej do
    };

    return (
        // AppBar (Main Navbar)
        <AppBar position="static" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
            <Toolbar>
                {/* Logo / Title */}
                {/* Hum yahan example ke liye Indian State Emblem use kar rahe hain */}
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" 
                    alt="State Emblem" 
                    style={{ height: '40px', marginRight: '16px' }} 
                />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}
                >
                    Police Citizen Portal
                </Typography>

                {/* Links */}
                <Box>
                    {/* Yeh check karega ki user logged-in hai ya nahi */}
                    {user && (
                        <>
                            {/* Welcome Message */}
                            <Typography 
                                component="span" 
                                sx={{ mr: 3, color: 'text.secondary' }}
                            >
                                Welcome, {user.full_name || user.username}!
                            </Typography>
                            
                            {/* File Complaint Button (agar user citizen hai aur home par nahi hai) */}
                            {user.role === 'citizen' && window.location.pathname !== '/' && (
                                <Button 
                                component={RouterLink} 
                                to="/new-complaint" // 
                                sx={{ mr: 1, color: 'text.primary' }}
                            >
                                File Complaint
                            </Button>
                            )}
                            {/* Dashboard Button (agar user police/admin hai aur home par nahi hai) */}
                            {(user.role === 'police' || user.role === 'admin') && window.location.pathname !== '/' && (
                                <Button 
                                    component={RouterLink} 
                                    to="/" 
                                    sx={{ mr: 1, color: 'text.primary' }}
                                >
                                    Dashboard
                                </Button>
                            )}

                            {/* Logout Button */}
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                    {/* Logged-out state (Login/Register buttons) ab yahan nahi hai */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;