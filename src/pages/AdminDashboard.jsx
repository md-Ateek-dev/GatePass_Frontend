import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Grid, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Button, Select, MenuItem, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [passes, setPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    pendingRequests: 0,
    approvedPasses: 0,
    rejectedPasses: 0,
  });

  const fetchData = async () => {
    try {
      const [passesRes, statsRes] = await Promise.all([
        axios.get('/api/admin'),
        axios.get('/api/admin/stats')
      ]);
      setPasses(passesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrintOpen = (pass) => {
    setSelectedPass(pass);
    setPrintOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/admin/${id}`, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'gatepasses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Checked Out': return 'default';
      default: return 'warning';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport} color="success">
          Export Excel
        </Button>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="subtitle2">Total Visitors</Typography>
            <Typography variant="h4" fontWeight="bold">{stats.totalVisitors}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8eaf6' }}>
            <Typography variant="subtitle2">Today</Typography>
            <Typography variant="h4" fontWeight="bold">{stats.todayVisitors}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="subtitle2">Pending</Typography>
            <Typography variant="h4" fontWeight="bold">{stats.pendingRequests}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="subtitle2">Approved</Typography>
            <Typography variant="h4" fontWeight="bold">{stats.approvedPasses}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Typography variant="subtitle2">Rejected</Typography>
            <Typography variant="h4" fontWeight="bold">{stats.rejectedPasses}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>GP Number</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Visitor Name</strong></TableCell>
              <TableCell><strong>Requested By</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {passes.map((pass) => (
              <TableRow key={pass._id}>
                <TableCell>{pass.gatePassNumber}</TableCell>
                <TableCell>{dayjs(pass.date).format('DD MMM YYYY, HH:mm')}</TableCell>
                <TableCell>{pass.visitorName}</TableCell>
                <TableCell>{pass.user?.name}</TableCell>
                <TableCell>
                  <Chip label={pass.status} color={getStatusColor(pass.status)} size="small" />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <FormControl size="small">
                      <Select
                        value={pass.status}
                        onChange={(e) => handleStatusChange(pass._id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approve</MenuItem>
                        <MenuItem value="Rejected">Reject</MenuItem>
                        <MenuItem value="Checked Out">Check Out</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PrintIcon />}
                      onClick={() => handlePrintOpen(pass)}
                      disabled={pass.status !== 'Approved'}
                    >
                      Print
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Print Dialog */}
      <Dialog open={printOpen} onClose={() => setPrintOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gate Pass - {selectedPass?.gatePassNumber}</DialogTitle>
        <DialogContent dividers id="printable-area">
          {selectedPass && (
            <Box sx={{ p: 2, border: '2px solid #000', borderRadius: 1 }}>
              <Box textAlign="center" mb={2} borderBottom="1px solid #000" pb={1}>
                <Typography variant="h5" fontWeight="bold">Company Name Ltd.</Typography>
                <Typography variant="subtitle1">Visitor Gate Pass</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography><strong>GP Number:</strong> {selectedPass.gatePassNumber}</Typography>
                  <Typography><strong>Date:</strong> {dayjs(selectedPass.date).format('DD MMM YYYY, HH:mm')}</Typography>
                  <Typography><strong>Visitor Name:</strong> {selectedPass.visitorName}</Typography>
                  <Typography><strong>Company:</strong> {selectedPass.companyName}</Typography>
                  <Typography><strong>Mobile:</strong> {selectedPass.mobileNumber}</Typography>
                  <Typography><strong>Purpose:</strong> {selectedPass.purpose}</Typography>
                  <Typography><strong>Person to Meet:</strong> {selectedPass.personToMeet}</Typography>
                </Grid>
                <Grid item xs={4} textAlign="right">
                  {selectedPass.qrCode && (
                    <img src={selectedPass.qrCode} alt="QR Code" style={{ width: 100, height: 100 }} />
                  )}
                  {selectedPass.visitorPhoto && (
                    <img src={selectedPass.visitorPhoto} alt="Visitor" style={{ width: 80, height: 80, marginTop: 10, objectFit: 'cover' }} />
                  )}
                </Grid>
              </Grid>

              <Box mt={4} display="flex" justifyContent="space-between">
                <Box textAlign="center">
                  <Typography>_________________</Typography>
                  <Typography variant="caption">Visitor Signature</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography>_________________</Typography>
                  <Typography variant="caption">Authorized Signatory</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintOpen(false)}>Cancel</Button>
          <Button onClick={handlePrint} variant="contained" startIcon={<PrintIcon />}>Print</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
