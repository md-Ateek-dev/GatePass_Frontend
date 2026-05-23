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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import GatePassPrintContent from '../components/GatePassPrintContent';

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

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (printOpen && selectedPass) {
      const timer = setTimeout(() => {
        const canvas = document.getElementById('user-qr-canvas');
        if (canvas) {
          try { setQrDataUrl(canvas.toDataURL('image/png')); } catch(e) { console.error(e); }
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setQrDataUrl('');
    }
  }, [printOpen, selectedPass]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Checked Out': return 'default';
      default: return 'warning';
    }
  };

  const getStatusBg = (status) => {
    const map = { Approved: '#dcfce7', Rejected: '#fee2e2', Pending: '#fef3c7', 'Checked In': '#e0f2fe', 'Checked Out': '#f1f5f9' };
    return map[status] || '#f1f5f9';
  };

  const getStatusTextColor = (status) => {
    const map = { Approved: '#16a34a', Rejected: '#dc2626', Pending: '#d97706', 'Checked In': '#0284c7', 'Checked Out': '#64748b' };
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
            icon: <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 24 }} />,
            label: 'Currently Inside', value: passes.filter(p => p.status === 'Checked In').length,
            color: '#16a34a', bgColor: '#dcfce7',
          },
          {
            icon: <ExitToAppIcon sx={{ color: '#64748b', fontSize: 24 }} />,
            label: 'Checked Out', value: passes.filter(p => p.status === 'Checked Out').length,
            color: '#64748b', bgColor: '#f1f5f9',
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
                  {['S.No.', 'GP Number', 'Date', 'Visitor Name', 'Company', 'Status', 'Action'].map((h) => (
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
                    
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.82rem' }}>
                      {idx + 1}
                    </TableCell>
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
                      {pass.status === 'Checked In' ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="pulsing-dot" />
                          <Typography variant="body2" fontWeight={800} color="#ef4444" sx={{ fontSize: '0.75rem', letterSpacing: 0.3 }}>
                            INSIDE CAMPUS
                          </Typography>
                        </Box>
                      ) : pass.status === 'Checked Out' ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="static-dot-green" />
                          <Typography variant="body2" fontWeight={800} color="#10b981" sx={{ fontSize: '0.75rem', letterSpacing: 0.3 }}>
                            LEFT CAMPUS
                          </Typography>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="static-dot-blue" />
                          <Typography variant="body2" fontWeight={800} color="#2563eb" sx={{ fontSize: '0.75rem', letterSpacing: 0.3 }}>
                            EXPECTED / READY
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<PrintIcon fontSize="small" />}
                        size="small"
                        variant="contained"
                        onClick={() => handlePrintOpen(pass)}
                        sx={{
                          borderRadius: '8px', textTransform: 'none',
                          fontSize: '0.75rem', fontWeight: 600,
                          py: 0.5, px: 1.5,
                          background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
                          '&:hover': { background: 'linear-gradient(135deg, #1976d2, #6d28d9)' },
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

      {/* Hidden QR Canvas for print data URL generation */}
      {printOpen && selectedPass && (
        <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 0, height: 0, overflow: 'hidden' }}>
          <QRCodeCanvas id="user-qr-canvas" value={`${window.location.origin}/scan/${selectedPass._id}`} size={200} level="H" />
        </div>
      )}

      {/* Print Dialog */}
      <Dialog
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
      >
        <DialogTitle className="no-print" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography fontWeight={700}>Gate Pass — {selectedPass?.gatePassNumber}</Typography>
          <IconButton onClick={() => setPrintOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers id="printable-area" sx={{ bgcolor: '#fff' }}>
          {selectedPass && <GatePassPrintContent pass={selectedPass} qrDataUrl={qrDataUrl} />}
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
