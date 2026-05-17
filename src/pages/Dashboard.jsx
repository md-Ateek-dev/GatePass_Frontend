import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, useMediaQuery, useTheme,
  Card, CardContent
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: color }} />
      <CardContent sx={{ pt: 2.5, pb: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', lineHeight: 1.2, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const [passes, setPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handlePrintOpen = (pass) => { setSelectedPass(pass); setPrintOpen(true); };
  const handlePrint = () => window.print();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Checked Out': return 'default';
      default: return 'warning';
    }
  };

  const getStatusBg = (status) => {
    const map = { Approved: '#dcfce7', Rejected: '#fee2e2', Pending: '#fef3c7', 'Checked Out': '#f1f5f9' };
    return map[status] || '#f1f5f9';
  };

  const getStatusTextColor = (status) => {
    const map = { Approved: '#16a34a', Rejected: '#dc2626', Pending: '#d97706', 'Checked Out': '#64748b' };
    return map[status] || '#64748b';
  };

  return (
    <Box>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
            My Gate Passes
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Track and manage all your visitor pass requests
          </Typography>
        </Box>
      </motion.div>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            icon: <AssignmentIcon sx={{ color: '#1976d2', fontSize: 24 }} />,
            label: 'Total Passes', value: passes.length,
            color: '#1976d2', bgColor: '#dbeafe',
          },
          {
            icon: <PendingActionsIcon sx={{ color: '#d97706', fontSize: 24 }} />,
            label: 'Pending', value: passes.filter(p => p.status === 'Pending').length,
            color: '#d97706', bgColor: '#fef3c7',
          },
          {
            icon: <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 24 }} />,
            label: 'Approved', value: passes.filter(p => p.status === 'Approved').length,
            color: '#16a34a', bgColor: '#dcfce7',
          },
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Passes Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
              Pass Requests
            </Typography>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: isMobile ? 500 : 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  {['GP Number', 'Date', 'Visitor Name', 'Company', 'Status', 'Action'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {passes.map((pass, idx) => (
                  <motion.tr
                    key={pass._id}
                    component={TableRow}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    sx={{
                      '&:hover': { bgcolor: '#f8fafc' },
                      '&:last-child td': { border: 0 },
                      transition: 'background 0.15s',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#1976d2', fontSize: '0.82rem' }}>
                      {pass.gatePassNumber}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {dayjs(pass.date).format('DD MMM YY, HH:mm')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>
                      {pass.visitorName}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>
                      {pass.companyName}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex', alignItems: 'center', px: 1.2, py: 0.4,
                          borderRadius: '6px', bgcolor: getStatusBg(pass.status),
                          color: getStatusTextColor(pass.status),
                          fontSize: '0.72rem', fontWeight: 700,
                        }}
                      >
                        {pass.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<PrintIcon fontSize="small" />}
                        size="small"
                        variant={pass.status === 'Approved' ? 'contained' : 'outlined'}
                        onClick={() => handlePrintOpen(pass)}
                        disabled={pass.status !== 'Approved'}
                        sx={{
                          borderRadius: '8px', textTransform: 'none',
                          fontSize: '0.75rem', fontWeight: 600,
                          py: 0.5, px: 1.5,
                          ...(pass.status === 'Approved' && {
                            background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
                            '&:hover': { background: 'linear-gradient(135deg, #1976d2, #6d28d9)' },
                          }),
                        }}
                      >
                        Print
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
                {passes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                      <AssignmentIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                      <Typography variant="body2">No gate passes found. Create one to get started!</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Print Dialog */}
      <Dialog
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography fontWeight={700}>Gate Pass — {selectedPass?.gatePassNumber}</Typography>
          <IconButton onClick={() => setPrintOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers id="printable-area">
          {selectedPass && (
            <Box sx={{ p: { xs: 1, sm: 2 }, border: '2px solid #0f172a', borderRadius: 1 }}>
              <Box textAlign="center" mb={2} pb={1.5} sx={{ borderBottom: '1px solid #0f172a' }}>
                <Typography variant="h5" fontWeight={800}>Company Name Ltd.</Typography>
                <Typography variant="subtitle2" color="text.secondary">Visitor Gate Pass</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  {[
                    ['GP Number', selectedPass.gatePassNumber],
                    ['Date', dayjs(selectedPass.date).format('DD MMM YYYY, HH:mm')],
                    ['Visitor Name', selectedPass.visitorName],
                    ['Company', selectedPass.companyName],
                    ['Mobile', selectedPass.mobileNumber],
                    ['Purpose', selectedPass.purpose],
                    ['Person to Meet', selectedPass.personToMeet],
                  ].map(([key, val]) => (
                    <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
                      <strong>{key}:</strong> {val}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={4} textAlign="right">
                  {selectedPass.qrCode && (
                    <img src={selectedPass.qrCode} alt="QR Code" style={{ width: 90, height: 90 }} />
                  )}
                  {selectedPass.visitorPhoto && (
                    <img src={selectedPass.visitorPhoto} alt="Visitor" style={{ width: 80, height: 80, marginTop: 8, objectFit: 'cover', borderRadius: 4 }} />
                  )}
                </Grid>
              </Grid>
              <Box mt={4} display="flex" justifyContent="space-between">
                {['Visitor Signature', 'Authorized Signatory'].map((label) => (
                  <Box key={label} textAlign="center">
                    <Typography>_________________</Typography>
                    <Typography variant="caption">{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPrintOpen(false)} sx={{ textTransform: 'none', borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={handlePrint}
            variant="contained"
            startIcon={<PrintIcon />}
            sx={{
              textTransform: 'none', borderRadius: '8px',
              background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
            }}
          >
            Print Pass
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
