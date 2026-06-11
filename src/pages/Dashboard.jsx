import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, useMediaQuery, useTheme,
  Card, CardContent, Avatar, TablePagination, CircularProgress
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { ThemeModeContext } from '../context/ThemeContext';
import GatePassPrintContent from '../components/GatePassPrintContent';

const StatCard = ({ icon, label, value, color, bgColor, delay, trend }) => {
  const { mode } = useContext(ThemeModeContext);
  const isDark = mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: '20px',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0, 0, 0, 0.05)',
          bgcolor: 'background.paper',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 24px -4px rgba(197, 160, 89, 0.04)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.light',
            boxShadow: isDark ? '0 16px 36px rgba(197, 160, 89, 0.08)' : '0 16px 36px rgba(197, 160, 89, 0.08)',
          }
        }}
      >
        {/* Visual Accent Top Bar */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color }} />
        <CardContent sx={{ pt: 3.5, pb: '24px !important', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.3 }}>
                {label}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1.2, mt: 0.8, letterSpacing: '-0.03em' }}>
                {value}
              </Typography>
              {trend && (
                <Chip
                  label={trend}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    bgcolor: bgColor,
                    color: isDark ? 'text.primary' : 'text.primary',
                    mt: 1.2,
                    px: 0.4,
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                />
              )}
            </Box>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: '16px',
                bgcolor: bgColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.02)'
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ROWS_PER_PAGE = 15;

const Dashboard = () => {
  const [passes, setPasses] = useState([]);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, checkedOut: 0 });
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const { mode } = useContext(ThemeModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = mode === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [passesRes, statsRes] = await Promise.all([
          axios.get('/api/gatepass', { params: { page: page + 1, limit: ROWS_PER_PAGE } }),
          axios.get('/api/gatepass/stats'),
        ]);
        setPasses(passesRes.data.passes);
        setTotalCount(passesRes.data.pagination.total);
        setStats(statsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const handlePrintOpen = async (pass) => {
    try {
      const { data } = await axios.get(`/api/gatepass/${pass._id}`);
      setSelectedPass(data);
      setPrintOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
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

  return (
    <Box className="smooth-scroll-container">
      {/* Page Header */}
      <Box sx={{ mb: 4.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.02em', fontSize: '1.45rem' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 600 }}>
            View and print your gate passes
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/create-pass'}
          endIcon={<ArrowForwardIcon />}
          sx={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            boxShadow: '0 4px 16px rgba(197, 160, 89, 0.25)',
            py: 1.4,
            px: 3,
            borderRadius: '14px',
            fontSize: '0.875rem',
            fontWeight: 800,
            '&:hover': {
              background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-dark) 100%)',
              boxShadow: '0 6px 20px rgba(197, 160, 89, 0.35)',
              transform: 'translateY(-2px)',
            },
            '&:active': { transform: 'translateY(0)' },
            transition: 'all 0.25s ease',
          }}
        >
          Create New Pass
        </Button>
      </Box>

      {/* Stat Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4.5 }}>
        {[
          {
            icon: <AssignmentIcon sx={{ color: 'primary.main', fontSize: 26 }} />,
            label: 'Total Passes', value: stats.total,
            color: 'linear-gradient(90deg, var(--primary), var(--secondary))', bgColor: 'rgba(197, 160, 89, 0.08)',
            delay: 0.05, trend: ''
          },
          {
            icon: <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 26 }} />,
            label: 'Checked In', value: stats.checkedIn,
            color: 'var(--success)', bgColor: 'rgba(16, 185, 129, 0.08)',
            delay: 0.1, trend: ''
          },
          {
            icon: <ExitToAppIcon sx={{ color: 'text.secondary', fontSize: 26 }} />,
            label: 'Checked Out', value: stats.checkedOut,
            color: 'var(--text-secondary)', bgColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(71, 85, 105, 0.06)',
            delay: 0.15, trend: ''
          },
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Passes Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)',
            bgcolor: 'background.paper',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 24px -4px rgba(197, 160, 89, 0.03)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              My Gate Passes
            </Typography>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: isMobile ? 550 : 700 }}>
              <TableHead>
                <TableRow>
                  {['S.No.', 'GP Number', 'Date & Time', 'Visitor Name', 'Company Name', 'Status', 'Action'].map((h) => (
                    <TableCell key={h} sx={{ py: 2.2 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                )}
                {!loading && passes.map((pass, idx) => {
                  const initials = pass.visitorName?.charAt(0).toUpperCase() || 'V';
                  return (
                    <TableRow
                      key={pass._id}
                      sx={{
                        '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(197, 160, 89, 0.015)' },
                        '&:last-child td': { border: 0 },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>
                        {page * ROWS_PER_PAGE + idx + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.82rem', letterSpacing: '0.2px' }}>
                        {pass.gatePassNumber}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', whiteSpace: 'nowrap', fontWeight: 650 }}>
                        {dayjs(pass.date).format('DD MMM YYYY, hh:mm A')}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            sx={{
                              width: 28, height: 28, fontSize: '0.72rem', fontWeight: 800,
                              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                              boxShadow: '0 2px 8px rgba(197, 160, 89, 0.15)',
                              color: 'white'
                            }}
                          >
                            {initials}
                          </Avatar>
                          <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.82rem' }}>
                            {pass.visitorName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', fontWeight: 650 }}>
                        {pass.companyName}
                      </TableCell>
                      <TableCell>
                        {pass.status === 'Checked In' ? (
                          <Box display="inline-flex" alignItems="center" gap={1.2} sx={{ bgcolor: 'rgba(244, 63, 94, 0.08)', px: 1.8, py: 0.7, borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.18)' }}>
                            <span className="pulsing-dot" />
                            <Typography variant="body2" fontWeight={850} color="error.main" sx={{ fontSize: '0.72rem', letterSpacing: 0.6 }}>
                              Checked In
                            </Typography>
                          </Box>
                        ) : pass.status === 'Checked Out' ? (
                          <Box display="inline-flex" alignItems="center" gap={1.2} sx={{ bgcolor: 'rgba(16, 185, 129, 0.08)', px: 1.8, py: 0.7, borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.18)' }}>
                            <span className="static-dot-green" />
                            <Typography variant="body2" fontWeight={850} color="success.main" sx={{ fontSize: '0.72rem', letterSpacing: 0.6 }}>
                              Checked Out
                            </Typography>
                          </Box>
                        ) : (
                          <Box display="inline-flex" alignItems="center" gap={1.2} sx={{ bgcolor: 'rgba(197, 160, 89, 0.08)', px: 1.8, py: 0.7, borderRadius: '10px', border: '1px solid rgba(197, 160, 89, 0.18)' }}>
                            <span className="static-dot-blue" />
                            <Typography variant="body2" fontWeight={850} color="primary.main" sx={{ fontSize: '0.72rem', letterSpacing: 0.6 }}>
                              {pass.status}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Button
                          startIcon={<PrintIcon sx={{ fontSize: 16 }} />}
                          size="small"
                          variant="contained"
                          onClick={() => handlePrintOpen(pass)}
                          sx={{
                            borderRadius: '10px', textTransform: 'none',
                            fontSize: '0.75rem', fontWeight: 800,
                            py: 0.7, px: 2,
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            boxShadow: '0 2px 8px rgba(197, 160, 89, 0.18)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-dark))',
                              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.28)',
                              transform: 'translateY(-1px)'
                            },
                            '&:active': { transform: 'translateY(0)' },
                            transition: 'all 0.2s',
                          }}
                        >
                          Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!loading && passes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 9, color: 'text.secondary' }}>
                      <AssignmentIcon sx={{ fontSize: 56, mb: 1.8, opacity: 0.18, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight={700}>No gate passes found.</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4 }}>Create a gate pass to get started.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ROWS_PER_PAGE]}
          />
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
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '24px',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
            bgcolor: 'background.paper',
            boxShadow: '0 28px 72px rgba(0,0,0,0.5)'
          }
        }}
      >
        <DialogTitle className="no-print" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.8, px: 4, pt: 3.5 }}>
          <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ fontSize: '1.15rem' }}>Print Gate Pass</Typography>
          <IconButton onClick={() => setPrintOpen(false)} size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers id="printable-area" sx={{ bgcolor: '#fff', px: { xs: 2.5, sm: 5 }, py: 3.5 }}>
          {selectedPass && <GatePassPrintContent pass={selectedPass} qrDataUrl={qrDataUrl} />}
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 2.8, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setPrintOpen(false)} sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 800, color: 'text.secondary' }}>
            Close
          </Button>
          <Button
            onClick={handlePrint}
            variant="contained"
            startIcon={<PrintIcon />}
            sx={{
              textTransform: 'none', borderRadius: '12px', fontWeight: 800, py: 1.2, px: 3,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-dark))',
                boxShadow: '0 6px 20px rgba(197, 160, 89, 0.35)',
              }
            }}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
