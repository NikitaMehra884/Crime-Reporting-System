import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { ArrowBack, PhoneInTalk } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function CyberCrimeInfo() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBack />} component={RouterLink} to="/" sx={{ mb: 2 }}>Back to Home</Button>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    Cyber Crime Awareness
                </Typography>
                
                <Box sx={{ border: '2px solid #d32f2f', p: 2, borderRadius: 2, mb: 3, display: 'flex', alignItems: 'center', color: '#d32f2f' }}>
                    <PhoneInTalk sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" fontWeight="bold">National Cyber Crime Helpline: 1930</Typography>
                </Box>

                <Typography variant="h6" gutterBottom>Common Types of Cyber Fraud:</Typography>
                <ul>
                    <li><strong>Phishing:</strong> Fake emails/messages asking for passwords.</li>
                    <li><strong>UPI Fraud:</strong> Scammers asking you to scan QR codes to "receive" money.</li>
                    <li><strong>Identity Theft:</strong> Using your photos/name to create fake profiles.</li>
                </ul>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Safety Tips:</Typography>
                <Typography paragraph>
                    1. Never share OTPs with anyone.<br/>
                    2. Do not click on unknown links.<br/>
                    3. Use strong passwords and enable 2-Factor Authentication.<br/>
                    4. Report immediately at <strong>www.cybercrime.gov.in</strong> or dial 1930.
                </Typography>
            </Paper>
        </Container>
    );
}

export default CyberCrimeInfo;