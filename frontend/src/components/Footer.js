import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter } from '@mui/icons-material'; // Icons

function Footer() {
    return (
        // Box component footer ke liye container ka kaam karega
        <Box 
            component="footer" 
            sx={{
                py: 4, // Padding upar-neeche
                px: 2, // Padding left-right
                mt: 'auto', // Yeh footer ko page ke bottom mein push karega
                backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' ? '#27303a' : '#0D47A1', // Dark mode mein Lighter Navy, Light mode mein Deep Blue
                color: 'white', // Text color white
                borderTop: '4px solid', // Upar ek line
                borderColor: 'secondary.main' // Khaki color ki line (Theme se)
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">

                    {/* Section 1: Contact Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                                [Police Station Address], Nainital, Uttarakhand
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ mr: 1, fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                                +91 [Police Station Phone]
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email sx={{ mr: 1, fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                                [Police Station Email]
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Section 2: Quick Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Quick Links
                        </Typography>
                        {/* Aap yahan important websites ke link daal sakte hain */}
                        <Link href="https://uttarakhandpolice.uk.gov.in/" color="inherit" display="block" variant="body2" sx={{ mb: 0.5, '&:hover': { textDecoration: 'underline' } }}>
                            Uttarakhand Police Website
                        </Link>
                        <Link href="#" color="inherit" display="block" variant="body2" sx={{ mb: 0.5, '&:hover': { textDecoration: 'underline' } }}>
                            National Crime Records Bureau
                        </Link>
                        <Link href="#" color="inherit" display="block" variant="body2" sx={{ mb: 0.5, '&:hover': { textDecoration: 'underline' } }}>
                            Report Cyber Crime
                        </Link>
                    </Grid>

                    {/* Section 3: Emergency Numbers */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Emergency Numbers
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Police: 112 / 100</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Fire: 101</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Ambulance: 102 / 108</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Women Helpline: 1090</Typography>
                    </Grid>

                    {/* Section 4: Social Media */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Follow Us
                        </Typography>
                        <IconButton href="#" color="inherit" aria-label="Facebook">
                            <Facebook />
                        </IconButton>
                        <IconButton href="#" color="inherit" aria-label="Twitter">
                            <Twitter />
                        </IconButton>
                        {/* Aap aur social media icons add kar sakte hain */}
                    </Grid>

                </Grid>
                
                {/* Copyright Text */}
                <Typography variant="body2" align="center" sx={{ mt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.2)', pt: 2 }}>
                    {'Copyright © '}
                    <Link color="inherit" href="#">
                        Police Citizen Portal, Nainital
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'. All rights reserved.'}
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
