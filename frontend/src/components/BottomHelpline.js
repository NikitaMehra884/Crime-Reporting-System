import React from 'react';
import { Box, Typography } from '@mui/material';
import { PhoneInTalk } from '@mui/icons-material';

function BottomHelpline() {
    return (
        // Container Box (Yellow Background)
        <Box 
            sx={{ 
                backgroundColor: '#FFC107', // Amber/Yellow Color
                color: '#000000',           // Black Text
                overflow: 'hidden',         // Text bahar na nikle
                py: 1,                      // Padding
                borderTop: '2px solid #000', // Upar ek black line border
                position: 'relative',
                zIndex: 5
            }}
        >
            {/* Moving Text Animation */}
            <Box 
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    // Animation (Thoda slow rakha hai taaki number padh sakein)
                    animation: 'scroll-left 30s linear infinite', 
                    paddingLeft: '100%',
                    
                    '@keyframes scroll-left': {
                        '0%': { transform: 'translateX(0%)' },
                        '100%': { transform: 'translateX(-100%)' }
                    }
                }}
            >
                {/* Icon */}
                <PhoneInTalk sx={{ mr: 1 }} />
                
                {/* Text Content */}
                <Typography 
                    variant="subtitle1" 
                    component="span" 
                    sx={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: 1 }}
                >
                    HELPLINE NUMBERS: 
                    POLICE CONTROL ROOM - 112 &nbsp; | &nbsp; 
                    WOMEN POWER LINE - 1090 &nbsp; | &nbsp; 
                    CYBER CRIME - 1930 &nbsp; | &nbsp; 
                    FIRE SERVICE - 101 &nbsp; | &nbsp; 
                    AMBULANCE - 108 &nbsp; | &nbsp; 
                    CHILD HELPLINE - 1098 &nbsp; | &nbsp; 
                    STAY ALERT, STAY SAFE.
                </Typography>
            </Box>
        </Box>
    );
}

export default BottomHelpline;