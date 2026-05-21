import { useState, useEffect } from 'react';
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
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { getVisitorPhotoUrl } from '../utils/visitorPhoto';

const ScanPass = () => {
  const { id } = useParams();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      case 'Checked In': return '#16a34a'; // Green
      case 'Checked Out': return '#64748b'; // Gray
      default: return '#1976d2'; // Blue (Approved)
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={48} sx={{ color: '#7c3aed' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #fee2e2', bgcolor: '#fff5f5', textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h6" color="error" fontWeight={700} gutterBottom>
            Error Loading Pass
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Please make sure the QR code is correct and try again.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: 2, display: 'flex', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Header Card Band */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
              p: 3,
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <Typography variant="h5" fontWeight={800} letterSpacing={0.5}>
              SECURITY GATE PORTAL
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Pass Number: {pass.gatePassNumber}
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            {/* Status Chip */}
            <Box display="flex" justifyContent="center" mb={3}>
              <Chip
                label={pass.status.toUpperCase()}
                sx={{
                  bgcolor: getStatusColor(pass.status) + '15',
                  color: getStatusColor(pass.status),
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: `1px solid ${getStatusColor(pass.status)}`,
                  px: 1.5,
                  py: 2,
                  borderRadius: '10px'
                }}
              />
            </Box>

            {/* Photo & Main Details */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              {getVisitorPhotoUrl(pass.visitorPhoto) ? (
                <Avatar
                  src={getVisitorPhotoUrl(pass.visitorPhoto)}
                  alt="Visitor"
                  sx={{ width: 130, height: 130, border: '4px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', mb: 2 }}
                />
              ) : (
                <Avatar sx={{ width: 130, height: 130, bgcolor: '#f1f5f9', border: '4px solid #e2e8f0', mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 64, color: '#94a3b8' }} />
                </Avatar>
              )}
              <Typography variant="h5" fontWeight={800} color="#0f172a" align="center">
                {pass.visitorName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <BusinessIcon fontSize="small" /> {pass.companyName}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Action Buttons */}
            <Box display="flex" flexDirection="column" gap={2} mb={4}>
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                disabled={pass.status === 'Checked In' || pass.status === 'Checked Out' || actionLoading}
                onClick={() => handleStatusUpdate('check-in')}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: 'none',
                  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                  '&:hover': { background: 'linear-gradient(135deg, #15803d, #16a34a)', boxShadow: 'none' },
                  '&:disabled': { opacity: 0.5, color: '#94a3b8', background: '#f1f5f9' }
                }}
              >
                {pass.status === 'Checked In' || pass.status === 'Checked Out' ? 'Checked In' : 'Mark Check-In (IN)'}
              </Button>

              <Button
                variant="contained"
                startIcon={<ExitToAppIcon />}
                disabled={pass.status !== 'Checked In' || actionLoading}
                onClick={() => handleStatusUpdate('check-out')}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: 'none',
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  '&:hover': { background: 'linear-gradient(135deg, #b91c1c, #dc2626)', boxShadow: 'none' },
                  '&:disabled': { opacity: 0.5, color: '#94a3b8', background: '#f1f5f9' }
                }}
              >
                {pass.status === 'Checked Out' ? 'Checked Out' : 'Mark Check-Out (OUT)'}
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Timeline info if checked in/out */}
            {(pass.checkInTime || pass.outTime) && (
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
                <Typography variant="subtitle2" fontWeight={700} color="#334155" sx={{ mb: 1 }}>
                  Gate Tracking Timeline:
                </Typography>
                {pass.checkInTime && (
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <span>Check-In Time:</span>
                    <strong>{dayjs(pass.checkInTime).format('DD MMM, hh:mm A')}</strong>
                  </Typography>
                )}
                {pass.outTime && (
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Check-Out Time:</span>
                    <strong>{dayjs(pass.outTime).format('DD MMM, hh:mm A')}</strong>
                  </Typography>
                )}
              </Box>
            )}

            {/* Detailed Info Grid */}
            <Typography variant="subtitle2" fontWeight={800} color="#475569" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Visitor Pass Information
            </Typography>

            <Grid container spacing={2}>
              {[
                { icon: <CalendarTodayIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'Visit Date', value: dayjs(pass.date).format('DD MMM YYYY') },
                { icon: <HourglassEmptyIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'Visit Type', value: pass.visitType },
                { icon: <PhoneIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'Phone Number', value: pass.mobileNumber },
                { icon: <BadgeIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'ID Proof', value: `${pass.idProofType} (${pass.idNumber})` },
                { icon: <PersonIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'No. of Persons', value: pass.numberOfPersons },
                { icon: <LocalAtmIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'Unit', value: pass.unit },
                { icon: <TimeToLeaveIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'Vehicle Number', value: pass.vehicleNumber || '—' },
                { icon: <PersonIcon fontSize="small" sx={{ color: '#64748b' }} />, label: 'Person to Meet', value: `${pass.personToMeet} (${pass.department})` }
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Box sx={{ mt: 0.3 }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="#1e293b">
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Purpose */}
            <Box sx={{ mt: 2.5, p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Purpose of Visit
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#1e293b">
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
