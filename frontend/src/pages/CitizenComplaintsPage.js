import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom'; // Link ke liye

// MUI Components
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Box,
    Button, // Nayi complaint file karne ke liye button
    Chip // Status ko achhe se dikhane ke liye
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material'; // Icon

function CitizenComplaintsPage() {
    const [myComplaints, setMyComplaints] = useState([]);
    const { user } = useContext(AuthContext); // Logged-in citizen ka data

    // --- Data Fetching ---
    useEffect(() => {
        if (user) { // Agar user logged-in hai
            // Naye API route ko call karo
            axios.get(`http://localhost:5000/api/my-complaints?userId=${user.user_id}`)
                .then(response => {
                    setMyComplaints(response.data);
                })
                .catch(error => {
                    console.error("Failed to fetch my complaints:", error);
                });
        }
    }, [user]); // Jab 'user' change hoga (login hone par), tab fetch karo

    // Status ke hisaab se color return karega
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'In Progress': return 'info';
            case 'Resolved': return 'success';
            case 'Rejected': return 'error';
            default: return 'default';
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="div">
                    My Complaints
                </Typography>
                {/* Nayi Complaint file karne ka button */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddCircleOutline />}
                    component={RouterLink} // Yeh button ek link ki tarah kaam karega
                    to="/new-complaint"   // '/new-complaint' page par jayega
                >
                    File New Complaint
                </Button>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}> 
                <Table stickyHeader aria-label="my complaints table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reported On</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Police Remarks</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Evidence</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myComplaints.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">You have not filed any complaints yet.</TableCell>
                            </TableRow>
                        ) : (
                            myComplaints.map((complaint) => (
                                <TableRow hover key={complaint.complaint_id}>
                                    <TableCell>{complaint.complaint_id}</TableCell>
                                    <TableCell>{complaint.title}</TableCell>
                                    <TableCell>{complaint.location}</TableCell>
                                    <TableCell>{new Date(complaint.created_at).toLocaleString()}</TableCell>
                                    {/* Status ko Chip (badge) ki tarah dikhao */}
                                    <TableCell>
                                        <Chip 
                                            label={complaint.status} 
                                            color={getStatusColor(complaint.status)} 
                                            size="small"
                                        />
                                    </TableCell>
                                    {/* Police Remarks dikhao (agar hain toh) */}
                                    <TableCell>{complaint.remarks || '-'}</TableCell> 
                                    {/* Evidence Link */}
                                    <TableCell>
                                        {complaint.evidence_url ? (
                                            <Button 
                                                variant="outlined"
                                                size="small"
                                                href={`http://localhost:5000/${complaint.evidence_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View
                                            </Button>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Yahan Pagination add kar sakte hain agar complaints bahut zyada hon */}
        </Paper>
    );
}

export default CitizenComplaintsPage;
