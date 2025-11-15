import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// MUI Components
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Typography, TablePagination, Box, Select, MenuItem, Button 
} from '@mui/material';

// 'Description' icon hata diya kyunki use nahi ho raha tha
import { LocationOn, Map } from '@mui/icons-material'; 

function DashboardPage() {
    const [complaints, setComplaints] = useState([]);
    const { user } = useContext(AuthContext); 

    // --- Data Fetching ---
    useEffect(() => {
        axios.get('https://crime-backend-ptv8.onrender.com/api/complaints')
            .then(response => {
                setComplaints(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch complaints:", error);
            });
    }, []);

    // --- Pagination ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // --- Status Change Handler ---
    const handleStatusChange = (complaintId, newStatus) => {
        axios.put(`https://crime-backend-ptv8.onrender.com/api/complaints/status/${complaintId}`, { status: newStatus })
        .then(response => {
            alert("Status Updated Successfully!");
            setComplaints(prev => prev.map(c => c.complaint_id === complaintId ? { ...c, status: newStatus } : c));
        })
        .catch(error => alert("Failed to update status."));
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1565C0' }}>
                    Police Dashboard (Live Monitoring)
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    User: {user.role === 'admin' ? 'Higher Authority' : 'Police Officer'}
                </Typography>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}> 
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD', minWidth: '250px' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD' }}>Reported Address</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD' }}>GPS Location</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD' }}>Evidence</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#E3F2FD' }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                        {complaints
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((complaint) => (
                                <TableRow hover key={complaint.complaint_id}>
                                    <TableCell>{complaint.complaint_id}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{complaint.title}</TableCell>
                                    
                                    {/* Description Data */}
                                    <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                        {complaint.description}
                                    </TableCell>

                                    {/* Manual Address */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOn sx={{ color: 'gray', mr: 0.5, fontSize: 18 }} />
                                            {complaint.location}
                                        </Box>
                                    </TableCell>
                                    
                                    {/* GPS Map Link */}
                                    <TableCell>
                                        {complaint.latitude && complaint.longitude ? (
                                            <Button 
                                                variant="contained" 
                                                color="error" 
                                                size="small"
                                                startIcon={<Map />}
                                                href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                                target="_blank"
                                                sx={{ textTransform: 'none', borderRadius: 20 }}
                                            >
                                                Track
                                            </Button>
                                        ) : (
                                            <Typography variant="caption" color="textSecondary">Not Shared</Typography>
                                        )}
                                    </TableCell>

                                    {/* Status Dropdown */}
                                    <TableCell>
                                        <Select
                                            value={complaint.status}
                                            onChange={(e) => handleStatusChange(complaint.complaint_id, e.target.value)}
                                            size="small"
                                            sx={{ minWidth: 120, fontSize: '0.875rem', bgcolor: 'white' }}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Resolved">Resolved</MenuItem>
                                            <MenuItem value="Rejected">Rejected</MenuItem>
                                        </Select>
                                    </TableCell>

                                    {/* Evidence Button */}
                                    <TableCell>
                                        {complaint.evidence_url ? (
                                            <Button 
                                                variant="outlined" size="small"
                                                href={`https://crime-backend-ptv8.onrender.com/${complaint.evidence_url}`}
                                                target="_blank"
                                            >
                                                View
                                            </Button>
                                        ) : "-"}
                                    </TableCell>

                                    <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={complaints.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default DashboardPage;