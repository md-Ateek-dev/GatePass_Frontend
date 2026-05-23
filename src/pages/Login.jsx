import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, InputAdornment,
  IconButton, CircularProgress, Link
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { DEVELOPER_CONTACT, DEVELOPER_PORTFOLIO_URL } from '../components/DeveloperCredit';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: '#f8fafc',
    '&:hover fieldset': { borderColor: '#1976d2' },
    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
  },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 45%, #312e81 100%)',
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.5, sm: 2 },
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-25%',
          left: '-15%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 400, margin: 0 }}
      >
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 100%)',
              px: 3,
              py: 3,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.25,
              }}
            >
              <BadgeIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: 'white', letterSpacing: 0.2 }}>
              Gate Pass Pro
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.25 }}>
              Visitor Management System
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a', mb: 0.25 }}>
              Sign in
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
              Enter your credentials to continue
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldSx, mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: '#94a3b8' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldSx, mb: 2.5 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.25,
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
                boxShadow: '0 6px 20px rgba(25,118,210,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2, #6d28d9)',
                },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Sign In'}
            </Button>
          </Box>

          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 1.75,
              bgcolor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.65, display: 'block' }}>
              Developed by <strong>Mohd Ateek</strong> · Contact{' '}
              <Link href={`tel:${DEVELOPER_CONTACT}`} sx={{ color: '#1565c0', fontWeight: 600, textDecoration: 'none' }}>
                {DEVELOPER_CONTACT}
              </Link>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.65, display: 'block', mt: 0.25 }}>
              <Link href={DEVELOPER_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" sx={{ color: '#1565c0', fontWeight: 600, textDecoration: 'none' }}>
                ateek.netlify.app
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Login;
