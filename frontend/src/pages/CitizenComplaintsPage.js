import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

// Material-UI components
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
    Button, 
    Chip 
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

function CitizenComplaintsPage() {
    const [myComplaints, setMyComplaints] = useState([]);
    const { user } = useContext(AuthContext);

    // --- Data Fetching ---
    useEffect(() => {
        if (user && user.user_id) {
            // !! YEH HAI FIX !!
            // Backend route: /api/complaints/citizen/:userId
            axios.get(`https://crime-backend-ptv8.onrender.com/api/complaints/citizen/${user.user_id}`)
                .then(response => {
                    console.log("Complaints fetched:", response.data); // Console mein check karne ke liye
                    setMyComplaints(response.data);
                })
                .catch(error => {
                    console.error("Failed to fetch my complaints:", error);
                });
        }
    }, [user]);

    // Status ke hisaab se color
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
                    My Complaints History
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddCircleOutline />}
                    component={RouterLink} 
                    to="/new-complaint"
                >
                    File New Complaint (FIR)
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Current Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Police Remarks</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Evidence</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myComplaints.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    You have not filed any complaints yet. Click 'File New Complaint' to start.
                                </TableCell>
                            </TableRow>
                        ) : (
                            myComplaints.map((complaint) => (
                                <TableRow hover key={complaint.complaint_id}>
                                    <TableCell>{complaint.complaint_id}</TableCell>
                                    <TableCell>{complaint.title}</TableCell>
                                    <TableCell>{complaint.location}</TableCell>
                                    <TableCell>{new Date(complaint.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={complaint.status} 
                                            color={getStatusColor(complaint.status)} 
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{complaint.remarks || '-'}</TableCell> 
                                    <TableCell>
                                        {complaint.evidence_url ? (
                                            <Button 
                                                variant="outlined"
                                                size="small"
                                                href={`https://crime-backend-ptv8.onrender.com/${complaint.evidence_url}`}
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
        </Paper>
    );
}

export default CitizenComplaintsPage;