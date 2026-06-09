import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeModeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, InputAdornment,
  IconButton, CircularProgress
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DeveloperCredit from '../components/DeveloperCredit';
import { getLoginFieldSx } from '../theme/loginFieldStyles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { mode, toggleThemeMode } = useContext(ThemeModeContext);
  const navigate = useNavigate();

  const isDark = mode === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Access Granted! Terminal loading...');
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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark
          ? 'radial-gradient(ellipse at 30% 20%, #1a2d4a 0%, #080c14 55%, #050810 100%)'
          : 'radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
        p: { xs: 3, sm: 4 },
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Decorative Rotating Premium Orbs */}
      <Box
        component={motion.div}
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute', top: '8%', right: '12%',
          width: { xs: 200, md: 450 }, height: { xs: 200, md: 450 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.2) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        component={motion.div}
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute', bottom: '8%', left: '8%',
          width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26, 45, 74, 0.35) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      {/* Dynamic Theme Toggle in Login */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <IconButton
          onClick={toggleThemeMode}
          component={motion.button}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          sx={{
            color: 'text.secondary',
            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' },
            p: 1.3,
            borderRadius: '12px',
          }}
        >
          {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
        </IconButton>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 450, zIndex: 2 }}
      >
        {/* Glassmorphic Login Card */}
        <Box
          sx={{
            bgcolor: isDark ? 'rgba(12, 18, 34, 0.55)' : 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '28px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.5)'}`,
            boxShadow: isDark ? '0 28px 72px rgba(0,0,0,0.65)' : '0 28px 72px rgba(15, 28, 46, 0.12)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Card Header with unified premium gradient */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              p: { xs: 4.5, sm: 5 },
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(15, 28, 46, 0.2)',
              borderBottom: '2px solid var(--secondary)',
            }}
          >
            <Box
              sx={{
                width: 62, height: 62, borderRadius: '20px',
                bgcolor: 'rgba(255,255,255,0.22)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            >
              <BadgeIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: 'white', letterSpacing: 0.8, fontSize: '1.45rem' }}>
              Gate Pass System
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.8, fontWeight: 700, fontSize: '0.85rem' }}>
              Visitor entry management
            </Typography>
          </Box>

          {/* Form Content */}
          <Box component="form" onSubmit={handleSubmit} className="login-form" sx={{ p: { xs: 4.5, sm: 5 } }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: 'text.primary', mb: 0.8, letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
              Login
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, fontWeight: 650 }}>
              Enter your email and password
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={getLoginFieldSx(isDark)}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={getLoginFieldSx(isDark, { mb: 4.5 })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: '16px',
                fontSize: '0.975rem',
                fontWeight: 800,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1a2d4a 0%, #0f1c2e 100%)',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(15, 28, 46, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2a4365 0%, #1a2d4a 100%)',
                  boxShadow: '0 10px 28px rgba(15, 28, 46, 0.3)',
                  transform: 'translateY(-1px)',
                },
                '&:active': { transform: 'translateY(0)' },
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Login'}
            </Button>
          </Box>
        </Box>

        <DeveloperCredit variant={isDark ? 'dark' : 'light'} sx={{ mt: 3, pt: 3, borderTop: 'none' }} />
      </motion.div>
    </Box>
  );
};

export default Login;
