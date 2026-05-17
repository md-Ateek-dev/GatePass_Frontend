import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [passes, setPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const { data } = await axios.get('/api/gatepass');
        setPasses(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPasses();
  }, []);

  const handlePrintOpen = (pass) => {
    setSelectedPass(pass);
    setPrintOpen(true);
  };

  const handlePrint = () => {
    window.print();
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
      <Typography variant="h4" gutterBottom fontWeight="bold">My Gate Passes</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" color="primary">Total Passes</Typography>
            <Typography variant="h3" fontWeight="bold">{passes.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h6" color="warning.main">Pending</Typography>
            <Typography variant="h3" fontWeight="bold">
              {passes.filter(p => p.status === 'Pending').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h6" color="success.main">Approved</Typography>
            <Typography variant="h3" fontWeight="bold">
              {passes.filter(p => p.status === 'Approved').length}
            </Typography>
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
              <TableCell><strong>Company</strong></TableCell>
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
                <TableCell>{pass.companyName}</TableCell>
                <TableCell>
                  <Chip label={pass.status} color={getStatusColor(pass.status)} size="small" />
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<PrintIcon />}
                    size="small"
                    variant="outlined"
                    onClick={() => handlePrintOpen(pass)}
                    disabled={pass.status !== 'Approved'}
                  >
                    Print
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {passes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No gate passes found</TableCell>
              </TableRow>
            )}
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

export default Dashboard;
