import React, { useState, useContext } from 'react';
import axios from 'axios';
// MUI Components
import { TextField, Button, Container, Typography, Box } from '@mui/material'; 
// Auth Context se user data lene ke liye
import { AuthContext } from '../context/AuthContext';
// Icon
import { UploadFile } from '@mui/icons-material';

function ComplaintForm() {
    // Form fields ke liye state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    // File upload ke liye state
    const [evidenceFile, setEvidenceFile] = useState(null); 
    const [fileName, setFileName] = useState('No file chosen'); 

    // Logged-in user ka data context se lena
    const { user } = useContext(AuthContext);

    // Jab user file select karta hai
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEvidenceFile(file); 
            setFileName(file.name); 
        } else {
            setEvidenceFile(null); 
            setFileName('No file chosen');
        }
    };

    // Jab form submit hota hai
    const handleSubmit = (e) => {
        e.preventDefault(); 

        if (!user) {
            alert("You must be logged in to file a complaint.");
            return;
        }

        const formData = new FormData();
        formData.append('user_id', user.user_id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        
        if (evidenceFile) {
            formData.append('evidence', evidenceFile);
        }

        axios.post('http://localhost:5000/api/complaints', formData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        })
        .then(response => {
            alert('Complaint Filed Successfully!'); 
            setTitle('');
            setDescription('');
            setLocation('');
            setEvidenceFile(null);
            setFileName('No file chosen');
            document.getElementById('evidence-upload-input').value = null; 
        })
        .catch(error => {
            console.error('Error filing complaint:', error.response ? error.response.data : error.message);
            alert('Failed to file complaint. Please try again.');
        });
    };

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit} noValidate encType="multipart/form-data" 
                 sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper' }}>
                
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
                    File a New Complaint
                </Typography>
                
                <TextField
                    label="Title / Crime"
                    fullWidth
                    required
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Description (Poori jaankari dein)"
                    fullWidth
                    required
                    multiline
                    rows={5} 
                    margin="normal"
                    value={description}
                    // YAHAN PAR TYPO THA (e.gtarget -> e.target) - AB FIX HO GAYA
                    onChange={(e) => setDescription(e.target.value)} 
                />
                <TextField
                    label="Location (Jagah)"
                    fullWidth
                    required
                    margin="normal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                
                {/* File Upload Section */}
                <Box sx={{ border: '1px dashed grey', borderRadius: 2, p: 2, mt: 2, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        component="label" 
                        startIcon={<UploadFile />}
                        sx={{ mb: 1 }}
                    >
                        Upload Evidence (Photo/Optional)
                        <input 
                            id="evidence-upload-input" 
                            type="file"
                            hidden 
                            onChange={handleFileChange}
                            accept="image/*" 
                        />
                    </Button>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        Selected: {fileName} 
                    </Typography>
                </Box>
                {/* File Upload Section Khatam */}

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
                >
                    Submit Report
                </Button>
            </Box>
        </Container>
    );
}

export default ComplaintForm;

