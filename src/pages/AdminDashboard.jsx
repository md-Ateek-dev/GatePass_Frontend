import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Select, MenuItem,
  FormControl, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Card, CardContent, useMediaQuery, useTheme, Tooltip, TextField,
  Tabs, Tab, InputAdornment, Checkbox
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TodayIcon from '@mui/icons-material/Today';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-toastify';
import GatePassPrintContent from '../components/GatePassPrintContent';

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
    <Card
      elevation={0}
      sx={{
        borderRadius: 3, border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        height: '100%', overflow: 'hidden', position: 'relative',
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

const getStatusBg = (status) => {
  const map = { Approved: '#dcfce7', Rejected: '#fee2e2', Pending: '#fef3c7', 'Checked In': '#e0f2fe', 'Checked Out': '#f1f5f9' };
  return map[status] || '#f1f5f9';
};
const getStatusTextColor = (status) => {
  const map = { Approved: '#16a34a', Rejected: '#dc2626', Pending: '#d97706', 'Checked In': '#0284c7', 'Checked Out': '#64748b' };
  return map[status] || '#64748b';
};

const AdminDashboard = () => {
  const [passes, setPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [stats, setStats] = useState({ totalVisitors: 0, todayVisitors: 0, insideVisitors: 0, completedVisits: 0, pendingRequests: 0 });
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [createdUser, setCreatedUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const [gpSearch, setGpSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordFields, setShowPasswordFields] = useState({ current: false, new: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);
  const [selectedPassIds, setSelectedPassIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredPasses = useMemo(() => {
    const q = gpSearch.trim().toLowerCase();
    if (!q) return passes;
    return passes.filter((p) => p.gatePassNumber?.toLowerCase().includes(q));
  }, [passes, gpSearch]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, userSearch]);

  const searchFieldSx = {
    minWidth: { xs: '100%', sm: 280 },
    '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f8fafc', fontSize: '0.875rem' },
  };

  const fetchData = async () => {
    try {
      const [passesRes, statsRes] = await Promise.all([
        axios.get('/api/admin'),
        axios.get('/api/admin/stats'),
      ]);
      setPasses(passesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  const handlePrintOpen = (pass) => { setSelectedPass(pass); setPrintOpen(true); };
  const handlePrint = () => window.print();

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (printOpen && selectedPass) {
      const timer = setTimeout(() => {
        const canvas = document.getElementById('admin-qr-canvas');
        if (canvas) {
          try { setQrDataUrl(canvas.toDataURL('image/png')); } catch(e) { console.error(e); }
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setQrDataUrl('');
    }
  }, [printOpen, selectedPass]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/admin/${id}`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeletePass = async (id) => {
    if (window.confirm('Are you sure you want to delete this gate pass?')) {
      try {
        await axios.delete(`/api/admin/${id}`);
        toast.success('Gate pass deleted successfully');
        setSelectedPassIds((prev) => prev.filter((x) => x !== id));
        fetchData();
      } catch {
        toast.error('Failed to delete gate pass');
      }
    }
  };

  const allFilteredPassesSelected =
    filteredPasses.length > 0 && filteredPasses.every((p) => selectedPassIds.includes(p._id));

  const togglePassSelection = (id) => {
    setSelectedPassIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllPasses = () => {
    const filteredIds = filteredPasses.map((p) => p._id);
    if (allFilteredPassesSelected) {
      setSelectedPassIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedPassIds((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const handleBulkDeletePasses = async () => {
    if (selectedPassIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedPassIds.length} selected gate pass(es)?`)) return;

    setBulkDeleting(true);
    try {
      const { data } = await axios.post('/api/admin/bulk-delete', { ids: selectedPassIds });
      toast.success(data.message || 'Selected gate passes deleted');
      setSelectedPassIds([]);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete selected gate passes');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gatepasses_${dayjs().format('YYYYMMDD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export successful');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post('/api/admin/users', newUser);
      toast.success('User created successfully');
      setCreatedUser({ email: newUser.email, password: newUser.password });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating user');
    }
  };

  const handleCloseCreateUser = () => {
    setCreateUserOpen(false);
    setCreatedUser(null);
    setNewUser({ name: '', email: '', password: '', role: 'user' });
    fetchUsers();
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordFields({ current: false, new: false, confirm: false });
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await axios.put('/api/auth/password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      handleCloseChangePassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const statConfig = [
    { icon: <PeopleAltIcon sx={{ color: '#1976d2', fontSize: 24 }} />, label: 'Total Passes', value: stats.totalVisitors || 0, color: '#1976d2', bgColor: '#dbeafe' },
    { icon: <TodayIcon sx={{ color: '#7c3aed', fontSize: 24 }} />, label: "Today's Passes", value: stats.todayVisitors || 0, color: '#7c3aed', bgColor: '#ede9fe' },
    { icon: <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 24 }} />, label: 'Currently Inside', value: stats.insideVisitors || 0, color: '#16a34a', bgColor: '#dcfce7' },
    { icon: <ExitToAppIcon sx={{ color: '#64748b', fontSize: 24 }} />, label: 'Checked Out', value: stats.completedVisits || 0, color: '#64748b', bgColor: '#f1f5f9' },
  ];

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Manage all visitor gate pass requests
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignSelf: { xs: 'flex-start', sm: 'auto' }, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<VpnKeyIcon />}
              onClick={() => setChangePasswordOpen(true)}
              sx={{
                textTransform: 'none', borderRadius: '10px', fontWeight: 700, px: 2, py: 1,
                borderColor: '#cbd5e1', color: '#475569',
                '&:hover': { borderColor: '#1976d2', color: '#1976d2', bgcolor: '#eff6ff' },
                whiteSpace: 'nowrap',
              }}
            >
              Change Password
            </Button>
            <Button
              variant="contained"
              onClick={() => setCreateUserOpen(true)}
              sx={{
                textTransform: 'none', borderRadius: '10px',
                fontWeight: 700, px: 2.5, py: 1,
                background: 'linear-gradient(135deg, #1976d2, #7c3aed)',
                boxShadow: '0 4px 16px rgba(25,118,210,0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #1565c0, #6d28d9)', boxShadow: '0 6px 20px rgba(25,118,210,0.4)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              + Create User
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                textTransform: 'none', borderRadius: '10px',
                fontWeight: 700, px: 2.5, py: 1,
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                boxShadow: '0 4px 16px rgba(22,163,74,0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #15803d, #166534)', boxShadow: '0 6px 20px rgba(22,163,74,0.4)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Export Excel
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statConfig.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#64748b',
              '&.Mui-selected': {
                color: '#1976d2',
              }
            }
          }}
        >
          <Tab label={`Gate Passes (${passes.length})`} />
          <Tab label={`User Management (${users.length})`} />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        /* Passes Table */
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3, border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden',
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                All Requests ({filteredPasses.length}{gpSearch.trim() ? ` of ${passes.length}` : ''})
                {selectedPassIds.length > 0 && (
                  <Typography component="span" variant="body2" sx={{ color: '#64748b', fontWeight: 600, ml: 1 }}>
                    · {selectedPassIds.length} selected
                  </Typography>
                )}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                {selectedPassIds.length > 0 && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    disabled={bulkDeleting}
                    onClick={handleBulkDeletePasses}
                    sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
                  >
                    {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedPassIds.length})`}
                  </Button>
                )}
                <TextField
                  size="small"
                  placeholder="Search by GP number..."
                  value={gpSearch}
                  onChange={(e) => setGpSearch(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment> }}
                  sx={searchFieldSx}
                />
              </Box>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell padding="checkbox" sx={{ fontWeight: 700, color: '#475569', py: 1.5 }}>
                      <Checkbox
                        size="small"
                        checked={allFilteredPassesSelected}
                        indeterminate={selectedPassIds.length > 0 && !allFilteredPassesSelected}
                        onChange={toggleSelectAllPasses}
                        disabled={filteredPasses.length === 0}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, whiteSpace: 'nowrap' }}>
                      S.No.
                    </TableCell>
                    {['GP Number', 'Date', 'Visitor', 'Requested By', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, whiteSpace: 'nowrap' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPasses.map((pass, idx) => (
                    <TableRow
                      key={pass._id}
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      selected={selectedPassIds.includes(pass._id)}
                      sx={{
                        '&:hover': { bgcolor: '#f8fafc' },
                        '&:last-child td': { border: 0 },
                        transition: 'background 0.15s',
                        bgcolor: selectedPassIds.includes(pass._id) ? '#eff6ff' : 'inherit',
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={selectedPassIds.includes(pass._id)}
                          onChange={() => togglePassSelection(pass._id)}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.82rem' }}>
                        {pass.gatePassNumber}
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {dayjs(pass.date).format('DD MMM YY')}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>
                        {pass.visitorName}
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>
                        {pass.user?.name || '—'}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {pass.status === 'Checked In' ? (
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span className="pulsing-dot" />
                              <Typography variant="body2" fontWeight={800} color="#ef4444" sx={{ fontSize: '0.75rem', letterSpacing: 0.3 }}>
                                INSIDE CAMPUS
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#0284c7' }}>
                                In: {pass.checkInTime ? dayjs(pass.checkInTime).format('hh:mm A') : '—'}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#94a3b8' }}>Out: —</Typography>
                            </Box>
                          </Box>
                        ) : pass.status === 'Checked Out' ? (
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span className="static-dot-green" />
                              <Typography variant="body2" fontWeight={800} color="#10b981" sx={{ fontSize: '0.75rem', letterSpacing: 0.3 }}>
                                LEFT CAMPUS
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#0284c7' }}>
                                In: {pass.checkInTime ? dayjs(pass.checkInTime).format('hh:mm A') : '—'}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>
                                Out: {pass.outTime ? dayjs(pass.outTime).format('hh:mm A') : '—'}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span className="static-dot-blue" />
                              <Typography variant="body2" fontWeight={800} color="#2563eb" sx={{ fontSize: '0.75rem', letterSpacing: 0.3 }}>
                                EXPECTED / READY
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                              Authorized Pass
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1} alignItems="center">
                          <Tooltip title="Print Pass">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PrintIcon fontSize="small" />}
                              onClick={() => handlePrintOpen(pass)}
                              sx={{
                                borderRadius: '8px', textTransform: 'none',
                                fontSize: '0.75rem', fontWeight: 600, py: 0.6,
                                whiteSpace: 'nowrap',
                                background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
                                '&:hover': { background: 'linear-gradient(135deg, #1976d2, #6d28d9)' },
                              }}
                            >
                              Print
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete Gate Pass">
                            <IconButton
                              onClick={() => handleDeletePass(pass._id)}
                              sx={{
                                color: '#ef4444',
                                border: '1px solid #fee2e2',
                                borderRadius: '8px',
                                p: '6px',
                                '&:hover': {
                                  bgcolor: '#fee2e2'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPasses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                        <PeopleAltIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                        <Typography variant="body2">
                          {passes.length === 0 ? 'No gate pass requests found' : `No gate pass matching "${gpSearch.trim()}"`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>
      ) : (
        /* User Management Table */
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3, border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden',
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                All Registered Users ({filteredUsers.length}{userSearch.trim() ? ` of ${users.length}` : ''})
              </Typography>
              <TextField
                size="small"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment> }}
                sx={searchFieldSx}
              />
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, whiteSpace: 'nowrap' }}>
                      S.No.
                    </TableCell>
                    {['Name', 'User ID (Email)', 'Password', 'Role', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, whiteSpace: 'nowrap' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user, idx) => (
                    <TableRow
                      key={user._id}
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      sx={{
                        '&:hover': { bgcolor: '#f8fafc' },
                        '&:last-child td': { border: 0 },
                        transition: 'background 0.15s',
                      }}
                    >
                      <TableCell sx={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem' }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>
                        {user.email}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.82rem' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" sx={{ fontFamily: showPasswords[user._id] ? 'inherit' : 'monospace', color: '#334155' }}>
                            {showPasswords[user._id] ? (user.plainPassword || '—') : '••••••••'}
                          </Typography>
                          {user.plainPassword && (
                            <>
                              <IconButton size="small" onClick={() => togglePasswordVisibility(user._id)}>
                                {showPasswords[user._id] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                              <Tooltip title="Copy Password">
                                <IconButton size="small" onClick={() => {
                                  navigator.clipboard.writeText(user.plainPassword);
                                  toast.success('Password copied to clipboard');
                                }}>
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex', alignItems: 'center', px: 1.2, py: 0.4,
                            borderRadius: '6px', bgcolor: user.role === 'admin' ? '#ede9fe' : '#e2e8f0',
                            color: user.role === 'admin' ? '#7c3aed' : '#475569',
                            fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
                          }}
                        >
                          {user.role}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={user.email === 'admin@gatepass.com' ? 'Cannot delete system admin' : 'Delete User'}>
                          <span>
                            <IconButton
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={user.email === 'admin@gatepass.com'}
                              sx={{
                                color: '#ef4444',
                                '&.Mui-disabled': { color: '#cbd5e1' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                        <Typography variant="body2">
                          {users.length === 0 ? 'No registered users found' : `No user matching "${userSearch.trim()}"`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>
      )}

      {/* Hidden QR Canvas for print data URL generation */}
      {printOpen && selectedPass && (
        <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 0, height: 0, overflow: 'hidden' }}>
          <QRCodeCanvas id="admin-qr-canvas" value={`${window.location.origin}/scan/${selectedPass._id}`} size={200} level="H" />
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

      {/* Create User Dialog */}
      <Dialog
        open={createUserOpen}
        onClose={handleCloseCreateUser}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontWeight={700}>Create New User</Typography>
          <IconButton onClick={handleCloseCreateUser} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {createdUser ? (
            <Box textAlign="center" py={2}>
              <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>User Created Successfully!</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Please copy these credentials and share them with the user. They will not be shown again.
              </Typography>
              <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'left' }}>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>User ID (Email):</strong> {createdUser.email}</Typography>
                <Typography variant="body2"><strong>Password:</strong> {createdUser.password}</Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{ mt: 3, textTransform: 'none', borderRadius: '8px' }}
                onClick={() => {
                  navigator.clipboard.writeText(`User ID: ${createdUser.email}\nPassword: ${createdUser.password}`);
                  toast.success('Credentials copied to clipboard');
                }}
              >
                Copy Credentials
              </Button>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                label="Full Name"
                fullWidth
                size="small"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                size="small"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <TextField
                label="Password"
                type="text"
                fullWidth
                size="small"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <FormControl fullWidth size="small">
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {createdUser ? (
            <Button onClick={handleCloseCreateUser} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px' }}>
              Done
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseCreateUser} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateUser}
                variant="contained"
                disabled={!newUser.name || !newUser.email || !newUser.password}
                sx={{
                  textTransform: 'none', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1976d2, #7c3aed)',
                }}
              >
                Create User
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={changePasswordOpen} onClose={handleCloseChangePassword} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockOutlinedIcon sx={{ color: '#1976d2' }} />
            <Typography fontWeight={700}>Change Your Password</Typography>
          </Box>
          <IconButton onClick={handleCloseChangePassword} size="small"><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            {[
              { key: 'current', label: 'Current Password', field: 'currentPassword' },
              { key: 'new', label: 'New Password', field: 'newPassword' },
              { key: 'confirm', label: 'Confirm New Password', field: 'confirmPassword' },
            ].map(({ key, label, field }) => (
              <TextField
                key={key}
                label={label}
                type={showPasswordFields[key] ? 'text' : 'password'}
                fullWidth
                size="small"
                value={passwordForm[field]}
                onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPasswordFields((p) => ({ ...p, [key]: !p[key] }))} edge="end">
                        {showPasswordFields[key] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseChangePassword} disabled={changingPassword} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            sx={{ textTransform: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #1976d2, #7c3aed)' }}
          >
            {changingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
