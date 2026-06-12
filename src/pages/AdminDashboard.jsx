import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Select, MenuItem,
  FormControl, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Card, CardContent, useMediaQuery, useTheme, Tooltip, TextField,
  Tabs, Tab, InputAdornment, Checkbox, Chip, Avatar, TablePagination, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TodayIcon from '@mui/icons-material/Today';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { ThemeModeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import GatePassPrintContent from '../components/GatePassPrintContent';
import { useDebounce } from '../hooks/useDebounce';

const PASSES_PER_PAGE = 20;
const USERS_PER_PAGE = 15;

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
                    color: 'text.primary',
                    mt: 1.2,
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
  const [passPage, setPassPage] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [passTotal, setPassTotal] = useState(0);
  const [userTotal, setUserTotal] = useState(0);
  const [loadingPasses, setLoadingPasses] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const debouncedGpSearch = useDebounce(gpSearch);
  const debouncedUserSearch = useDebounce(userSearch);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordFields, setShowPasswordFields] = useState({ current: false, new: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);
  const [selectedPassIds, setSelectedPassIds] = useState([]);
  const { mode } = useContext(ThemeModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isDark = mode === 'dark';

  const searchFieldSx = {
    minWidth: { xs: '100%', sm: 280 },
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      bgcolor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.02)',
      fontSize: '0.875rem',
      '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'primary.light' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main', boxShadow: '0 0 10px rgba(197, 160, 89,0.15)' },
      transition: 'all 0.2s',
    },
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      bgcolor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.65)',
      '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'primary.light' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main', boxShadow: '0 0 16px rgba(197, 160, 89,0.2)' },
      transition: 'all 0.25s ease',
    },
    '& .MuiInputLabel-root': { color: 'text.secondary', fontSize: '0.9rem', fontWeight: 650 },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
  };

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchPasses = useCallback(async () => {
    setLoadingPasses(true);
    try {
      const { data } = await axios.get('/api/admin', {
        params: {
          page: passPage + 1,
          limit: PASSES_PER_PAGE,
          search: debouncedGpSearch.trim() || undefined,
        },
      });
      setPasses(data.passes);
      setPassTotal(data.pagination.total);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load gate passes');
    } finally {
      setLoadingPasses(false);
    }
  }, [passPage, debouncedGpSearch]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get('/api/admin/users', {
        params: {
          page: userPage + 1,
          limit: USERS_PER_PAGE,
          search: debouncedUserSearch.trim() || undefined,
        },
      });
      setUsers(data.users);
      setUserTotal(data.pagination.total);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, [userPage, debouncedUserSearch]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  useEffect(() => {
    if (tabValue === 1) {
      fetchUsers();
    }
  }, [tabValue, fetchUsers]);

  useEffect(() => {
    setPassPage(0);
  }, [debouncedGpSearch]);

  useEffect(() => {
    setUserPage(0);
  }, [debouncedUserSearch]);

  const handlePrintOpen = async (pass) => {
    try {
      const { data } = await axios.get(`/api/gatepass/${pass._id}`);
      setSelectedPass(data);
      setPrintOpen(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load gate pass for printing');
    }
  };
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

  const handleDeletePass = async (id) => {
    if (window.confirm('Are you sure you want to delete this gate pass?')) {
      try {
        await axios.delete(`/api/admin/${id}`);
        toast.success('Gate pass deleted successfully');
        setSelectedPassIds((prev) => prev.filter((pid) => pid !== id));
        fetchPasses();
        fetchStats();
      } catch {
        toast.error('Failed to delete gate pass');
      }
    }
  };

  const togglePassSelection = (id) => {
    setSelectedPassIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const allPageSelected =
    passes.length > 0 && passes.every((p) => selectedPassIds.includes(p._id));

  const somePageSelected =
    passes.some((p) => selectedPassIds.includes(p._id)) && !allPageSelected;

  const toggleSelectAllPage = () => {
    if (allPageSelected) {
      const visibleIds = new Set(passes.map((p) => p._id));
      setSelectedPassIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const visibleIds = passes.map((p) => p._id);
      setSelectedPassIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleBulkDeletePasses = async () => {
    if (selectedPassIds.length === 0) {
      toast.error('Select at least one gate pass to delete');
      return;
    }
    if (!window.confirm(`Delete ${selectedPassIds.length} selected gate pass(es)?`)) return;

    try {
      const { data } = await axios.post('/api/admin/bulk-delete', { ids: selectedPassIds });
      toast.success(data.message || 'Gate passes deleted successfully');
      setSelectedPassIds([]);
      fetchPasses();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete selected gate passes');
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
    { icon: <PeopleAltIcon sx={{ color: 'primary.main', fontSize: 26 }} />, label: 'Total Passes', value: stats.totalVisitors || 0, color: 'linear-gradient(90deg, var(--primary), var(--secondary))', bgColor: 'rgba(197, 160, 89, 0.08)', delay: 0.05, trend: 'TOTAL GENERATED' },
    { icon: <TodayIcon sx={{ color: 'secondary.main', fontSize: 26 }} />, label: "Today's Passes", value: stats.todayVisitors || 0, color: 'var(--secondary)', bgColor: 'rgba(168, 85, 247, 0.08)', delay: 0.1, trend: 'DAILY CLEARED' },
    { icon: <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 26 }} />, label: 'Checked In', value: stats.insideVisitors || 0, color: 'var(--success)', bgColor: 'rgba(16, 185, 129, 0.08)', delay: 0.15, trend: '' },
    { icon: <ExitToAppIcon sx={{ color: 'text.secondary', fontSize: 26 }} />, label: 'Checked Out', value: stats.completedVisits || 0, color: 'var(--text-secondary)', bgColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(71, 85, 105, 0.06)', delay: 0.2, trend: 'ARCHIVED RUNS' },
  ];

  return (
    <Box className="smooth-scroll-container">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, mb: 4.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.02em', fontSize: '1.45rem' }}>
            Admin Panel
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 600 }}>
            Manage gate passes, users, and export data
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignSelf: { xs: 'flex-start', sm: 'auto' }, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<VpnKeyIcon />}
            onClick={() => setChangePasswordOpen(true)}
            sx={{
              textTransform: 'none', borderRadius: '12px', fontWeight: 800, px: 2.5, py: 1.2,
              borderColor: 'divider', color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(197, 160, 89,0.03)' },
              whiteSpace: 'nowrap',
            }}
          >
            Change Password
          </Button>
          <Button
            variant="contained"
            onClick={() => setCreateUserOpen(true)}
            sx={{
              textTransform: 'none', borderRadius: '12px',
              fontWeight: 800, px: 2.8, py: 1.2,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              boxShadow: '0 4px 16px rgba(197, 160, 89, 0.25)',
              '&:hover': { background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-dark) 100%)', boxShadow: '0 6px 20px rgba(197, 160, 89, 0.35)', transform: 'translateY(-2px)' },
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
            }}
          >
            + Add User
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{
              textTransform: 'none', borderRadius: '12px',
              fontWeight: 800, px: 2.8, py: 1.2,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
              '&:hover': { background: 'linear-gradient(135deg, #34d399 0%, #047857 100%)', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)', transform: 'translateY(-2px)' },
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Export to Excel
          </Button>
        </Box>
      </Box>

      {/* Stat Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4.5 }}>
        {statConfig.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4.5 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.92rem',
              color: 'text.secondary',
              pb: 2,
              '&.Mui-selected': {
                color: 'primary.main',
              }
            }
          }}
        >
          <Tab label={`Gate Passes (${passTotal})`} />
          <Tab label={`User Management (${userTotal || (tabValue === 1 ? users.length : '…')})`} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabValue}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {tabValue === 0 ? (
            /* Passes Table */
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px', border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0, 0, 0, 0.05)',
                bgcolor: 'background.paper',
                boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 24px -4px rgba(197, 160, 89, 0.03)',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                  All Requests ({passTotal})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Search by GP number..."
                    value={gpSearch}
                    onChange={(e) => setGpSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
                    sx={searchFieldSx}
                  />
                  {selectedPassIds.length > 0 && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleBulkDeletePasses}
                      sx={{ textTransform: 'none', borderRadius: '12px', fontWeight: 800, py: 1.1, px: 2, whiteSpace: 'nowrap' }}
                    >
                      Delete Selected ({selectedPassIds.length})
                    </Button>
                  )}
                </Box>
              </Box>

              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={allPageSelected}
                          indeterminate={somePageSelected}
                          onChange={toggleSelectAllPage}
                          disabled={passes.length === 0}
                        />
                      </TableCell>
                      {['S.No.', 'GP Number', 'Date', 'Visitor Name', 'Created By', 'Status', 'Actions'].map((h) => (
                        <TableCell key={h} sx={{ whiteSpace: 'nowrap', py: 2.2 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingPasses && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                          <CircularProgress size={28} />
                        </TableCell>
                      </TableRow>
                    )}
                    {!loadingPasses && passes.map((pass, idx) => {
                      const initials = pass.visitorName?.charAt(0).toUpperCase() || 'V';
                      return (
                        <TableRow
                          key={pass._id}
                          sx={{
                            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(197, 160, 89, 0.015)' },
                            '&:last-child td': { border: 0 },
                            transition: 'background-color 0.2s ease',
                            bgcolor: selectedPassIds.includes(pass._id) ? (isDark ? 'rgba(244,63,94,0.06)' : '#fff1f2') : 'inherit',
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              size="small"
                              checked={selectedPassIds.includes(pass._id)}
                              onChange={() => togglePassSelection(pass._id)}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>
                            {passPage * PASSES_PER_PAGE + idx + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.82rem', letterSpacing: '0.2px' }}>
                            {pass.gatePassNumber}
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', whiteSpace: 'nowrap', fontWeight: 650 }}>
                            {dayjs(pass.date).format('DD MMM YYYY')}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Avatar
                                sx={{
                                  width: 26, height: 26, fontSize: '0.68rem', fontWeight: 800,
                                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
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
                            {pass.user?.name || '—'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {pass.status === 'Checked In' ? (
                              <Box display="flex" flexDirection="column" gap={0.5}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <span className="pulsing-dot" />
                                  <Typography variant="body2" fontWeight={850} color="error.main" sx={{ fontSize: '0.72rem', letterSpacing: 0.4 }}>
                                    Checked In
                                  </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'primary.main' }}>
                                  In: {pass.checkInTime ? dayjs(pass.checkInTime).format('hh:mm A') : '—'}
                                </Typography>
                              </Box>
                            ) : pass.status === 'Checked Out' ? (
                              <Box display="flex" flexDirection="column" gap={0.5}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <span className="static-dot-green" />
                                  <Typography variant="body2" fontWeight={850} color="success.main" sx={{ fontSize: '0.72rem', letterSpacing: 0.4 }}>
                                    Checked Out
                                  </Typography>
                                </Box>
                                <Box display="flex" gap={1.5}>
                                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'primary.main' }}>
                                    In: {pass.checkInTime ? dayjs(pass.checkInTime).format('hh:mm A') : '—'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 650, color: 'text.secondary' }}>
                                    Out: {pass.outTime ? dayjs(pass.outTime).format('hh:mm A') : '—'}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Box display="flex" flexDirection="column" gap={0.5}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <span className="static-dot-blue" />
                                  <Typography variant="body2" fontWeight={850} color="primary.main" sx={{ fontSize: '0.72rem', letterSpacing: 0.4 }}>
                                    {pass.status}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1} alignItems="center">
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PrintIcon sx={{ fontSize: 14 }} />}
                                onClick={() => handlePrintOpen(pass)}
                                sx={{
                                  borderRadius: '10px', textTransform: 'none',
                                  fontSize: '0.75rem', fontWeight: 800, py: 0.7, px: 2,
                                  whiteSpace: 'nowrap',
                                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                  '&:hover': { background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-dark))' },
                                }}
                              >
                                Print
                              </Button>
                              <Tooltip title="Delete Permanently">
                                <IconButton
                                  onClick={() => handleDeletePass(pass._id)}
                                  sx={{
                                    color: 'error.main',
                                    border: '1px solid',
                                    borderColor: isDark ? 'rgba(244,63,94,0.15)' : '#fee2e2',
                                    borderRadius: '10px',
                                    p: '6px',
                                    '&:hover': { bgcolor: 'rgba(244,63,94,0.08)' }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!loadingPasses && passes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 9, color: 'text.secondary' }}>
                          <PeopleAltIcon sx={{ fontSize: 56, mb: 1.8, opacity: 0.15, color: 'primary.main' }} />
                          <Typography variant="body2" fontWeight={700}>
                            {gpSearch.trim() ? `No gate pass matching "${gpSearch.trim()}"` : 'No gate passes found'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={passTotal}
                page={passPage}
                onPageChange={(_, newPage) => setPassPage(newPage)}
                rowsPerPage={PASSES_PER_PAGE}
                rowsPerPageOptions={[PASSES_PER_PAGE]}
              />
            </Paper>
          ) : (
            /* User Management Table */
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px', border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0, 0, 0, 0.05)',
                bgcolor: 'background.paper',
                boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 24px -4px rgba(197, 160, 89, 0.03)',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                  All Registered Users ({userTotal})
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
                  sx={searchFieldSx}
                />
              </Box>

              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      {['S.No.', 'Name', 'Email', 'Password', 'Role', 'Actions'].map((h) => (
                        <TableCell key={h} sx={{ whiteSpace: 'nowrap', py: 2.2 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingUsers && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <CircularProgress size={28} />
                        </TableCell>
                      </TableRow>
                    )}
                    {!loadingUsers && users.map((user, idx) => {
                      const operatorInitials = user.name?.charAt(0).toUpperCase() || 'O';
                      return (
                        <TableRow
                          key={user._id}
                          sx={{
                            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(197, 160, 89, 0.015)' },
                            '&:last-child td': { border: 0 },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>
                            {userPage * USERS_PER_PAGE + idx + 1}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Avatar
                                sx={{
                                  width: 26, height: 26, fontSize: '0.68rem', fontWeight: 800,
                                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                  color: 'white'
                                }}
                              >
                                {operatorInitials}
                              </Avatar>
                              <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.82rem' }}>
                                {user.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', fontWeight: 650 }}>
                            {user.email}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.82rem' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" sx={{ fontFamily: showPasswords[user._id] ? 'inherit' : 'monospace', color: 'text.primary', fontWeight: 700 }}>
                                {showPasswords[user._id] ? (user.plainPassword || '—') : '••••••••'}
                              </Typography>
                              {user.plainPassword && (
                                <>
                                  <IconButton size="small" onClick={() => togglePasswordVisibility(user._id)} sx={{ color: 'text.secondary' }}>
                                    {showPasswords[user._id] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                  </IconButton>
                                  <Tooltip title="Copy to Clipboard">
                                    <IconButton size="small" onClick={() => {
                                      navigator.clipboard.writeText(user.plainPassword);
                                      toast.success('Password copied');
                                    }} sx={{ color: 'text.secondary' }}>
                                      <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.role.toUpperCase()}
                              size="small"
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                bgcolor: user.role === 'admin' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(197, 160, 89, 0.08)',
                                color: user.role === 'admin' ? 'secondary.main' : 'primary.main',
                                border: '1px solid',
                                borderColor: user.role === 'admin' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(197, 160, 89, 0.15)',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={user.email === 'admin@gatepass.com' ? 'Cannot delete admin' : 'Delete user'}>
                              <span>
                                <IconButton
                                  onClick={() => handleDeleteUser(user._id)}
                                  disabled={user.email === 'admin@gatepass.com'}
                                  sx={{
                                    color: 'error.main',
                                    '&.Mui-disabled': { color: 'divider' },
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '10px',
                                    p: '6px',
                                    '&:hover:not(:disabled)': { bgcolor: 'rgba(244,63,94,0.08)' }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!loadingUsers && users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 9, color: 'text.secondary' }}>
                          <Typography variant="body2" fontWeight={750}>
                            {userSearch.trim() ? `No user matching "${userSearch.trim()}"` : 'No users found'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={userTotal}
                page={userPage}
                onPageChange={(_, newPage) => setUserPage(newPage)}
                rowsPerPage={USERS_PER_PAGE}
                rowsPerPageOptions={[USERS_PER_PAGE]}
              />
            </Paper>
          )}
        </motion.div>
      </AnimatePresence>

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

      {/* Register Operator Dialog */}
      <Dialog
        open={createUserOpen}
        onClose={handleCloseCreateUser}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 28px 72px rgba(0,0,0,0.5)',
            p: 1.5
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
          <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}>Create User</Typography>
          <IconButton onClick={handleCloseCreateUser} size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          {createdUser ? (
            <Box sx={{ p: 2.5, bgcolor: isDark ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.03)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.15)', mb: 1 }}>
              <Typography variant="subtitle2" color="success.main" fontWeight={800} gutterBottom>✓ User Created!</Typography>
              <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 700 }} color="text.primary">Email: {createdUser.email}</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }} color="text.primary">Password: {createdUser.password}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontWeight: 600 }}>Please save these credentials.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.8, mt: 1 }}>
              <TextField
                fullWidth label="Name" placeholder="Enter name"
                value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                sx={fieldSx}
              />
              <TextField
                fullWidth label="Email" placeholder="Enter email"
                value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                sx={fieldSx}
              />
              <TextField
                fullWidth label="Password" placeholder="At least 6 characters"
                value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                sx={fieldSx}
              />
              <FormControl fullWidth sx={fieldSx}>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  displayEmpty
                  sx={{ borderRadius: '16px' }}
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
            <Button onClick={handleCloseCreateUser} variant="contained" fullWidth sx={{ borderRadius: '12px', py: 1.2, fontWeight: 800 }}>
              Close
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseCreateUser} sx={{ fontWeight: 800, color: 'text.secondary' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateUser}
                sx={{
                  borderRadius: '12px', py: 1.2, px: 3, fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  boxShadow: '0 4px 14px rgba(197, 160, 89, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-dark))',
                  }
                }}
              >
                Create User
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onClose={handleCloseChangePassword}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 28px 72px rgba(0,0,0,0.5)',
            p: 1.5
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
          <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}>Change Password</Typography>
          <IconButton onClick={handleCloseChangePassword} size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.8, mt: 1 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswordFields.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPasswordFields({ ...showPasswordFields, current: !showPasswordFields.current })}>
                      {showPasswordFields.current ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPasswordFields.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPasswordFields({ ...showPasswordFields, new: !showPasswordFields.new })}>
                      {showPasswordFields.new ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswordFields.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPasswordFields({ ...showPasswordFields, confirm: !showPasswordFields.confirm })}>
                      {showPasswordFields.confirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={fieldSx}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseChangePassword} disabled={changingPassword} sx={{ fontWeight: 800, color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={changingPassword}
            onClick={handleChangePassword}
            sx={{
              borderRadius: '12px', py: 1.2, px: 3, fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-dark))',
              }
            }}
          >
            {changingPassword ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
