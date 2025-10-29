import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Link } from '@mui/material'; // <-- Paper aur Link add kiye
import { Person, LocalPolice, AdminPanelSettings, Gavel, LocalHospital, PhoneInTalk } from '@mui/icons-material'; // Naye icons add kiye
// Yeh ek reusable card component hai
function PortalCard({ title, description, icon, link }) {
    return (
        <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%', transition: '0.3s', '&:hover': { boxShadow: 10 } }}>
                <CardActionArea component={RouterLink} to={link} sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                        {/* Bada icon */}
                        {React.cloneElement(icon, { sx: { fontSize: 60 } })}
                    </Box>
                    <CardContent>
                        <Typography variant="h4" component="div" gutterBottom align="center" sx={{ fontWeight: 700 }}>
                            {title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center">
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

// Main Home Page Component
function HomePage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                Welcome to the Police Citizen Portal
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                Please select your login portal to continue.
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
                <PortalCard
                    title="Citizen Login"
                    description="File a new complaint, track status, and view history."
                    icon={<Person />}
                    link="/login/citizen" // <-- Link to login page with role
                />
                <PortalCard
                    title="Police Login"
                    description="View assigned complaints, update status, and manage reports."
                    icon={<LocalPolice />}
                    link="/login/police" // <-- Link to login page with role
                />
                <PortalCard
                    title="Authority Login"
                    description="Full access to all complaints, user management, and analytics."
                    icon={<AdminPanelSettings />}
                    link="/login/admin" // <-- Link to login page with role
                />
            </Grid>
{/* --- NAYA Information Section --- */}
<Divider sx={{ my: 6, borderColor: 'rgba(0, 0, 0, 0.12)' }} /> {/* Ek line separator */}

<Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 4 }}>
    Important Information & Resources
</Typography>

<Grid container spacing={4} justifyContent="center">
    {/* Box 1: Local Police Info */}
    <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <LocalPolice sx={{ mr: 1, color: 'primary.main' }} /> Local Police Station
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                **Address:** [Police Station Address], Nainital
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                **Phone:** [Police Station Phone]
            </Typography>
            <Typography variant="body2">
                **Incharge:** [Officer's Name/Designation]
            </Typography>
            {/* Aap yahan Google Maps ka link ya embed bhi daal sakte hain */}
        </Paper>
    </Grid>

    {/* Box 2: Important Laws */}
    <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <Gavel sx={{ mr: 1, color: 'primary.main' }} /> Know Your Rights & Laws
            </Typography>
            <List dense>
                {/* Yahan aap important laws ke points ya links daal sakte hain */}
                <ListItem>
                    <ListItemText primary="Fundamental Rights (Article 14-32)" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="IPC Sections related to common crimes" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Rights during Police interaction" />
                </ListItem>
                <ListItem>
                    <Link href="#" variant="body2">Read More...</Link> {/* Link to a detailed page */}
                </ListItem>
            </List>
        </Paper>
    </Grid>

    {/* Box 3: Helplines */}
    <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <PhoneInTalk sx={{ mr: 1, color: 'primary.main' }} /> Helplines
            </Typography>
             <List dense>
                <ListItem>
                    <ListItemIcon><LocalPolice fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Police Emergency: 112" />
                </ListItem>
                <ListItem>
                     <ListItemIcon><LocalHospital fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Ambulance: 108 / 102" />
                </ListItem>
                <ListItem>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Women Helpline: 1090" />
                </ListItem>
                 <ListItem>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Child Helpline: 1098" />
                </ListItem>
            </List>
        </Paper>
    </Grid>
</Grid>
{/* --- Information Section Khatam --- */}
            {/* Register link */}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Typography variant="body1" color="text.secondary">
                    Don't have an account? 
                    <RouterLink 
                        to="/register" 
                        style={{ textDecoration: 'none', color: '#8D2424', fontWeight: 'bold', marginLeft: '8px' }}
                    >
                        Register Here
                    </RouterLink>
                </Typography>
            </Box>
        </Container>
    );
}

export default HomePage;