import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Card, CardContent, Button, CircularProgress,
  Divider, Grid, Paper, Chip, Avatar, useTheme, useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { ThemeModeContext } from '../context/ThemeContext';
import { getVisitorPhotoUrl } from '../utils/visitorPhoto';

const ScanPass = () => {
  const { id } = useParams();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { mode } = useContext(ThemeModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isDark = mode === 'dark';

  const fetchPassDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/gatepass/scan/${id}`);
      setPass(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load gate pass details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPassDetails();
    }
  }, [id]);

  const handleStatusUpdate = async (action) => {
    try {
      setActionLoading(true);
      const { data } = await axios.put(`/api/gatepass/scan/${id}`, { action });
      setPass(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update gate pass status.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Checked In': return '#10b981'; // Success Emerald
      case 'Checked Out': return '#64748b'; // Gray slate
      default: return '#1a2d4a';
    }
  };

  const getGlowClass = (status) => {
    switch (status) {
      case 'Checked In': return 'status-glow-green';
      case 'Checked Out': return '';
      default: return 'status-glow-blue';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="85vh">
        <CircularProgress size={48} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="85vh" px={2.5}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: '24px',
            border: '1px solid',
            borderColor: 'error.light',
            bgcolor: isDark ? 'rgba(244,63,94,0.06)' : '#fff5f5',
            textAlign: 'center',
            maxWidth: 440,
            boxShadow: '0 12px 32px rgba(244,63,94,0.08)',
          }}
        >
          <Typography variant="h6" color="error" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em', fontSize: '1.2rem' }}>
            Error
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 600, lineHeight: 1.6 }}>
            {error}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/dashboard'}
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: 'none', borderRadius: '12px', fontWeight: 800, py: 1, px: 2.5,
              borderColor: 'divider', color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
            }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, px: 2, display: 'flex', justifyContent: 'center', bgcolor: 'background.default' }}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 540 }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: '24px',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.05)',
            bgcolor: 'background.paper',
            boxShadow: isDark ? '0 28px 72px rgba(0, 0, 0, 0.65)' : '0 25px 50px -10px rgba(197, 160, 89, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header Portal Band with gradient */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              p: 4,
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(197, 160, 89,0.2)'
            }}
          >
            <Typography variant="h6" fontWeight={800} letterSpacing={1} sx={{ fontSize: '1.15rem' }}>
              Gate Pass Scan
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.8, fontWeight: 700, fontSize: '0.85rem' }}>
              {pass.gatePassNumber}
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3.5, sm: 5 } }}>
            {/* Status Indicator Badge */}
            <Box display="flex" justifyContent="center" mb={4.5}>
              <Chip
                label={pass.status.toUpperCase()}
                sx={{
                  bgcolor: getStatusColor(pass.status) + '12',
                  color: getStatusColor(pass.status),
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  border: `1.5px solid ${getStatusColor(pass.status)}`,
                  px: 2.2,
                  py: 2.3,
                  borderRadius: '12px',
                  letterSpacing: 0.8,
                }}
              />
            </Box>

            {/* Photo & Identity Header */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={4.8}>
              {getVisitorPhotoUrl(pass.visitorPhoto) ? (
                <Avatar
                  src={getVisitorPhotoUrl(pass.visitorPhoto)}
                  alt="Visitor"
                  className={getGlowClass(pass.status)}
                  sx={{
                    width: 140, height: 140,
                    border: '4px solid',
                    borderColor: 'background.paper',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    mb: 2.8,
                    transition: 'all 0.4s ease'
                  }}
                />
              ) : (
                <Avatar
                  className={getGlowClass(pass.status)}
                  sx={{
                    width: 140, height: 140,
                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    border: '4px solid',
                    borderColor: 'divider',
                    mb: 2.8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 68, color: 'text.secondary', opacity: 0.6 }} />
                </Avatar>
              )}
              <Typography variant="h5" fontWeight={800} color="text.primary" align="center" sx={{ letterSpacing: '-0.02em', fontSize: '1.35rem' }}>
                {pass.visitorName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.8, fontWeight: 650 }}>
                <BusinessIcon fontSize="small" sx={{ color: 'primary.main' }} /> {pass.companyName}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4.5 }} />

            {/* Action Terminals */}
            <Box display="flex" flexDirection="column" gap={2.2} mb={4.8}>
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                disabled={pass.status === 'Checked In' || pass.status === 'Checked Out' || actionLoading}
                onClick={() => handleStatusUpdate('check-in')}
                component={motion.button}
                whileHover={pass.status === 'Checked In' || pass.status === 'Checked Out' ? {} : { scale: 1.02 }}
                whileTap={pass.status === 'Checked In' || pass.status === 'Checked Out' ? {} : { scale: 0.98 }}
                sx={{
                  py: 1.8,
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.25)',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)' },
                  '&:disabled': { opacity: 0.5, color: 'text.secondary', background: isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9', boxShadow: 'none' }
                }}
              >
                {pass.status === 'Checked In' || pass.status === 'Checked Out' ? 'Already Checked In' : 'Check In'}
              </Button>

              <Button
                variant="contained"
                startIcon={<ExitToAppIcon />}
                disabled={pass.status !== 'Checked In' || actionLoading}
                onClick={() => handleStatusUpdate('check-out')}
                component={motion.button}
                whileHover={pass.status !== 'Checked In' ? {} : { scale: 1.02 }}
                whileTap={pass.status !== 'Checked In' ? {} : { scale: 0.98 }}
                sx={{
                  py: 1.8,
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  boxShadow: '0 6px 18px rgba(244, 63, 94, 0.25)',
                  background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                  '&:hover': { background: 'linear-gradient(135deg, #e11d48, #be123c)', boxShadow: '0 8px 24px rgba(244, 63, 94, 0.35)' },
                  '&:disabled': { opacity: 0.5, color: 'text.secondary', background: isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9', boxShadow: 'none' }
                }}
              >
                {pass.status === 'Checked Out' ? 'Already Checked Out' : 'Check Out'}
              </Button>
            </Box>

            <Divider sx={{ mb: 4.5 }} />

            {/* Logistics Timeline */}
            {(pass.checkInTime || pass.outTime) && (
              <Box sx={{ mb: 4.8, p: 3, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ mb: 1.8, letterSpacing: '-0.01em', fontSize: '0.88rem' }}>
                  Entry / Exit Times
                </Typography>
                {pass.checkInTime && (
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2, fontWeight: 600 }}>
                    <span>Check In:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{dayjs(pass.checkInTime).format('DD MMM YYYY, hh:mm A')}</strong>
                  </Typography>
                )}
                {pass.outTime && (
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>Check Out:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{dayjs(pass.outTime).format('DD MMM YYYY, hh:mm A')}</strong>
                  </Typography>
                )}
              </Box>
            )}

            {/* Details Grid */}
            <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2.8, textTransform: 'uppercase', letterSpacing: 1.3, fontSize: '0.72rem' }}>
              Visitor Details
            </Typography>

            <Grid container spacing={2.8}>
              {[
                { icon: <CalendarTodayIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'Date', value: dayjs(pass.date).format('DD MMM YYYY') },
                { icon: <HourglassEmptyIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'Visit Type', value: pass.visitType },
                { icon: <PhoneIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'Mobile Number', value: pass.mobileNumber },
                { icon: <BadgeIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'ID Proof', value: `${pass.idProofType} (${pass.idNumber})` },
                { icon: <PersonIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'No. of Persons', value: pass.numberOfPersons },
                { icon: <LocalAtmIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'Unit', value: pass.unit },
                { icon: <TimeToLeaveIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'Vehicle Number', value: pass.vehicleNumber || '—' },
                { icon: <PersonIcon fontSize="small" sx={{ color: 'primary.main' }} />, label: 'Person to Meet', value: `${pass.personToMeet} (${pass.department})` }
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box display="flex" alignItems="flex-start" gap={1.2}>
                    <Box sx={{ mt: 0.3 }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.25, fontWeight: 650 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mt: 0.2, fontSize: '0.85rem' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Purpose */}
            <Box sx={{ mt: 4, p: 3, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.8, fontWeight: 650 }}>
                Purpose
              </Typography>
              <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.85rem' }}>
                {pass.purpose}
              </Typography>
            </Box>

          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ScanPass;
