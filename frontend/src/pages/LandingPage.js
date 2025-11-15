import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// YEH HAI FIX: 'Link' ko yahan add kar diya gaya hai
import { Box, Container, Typography, Button, Grid, Paper, Link } from '@mui/material';
import { LocalPolice, Security, Gavel } from '@mui/icons-material';

function LandingPage() {
    return (
        <Box>
            {/* --- HERO SECTION (PHOTO WALA HISSA) --- */}
            <Paper 
                elevation={0}
                sx={{
                    height: '600px', 
                    width: '100%',
                    // Online Image Link
                    backgroundImage: 'url("/hero-image.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                }}
            >
                {/* Black Overlay */}
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)' 
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
                    <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2, textShadow: '2px 2px 4px black' }}>
                       Uttarakhand Vigilance Portal
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 5, fontWeight: 300, textShadow: '1px 1px 2px black' }}>
                        Connect • Report • Resolve
                         <br />
                        Mitrata • Seva • Suraksha
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            size="large" 
                            component={RouterLink} 
                            to="/login"
                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                        >
                            Login
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="inherit" 
                            size="large" 
                            component={RouterLink} 
                            to="/register"
                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderColor: 'white', color: 'white' }}
                        >
                            Register
                        </Button>
                    </Box>
                </Container>
            </Paper>

            {/* --- INFO SECTION (CLICKABLE BOXES) --- */}
            <Container maxWidth="lg" sx={{ mt: -8, mb: 8, position: 'relative', zIndex: 3 }}>
                <Grid container spacing={4} justifyContent="center">
                    
                    {/* Box 1: Citizen Services */}
                    <Grid item xs={12} md={4}>
                        <Link component={RouterLink} to="/citizen-services" sx={{ textDecoration: 'none' }}>
                            <Paper elevation={6} sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                                <LocalPolice sx={{ fontSize: 60, color: '#1565C0', mb: 2 }} />
                                <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">Citizen Services</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    File complaints online instantly without visiting the police station. Track real-time status.
                                </Typography>
                            </Paper>
                        </Link>
                    </Grid>

                    {/* Box 2: Cyber Crime */}
                    <Grid item xs={12} md={4}>
                        <Link component={RouterLink} to="/cyber-crime" sx={{ textDecoration: 'none' }}>
                            <Paper elevation={6} sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                                <Security sx={{ fontSize: 60, color: '#1565C0', mb: 2 }} />
                                <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">Cyber Crime</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Securely report online frauds and harassment. Dedicated support for cyber safety.
                                </Typography>
                            </Paper>
                        </Link>
                    </Grid>

                    {/* Box 3: Law & RTI */}
                    <Grid item xs={12} md={4}>
                        <Link component={RouterLink} to="/law-rti" sx={{ textDecoration: 'none' }}>
                            <Paper elevation={6} sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                                <Gavel sx={{ fontSize: 60, color: '#1565C0', mb: 2 }} />
                                <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">Law & RTI</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Access legal information, Know Your Rights, and use the Right to Information Act efficiently.
                                </Typography>
                            </Paper>
                        </Link>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}

export default LandingPage;