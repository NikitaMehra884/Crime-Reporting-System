import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Link ko import kiya
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material'; // MUI Link ko bhi import kiya
import { LockOpen } from '@mui/icons-material'; // Login icon

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Error message ke liye
    
    const { login } = useContext(AuthContext); // Context se 'login' function nikala
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Purana error saaf karo

        // Context wala simple login function call kiya (bina role ke)
        login(username, password)
            .then(data => {
                // Login successful, ab App.js logic humein sahi dashboard par bhej dega
                navigate('/'); 
            })
            .catch(err => {
                setError(err.message || 'Invalid username or password'); // Error state set karo
            });
    };

    return (
        <Container maxWidth="xs"> {/* Chhota container (xs) login form ke liye best hai */}
            <Box component="form" onSubmit={handleSubmit} sx={{ 
                mt: 8, // Thoda aur neeche
                p: 4, 
                boxShadow: 3, 
                borderRadius: 2, 
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <LockOpen sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                    User Login
                </Typography>
                
                <TextField
                    label="Username"
                    fullWidth
                    required
                    margin="normal" // mt: 3 ki jagah
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
                
                {/* Agar error hai, toh yahan dikhao */}
                {error && (
                    <Typography color="error" align="center" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Typography>
                )}

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3, mb: 2, py: 1.5 }} // mb: 2 (neeche margin)
                >
                    Login
                </Button>

                {/* Register ka Link */}
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Link component={RouterLink} to="/register" variant="body2">
                        {"Don't have an account? Register Here"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default LoginPage;