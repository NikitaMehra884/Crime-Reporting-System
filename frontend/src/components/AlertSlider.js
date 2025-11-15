import React from 'react';
import { Box, Typography } from '@mui/material';

function AlertSlider() {
    return (
        // Container Box (Red Background)
        <Box 
            sx={{ 
                backgroundColor: '#d32f2f', // Alert Red color
                color: '#ffffff',           // White Text
                overflow: 'hidden',         // Text bahar na nikle
                py: 0.5,                    // Thodi padding upar-neeche
                position: 'relative',
                zIndex: 10                  // Navbar ke neeche rahe
            }}
        >
            {/* Moving Text Animation */}
            <Box 
                sx={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',   // Text ek line mein rahe
                    animation: 'scroll-text 25s linear infinite', // 25 seconds mein poora ghoomega
                    paddingLeft: '100%',     // Screen ke bahar se shuru hoga
                    
                    // Animation Keyframes definition
                    '@keyframes scroll-text': {
                        '0%': {
                            transform: 'translateX(0%)'
                        },
                        '100%': {
                            transform: 'translateX(-100%)' // Left side mein gayab ho jayega
                        }
                    }
                }}
            >
                <Typography 
                    variant="subtitle2" 
                    component="span" 
                    sx={{ fontWeight: 'bold', letterSpacing: 1, fontSize: '0.9rem' }}
                >
                    {/* --- YAHAN APNA MESSAGE LIKHEIN --- */}
                    WELCOME TO THE POLICE CITIZEN PORTAL — 
                    DIAL 112 FOR EMERGENCY — 
                    REPORT CYBER CRIME AT 1930 — 
                    UTTARAKHAND POLICE IS ALWAYS WITH YOU — 
                    STAY VIGILANT, STAY SAFE.
                </Typography>
            </Box>
        </Box>
    );
}

export default AlertSlider;