import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('citizen'); 
    
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData = {
            username: username,
            password: password,
            email: email,
            full_name: fullName,
            role: role
        };

        // !! YEH HAI FIX: Render URL !!
        axios.post('https://crime-backend-ptv8.onrender.com/api/register', userData)
            .then(response => {
                alert('Registration Successful! You can now file complaints.');
                navigate('/login'); 
            })
            .catch(error => {
                console.error('Registration error:', error.response ? error.response.data : error.message);
                alert('Registration Failed. Username or Email might already exist.');
            });
    };

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
                    Create New Account
                </Typography>
                
                <TextField label="Full Name (Poora Naam)" fullWidth required margin="normal" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <TextField label="Email Address" type="email" fullWidth required margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Username (for login)" fullWidth required margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" type="password" fullWidth required margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
                
                <TextField
                    label="Role (Aap kaun hain?)"
                    select 
                    fullWidth
                    required
                    margin="normal"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="citizen">Citizen (Aam Nagrik)</MenuItem>
                </TextField>

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.5 }}>
                    Register
                </Button>
            </Box>
        </Container>
    );
}

export default RegisterPage;