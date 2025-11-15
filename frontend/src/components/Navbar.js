import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Chip ko import list se hata diya hai
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'; 
import { WarningAmber } from '@mui/icons-material';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    return (
        <AppBar position="static" elevation={4} sx={{ backgroundColor: '#0D47A1', color: '#FFFFFF' }}>
            <Toolbar>
                {/* Logo */}
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" 
                    alt="State Emblem" 
                    style={{ height: '45px', marginRight: '15px', filter: 'brightness(0) invert(1)' }} 
                />
                
                {/* Title */}
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ flexGrow: 1, fontWeight: 700, color: 'inherit' }} 
                >
                    Police Citizen Portal
                </Typography>

                {/* --- FAKE COMPLAINT ALERT (Right Side) --- */}
                <Box 
                    sx={{ 
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center', 
                        backgroundColor: '#ffcdd2', // Light Red background
                        color: '#b71c1c',           // Dark Red text
                        padding: '4px 12px',
                        borderRadius: '20px',
                        marginRight: 2,
                        border: '1px solid #b71c1c'
                    }}
                >
                    <WarningAmber sx={{ fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                        WARNING: False complaints are punishable under IPC Section 182.
                    </Typography>
                </Box>

                {/* User Links */}
                <Box>
                    {user && (
                        <>
                            <Typography 
                                component="span" 
                                sx={{ mr: 3, fontSize: '0.9rem', fontWeight: 500, color: '#E3F2FD' }} 
                            >
                                Welcome, {user.full_name || user.username}
                            </Typography>
                            
                            {user.role === 'citizen' && (
                                <Button 
                                    component={RouterLink} 
                                    to="/new-complaint"
                                    color="inherit" 
                                    sx={{ mr: 1, fontWeight: 600 }}
                                >
                                    File Complaint
                                </Button>
                            )}
                            
                            {(user.role === 'police' || user.role === 'admin') && (
                                <Button 
                                    component={RouterLink} 
                                    to="/" 
                                    color="inherit" 
                                    sx={{ mr: 1, fontWeight: 600 }}
                                >
                                    Dashboard
                                </Button>
                            )}

                            <Button 
                                variant="outlined" 
                                color="inherit" 
                                onClick={handleLogout}
                                sx={{ borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } }}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;