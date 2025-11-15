import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { CheckCircle, ArrowBack } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function CitizenServices() {
    const services = [
        "Online Complaint Registration (e-FIR)",
        "View FIR Status",
        "Character Verification Request",
        "Tenant / Servant Verification",
        "Lost Property Registration",
        "Procession Request",
        "Employee Verification",
        "Protest/Strike Request"
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBack />} component={RouterLink} to="/" sx={{ mb: 2 }}>Back to Home</Button>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#1565C0', fontWeight: 'bold' }}>
                    Citizen Services
                </Typography>
                <Typography paragraph>
                    Uttarakhand Police offers various online services to ensure safety and convenience for citizens. 
                    You can access the following services directly through this portal or by visiting the nearest police station.
                </Typography>
                
                <Box sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Available Services:</Typography>
                    <List>
                        {services.map((text, index) => (
                            <ListItem key={index}>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Paper>
        </Container>
    );
}

export default CitizenServices;