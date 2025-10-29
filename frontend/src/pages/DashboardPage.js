import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// MUI Components (Aesthetic Table ke liye)
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    TablePagination,
    Box,
    Select, 
    MenuItem
} from '@mui/material';

function DashboardPage() {
    // --- NAYA: Function to handle status change ---
const handleStatusChange = (complaintId, newStatus) => {
    axios.put(`http://localhost:5000/api/complaints/${complaintId}/status`, { 
        status: newStatus 
        // Abhi remarks nahi bhej rahe hain, simple rakhte hain
    })
    .then(response => {
        alert(response.data.message);
        // Status change hone ke baad complaints list ko update karo
        setComplaints(prevComplaints => 
            prevComplaints.map(c => 
                c.complaint_id === complaintId ? { ...c, status: newStatus } : c
            )
        );
    })
    .catch(error => {
        console.error("Error updating status:", error);
        alert("Failed to update status.");
    });
};
// --- Status Change Function Khatam ---
    const [complaints, setComplaints] = useState([]);
    const { user } = useContext(AuthContext); // Logged-in user ka data

    // --- Data Fetching ---
    useEffect(() => {
        // Page load hote hi saari complaints fetch karo
        axios.get('http://localhost:5000/api/complaints')
            .then(response => {
                setComplaints(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch complaints:", error);
            });
    }, []); // `[]` ka matlab hai yeh sirf ek baar chalega

    // --- Pagination State (Table ke pages ke liye) ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // --- Render (UI) ---
    return (
        // Paper component theme se shadow aur border radius le lega
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom component="div">
                    Admin Dashboard
                </Typography>
                <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
                    ({user.role === 'admin' ? 'Higher Authority' : 'Police Station'})
                </Typography>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}> 
                <Table stickyHeader aria-label="sticky table">
                    {/* Table ka Header */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reported On</TableCell>
                        </TableRow>
                    </TableHead>
                    
                    {/* Table ki Body (Data) */}
                    <TableBody>
                        {complaints
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((complaint) => (
                                <TableRow hover key={complaint.complaint_id}>
                                    <TableCell>{complaint.complaint_id}</TableCell>
                                    <TableCell>{complaint.title}</TableCell>
                                    <TableCell>{complaint.description}</TableCell>
                                    <TableCell>{complaint.location}</TableCell>
                                    
                                    {/* Status ke liye alag color */}
                                    {/* --- NAYA: Status Dropdown --- */}
                    <TableCell>
                        <Select
                            value={complaint.status}
                            onChange={(e) => handleStatusChange(complaint.complaint_id, e.target.value)}
                            size="small"
                            sx={{ 
                                minWidth: 120,
                                fontWeight: 'bold',
                                color: complaint.status === 'Pending' ? 'secondary.main' : (complaint.status === 'Resolved' ? 'green' : 'primary.main'),
                                '& .MuiSelect-select': { padding: '5px 10px' } 
                            }}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </TableCell>
                    {/* --- Status Dropdown Khatam --- */}

                                    {/* Date ko format karna */}
                                    <TableCell>
                                        {new Date(complaint.created_at).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Table ka Pagination (Next/Previous Page) */}
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