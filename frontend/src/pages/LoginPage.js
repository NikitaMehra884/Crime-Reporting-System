import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material'; 
import { LockOpen } from '@mui/icons-material'; 

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    
    const { login } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); 

        // Login function (AuthContext) automatically Render URL use karega agar wahan update kiya hai
        // Lekin agar AuthContext mein localhost reh gaya ho, toh wahan bhi check karna zaroori hai.
        login(username, password)
            .then(data => {
                navigate('/'); 
            })
            .catch(err => {
                setError(err.message || 'Invalid username or password'); 
            });
    };

    return (
        <Container maxWidth="xs"> 
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LockOpen sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                    User Login
                </Typography>
                
                <TextField label="Username" fullWidth required margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" type="password" fullWidth required margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
                
                {error && <Typography color="error" align="center" sx={{ mt: 2, width: '100%' }}>{error}</Typography>}

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2, py: 1.5 }}>
                    Login
                </Button>

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