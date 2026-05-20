import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Select, MenuItem,
  FormControl, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Card, CardContent, useMediaQuery, useTheme, Tooltip, TextField,
  Tabs, Tab
} from '@mui/material';
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
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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
  const map = { Approved: '#dcfce7', Rejected: '#fee2e2', Pending: '#fef3c7', 'Checked Out': '#f1f5f9' };
  return map[status] || '#f1f5f9';
};
const getStatusTextColor = (status) => {
  const map = { Approved: '#16a34a', Rejected: '#dc2626', Pending: '#d97706', 'Checked Out': '#64748b' };
  return map[status] || '#64748b';
};

const AdminDashboard = () => {
  const [passes, setPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [stats, setStats] = useState({ totalVisitors: 0, todayVisitors: 0, pendingRequests: 0, approvedPasses: 0, rejectedPasses: 0 });
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [createdUser, setCreatedUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        fetchData();
      } catch {
        toast.error('Failed to delete gate pass');
      }
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

  const statConfig = [
    { icon: <PeopleAltIcon sx={{ color: '#1976d2', fontSize: 24 }} />, label: 'Total Visitors', value: stats.totalVisitors, color: '#1976d2', bgColor: '#dbeafe' },
    { icon: <TodayIcon sx={{ color: '#7c3aed', fontSize: 24 }} />, label: "Today's Visitors", value: stats.todayVisitors, color: '#7c3aed', bgColor: '#ede9fe' },
    { icon: <PendingActionsIcon sx={{ color: '#d97706', fontSize: 24 }} />, label: 'Pending', value: stats.pendingRequests, color: '#d97706', bgColor: '#fef3c7' },
    { icon: <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 24 }} />, label: 'Approved', value: stats.approvedPasses, color: '#16a34a', bgColor: '#dcfce7' },
    { icon: <CancelOutlinedIcon sx={{ color: '#dc2626', fontSize: 24 }} />, label: 'Rejected', value: stats.rejectedPasses, color: '#dc2626', bgColor: '#fee2e2' },
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
          <Box sx={{ display: 'flex', gap: 1.5, alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
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
          <Grid item xs={6} sm={4} md={2.4} key={i}>
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
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                All Requests ({passes.length})
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    {['GP Number', 'Date', 'Visitor', 'Requested By', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, whiteSpace: 'nowrap' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {passes.map((pass, idx) => (
                    <TableRow
                      key={pass._id}
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
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex', alignItems: 'center', px: 1.2, py: 0.4,
                            borderRadius: '6px', bgcolor: getStatusBg(pass.status),
                            color: getStatusTextColor(pass.status),
                            fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
                          }}
                        >
                          {pass.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1} alignItems="center">
                          <FormControl size="small">
                            <Select
                              value={pass.status}
                              onChange={(e) => handleStatusChange(pass._id, e.target.value)}
                              sx={{
                                minWidth: 110, fontSize: '0.78rem', borderRadius: '8px',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                              }}
                            >
                              <MenuItem value="Pending" sx={{ fontSize: '0.82rem' }}>Pending</MenuItem>
                              <MenuItem value="Approved" sx={{ fontSize: '0.82rem' }}>Approve</MenuItem>
                              <MenuItem value="Rejected" sx={{ fontSize: '0.82rem' }}>Reject</MenuItem>
                              <MenuItem value="Checked Out" sx={{ fontSize: '0.82rem' }}>Check Out</MenuItem>
                            </Select>
                          </FormControl>
                          <Tooltip title={pass.status !== 'Approved' ? 'Approve first to print' : 'Print Pass'}>
                            <span>
                              <Button
                                variant={pass.status === 'Approved' ? 'contained' : 'outlined'}
                                size="small"
                                startIcon={<PrintIcon fontSize="small" />}
                                onClick={() => handlePrintOpen(pass)}
                                disabled={pass.status !== 'Approved'}
                                sx={{
                                  borderRadius: '8px', textTransform: 'none',
                                  fontSize: '0.75rem', fontWeight: 600, py: 0.6,
                                  whiteSpace: 'nowrap',
                                  ...(pass.status === 'Approved' && {
                                    background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
                                    '&:hover': { background: 'linear-gradient(135deg, #1976d2, #6d28d9)' },
                                  }),
                                }}
                              >
                                Print
                              </Button>
                            </span>
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
                  {passes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                        <PeopleAltIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                        <Typography variant="body2">No gate pass requests found</Typography>
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
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                All Registered Users ({users.length})
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    {['Name', 'User ID (Email)', 'Password', 'Role', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, whiteSpace: 'nowrap' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, idx) => (
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
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                        <Typography variant="body2">No registered users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography fontWeight={700}>Gate Pass — {selectedPass?.gatePassNumber}</Typography>
          <IconButton onClick={() => setPrintOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers id="printable-area">
          {selectedPass && (
            <Box sx={{ p: { xs: 1, sm: 2 }, border: '2px solid #0f172a', borderRadius: 1 }}>
              {/* Header with photo */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5} pb={1.5} sx={{ borderBottom: '2px solid #0f172a' }}>
                <Box textAlign="center" flex={1}>
                  <Typography variant="h5" fontWeight={800}>Company Name Ltd.</Typography>
                  <Typography variant="subtitle1" fontWeight={600}>Visitor Gate Pass</Typography>
                  <Typography variant="caption" color="text.secondary">Gate Pass No: {selectedPass.gatePassNumber}</Typography>
                </Box>
                <Box textAlign="center" sx={{ ml: 2, flexShrink: 0 }}>
                  {selectedPass.visitorPhoto ? (
                    <>
                      <img src={selectedPass.visitorPhoto} alt="Visitor" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc', display: 'block' }} />
                      <Typography variant="caption" display="block">Visitor Photo</Typography>
                    </>
                  ) : (
                    <Box sx={{ width: 80, height: 80, border: '1px dashed #ccc', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" color="text.secondary">No Photo</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Section 1: Visit Info */}
              <Box mb={1.5} sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                <Typography variant="body2" fontWeight={800} sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, mb: 1, borderRadius: 0.5 }}>
                  VISIT INFORMATION
                </Typography>
                <Grid container spacing={0.5}>
                  {[
                    ['Date & Time', dayjs(selectedPass.date).format('DD MMM YYYY, HH:mm')],
                    ['Unit', selectedPass.unit],
                    ['Visit Type', selectedPass.visitType],
                    ['Purpose', selectedPass.purpose],
                    ['Person to Meet', selectedPass.personToMeet],
                    ['Department', selectedPass.department],
                  ].map(([key, val]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="body2" sx={{ mb: 0.3 }}>
                        <strong>{key}:</strong> {val || '—'}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Section 2: Visitor Info */}
              <Box mb={1.5} sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                <Typography variant="body2" fontWeight={800} sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, mb: 1, borderRadius: 0.5 }}>
                  VISITOR DETAILS
                </Typography>
                <Grid container spacing={0.5}>
                  {[
                    ['Visitor Name', selectedPass.visitorName],
                    ['Mobile No.', selectedPass.mobileNumber],
                    ['Company', selectedPass.companyName],
                    ['No. of Persons', selectedPass.numberOfPersons],
                    ['ID Proof Type', selectedPass.idProofType],
                    ['ID Number', selectedPass.idNumber],
                  ].map(([key, val]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="body2" sx={{ mb: 0.3 }}>
                        <strong>{key}:</strong> {val || '—'}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Section 3: Items & Vehicle */}
              <Box mb={1.5} sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                <Typography variant="body2" fontWeight={800} sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, mb: 1, borderRadius: 0.5 }}>
                  ITEMS & VEHICLE
                </Typography>
                <Grid container spacing={0.5}>
                  {[
                    ['Vehicle No.', selectedPass.vehicleNumber],
                    ['Items Carrying', selectedPass.itemsCarrying],
                    ['Serial No.', selectedPass.serialNumber],
                    ['Make / Brand', selectedPass.make],
                  ].map(([key, val]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="body2" sx={{ mb: 0.3 }}>
                        <strong>{key}:</strong> {val || '—'}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Section 4: Requested By */}
              <Box mb={2}>
                <Typography variant="body2" fontWeight={800} sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, mb: 1, borderRadius: 0.5 }}>
                  REQUESTED BY
                </Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedPass.user?.name || '—'}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {selectedPass.user?.email || '—'}</Typography>
                {selectedPass.outTime && (
                  <Typography variant="body2"><strong>Out Time:</strong> {dayjs(selectedPass.outTime).format('DD MMM YYYY, HH:mm')}</Typography>
                )}
              </Box>

              {/* Signatures */}
              <Box mt={3} display="flex" justifyContent="space-between">
                {['Visitor Signature', 'Security Signature', 'Authorized Signatory'].map((label) => (
                  <Box key={label} textAlign="center">
                    <Typography>_______________</Typography>
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
    </Box>
  );
};

export default AdminDashboard;
