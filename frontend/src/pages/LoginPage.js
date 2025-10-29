import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <-- useParams ko import karein
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Person, LocalPolice, AdminPanelSettings } from '@mui/icons-material'; // Icons

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { role } = useParams(); // <-- URL se role nikaal rahe hain (citizen, police, admin)

    // Capitalize function (e.g., 'citizen' -> 'Citizen')
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    
    // Role ke hisaab se icon dikhayein
    const getIcon = () => {
        if (role === 'police') return <LocalPolice sx={{ fontSize: 40, mb: 2 }} />;
        if (role === 'admin') return <AdminPanelSettings sx={{ fontSize: 40, mb: 2 }} />;
        return <Person sx={{ fontSize: 40, mb: 2 }} />;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Ab 'login' function mein 'role' bhi bhej rahe hain
        login(username, password, role)
            .then(data => {
                navigate('/'); // Login successful, home page par bhej do (App.js logic handle karega)
            })
            .catch(err => {
                setError(err.message || 'Login failed');
            });
    };

    return (
        <Container maxWidth="xs"> {/* Chhota container (xs) login form ke liye best hai */}
            <Box component="form" onSubmit={handleSubmit} sx={{ 
                mt: 4, 
                p: 4, 
                boxShadow: 3, 
                borderRadius: 2, 
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {getIcon()}
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
                    {capitalize(role)} Login
                </Typography>
                
                <TextField
                    label="Username"
                    fullWidth
                    required
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                {error && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3, py: 1.5 }}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}

export default LoginPage;