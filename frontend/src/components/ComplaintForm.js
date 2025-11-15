import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// CircularProgress aur Alert ko neeche waali line se hata diya gaya hai
import { TextField, Button, Container, Typography, Box } from '@mui/material'; 
import { AuthContext } from '../context/AuthContext';
import { UploadFile, LocationOn } from '@mui/icons-material';

function ComplaintForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [evidenceFile, setEvidenceFile] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    
    // Location States
    const [lat, setLat] = useState(null); // Latitude (Jab yeh null hai, submit disabled rahega)
    const [long, setLong] = useState(null); // Longitude
    const [locationStatus, setLocationStatus] = useState(''); // Message dikhane ke liye

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setEvidenceFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    // --- Live Location Lena ---
    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('ERROR: Geolocation is not supported by your browser');
        } else {
            setLocationStatus('Waiting for permission... (Please click "Allow")');
            navigator.geolocation.getCurrentPosition(
                // Success: Jab user 'Allow' karta hai
                (position) => {
                    setLat(position.coords.latitude);
                    setLong(position.coords.longitude);
                    setLocationStatus('Location Captured Successfully! You can now submit. ✅');
                }, 
                // Error: Jab user 'Block' karta hai
                () => {
                    setLocationStatus('ERROR: Location permission was denied. You must allow location to submit.');
                    setLat(null); // Ensure submit remains disabled
                }
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (!user) return alert("Please login first.");
        
        // Double check ki location hai ya nahi
        if (!lat || !long) {
            alert("Fatal Error: Location not found. Please click 'Share Location' again.");
            return;
        }

        const formData = new FormData();
        formData.append('user_id', user.user_id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('latitude', lat);
        formData.append('longitude', long);
        
        if (evidenceFile) {
            formData.append('evidence', evidenceFile);
        }

        axios.post('https://crime-backend-ptv8.onrender.com/api/complaints', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            alert('Complaint Filed Successfully!'); 
            navigate('/'); 
        })
        .catch(error => {
            console.error(error);
            alert('Failed to file complaint.');
        });
    };

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
                    File a New Complaint
                </Typography>
                
                <TextField label="Title / Crime" fullWidth required margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextField label="Description" fullWidth required multiline rows={5} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
                <TextField label="Type Location (e.g. Mall Road)" fullWidth required margin="normal" value={location} onChange={(e) => setLocation(e.target.value)} />
                
                {/* --- 1. GET LIVE LOCATION BUTTON --- */}
                <Box sx={{ my: 2, p: 2, border: '1px solid #ddd', borderRadius: 2, textAlign: 'center' }}>
                    <Button variant="contained" color="error" startIcon={<LocationOn />} onClick={getLocation} fullWidth>
                        Share Live GPS Location (Required)
                    </Button>
                    {locationStatus && (
                        <Typography 
                            variant="body2" 
                            sx={{ mt: 1, color: lat ? 'green' : 'red', fontWeight: 'bold' }}
                        >
                            {locationStatus}
                        </Typography>
                    )}
                </Box>

                {/* --- 2. VIDEO/PHOTO UPLOAD --- */}
                <Box sx={{ border: '1px dashed grey', borderRadius: 2, p: 2, mt: 2, textAlign: 'center' }}>
                    <Button variant="outlined" component="label" startIcon={<UploadFile />}>
                        Upload Video / Photo (Optional)
                        <input type="file" hidden onChange={handleFileChange} accept="image/*,video/*" />
                    </Button>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>{fileName}</Typography>
                </Box>

                {/* --- 3. SUBMIT BUTTON (LOCKED) --- */}
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3, py: 1.5 }}
                    // YEH HAI MAIN LOGIC: Jab tak 'lat' (latitude) nahi milta, button disabled rahega
                    disabled={!lat} 
                >
                    {lat ? "Submit Complaint" : "Please Share Location to Submit"}
                </Button>
            </Box>
        </Container>
    );
}

export default ComplaintForm;