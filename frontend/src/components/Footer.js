import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, Instagram } from '@mui/icons-material';

function Footer() {
    return (
        <Box 
            component="footer" 
            sx={{
                bgcolor: '#0a1929', // Very Dark Blue (Official Look)
                color: 'white',
                py: 6,
                mt: 'auto',
                borderTop: '4px solid #D32F2F' // Red Line on top
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    
                    {/* Contact Info */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#90caf9' }}>
                            Help Desk
                        </Typography>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, color: '#90caf9' }} />
                            <Typography variant="body2">12 Subhash Road, Police Headquarters, Dehradun, Uttarakhand 248001</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                            <Phone sx={{ mr: 1, color: '#90caf9' }} />
                            <Typography variant="body2">9411112985</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                            <Email sx={{ mr: 1, color: '#90caf9' }} />
                            <Typography variant="body2">dgc-police-ua@nic.in</Typography>
                        </Box>
                    </Grid>

                    {/* Policies / Links */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#90caf9' }}>
                            Our Policies
                        </Typography>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#90caf9' } }}>Accessibility Statement</Link>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#90caf9' } }}>Privacy Policy</Link>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#90caf9' } }}>Hyperlinking Policy</Link>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#90caf9' } }}>Copyright Policy</Link>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#90caf9' }}>
                            Quick Links
                        </Typography>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#90caf9' } }}>Organization Setup</Link>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#90caf9' } }}>Who's Who</Link>
                        <Link href="#" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#90caf9' } }}>RTI</Link>
                        
                        <Box sx={{ mt: 2 }}>
                            <IconButton color="inherit"><Facebook /></IconButton>
                            <IconButton color="inherit"><Twitter /></IconButton>
                            <IconButton color="inherit"><Instagram /></IconButton>
                        </Box>
                    </Grid>
                </Grid>

                <Typography variant="body2" align="center" sx={{ mt: 5, opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                    © 2025 Uttarakhand Police - All Rights Reserved.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;