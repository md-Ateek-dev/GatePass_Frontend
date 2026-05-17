import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, InputAdornment,
  IconButton, CircularProgress, Divider
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful! Welcome aboard.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&:hover fieldset': { borderColor: '#1976d2' },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)',
        p: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: '-8%', right: '-5%',
        width: { xs: 200, md: 350 }, height: { xs: 200, md: 350 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: { xs: 180, md: 300 }, height: { xs: 180, md: 300 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(25,118,210,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.97)',
            borderRadius: 3,
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #1565c0 100%)',
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 56, height: 56, borderRadius: '16px',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 1.5,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <BadgeIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: 'white', letterSpacing: 0.3 }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
              Gate Pass Pro — Visitor Management
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#0f172a', mb: 0.5 }}>
              Get started today 🚀
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              Fill in the details below to create your account
            </Typography>

            <TextField
              fullWidth
              label="Full Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: '#94a3b8' }}>
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={confirmPassword.length > 0 && password !== confirmPassword}
              helperText={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords don't match" : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small" sx={{ color: '#94a3b8' }}>
                      {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...inputSx, mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #1565c0)',
                boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6d28d9, #1976d2)',
                  boxShadow: '0 12px 28px rgba(124,58,237,0.45)',
                  transform: 'translateY(-1px)',
                },
                '&:active': { transform: 'translateY(0)' },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Create Account'}
            </Button>

            <Divider sx={{ my: 2.5, color: '#94a3b8', fontSize: '0.8rem' }}>or</Divider>

            <Box textAlign="center">
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1976d2', fontWeight: 700, textDecoration: 'none' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'rgba(255,255,255,0.4)' }}>
          Developed by Mohd Ateek • ateek.netlify.app
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Register;
