import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeModeContext } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List,
  ListItem, ListItemIcon, ListItemText, Box, Avatar, Chip,
  useTheme, useMediaQuery, Divider, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import { motion, AnimatePresence } from 'framer-motion';

const DRAWER_WIDTH = 270;

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleThemeMode } = useContext(ThemeModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} />, path: '/dashboard', show: !!user },
    { text: 'Create Pass', icon: <AddCircleOutlineIcon sx={{ fontSize: 20 }} />, path: '/create-pass', show: !!user },
    { text: 'Admin Panel', icon: <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />, path: '/admin', show: user?.role === 'admin' },
  ];

  const isActive = (path) => location.pathname === path;
  const isFullscreenRoute =
    location.pathname === '/login' || location.pathname.startsWith('/scan/');

  const isDark = mode === 'dark';

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      {/* Brand Header with Rich Metallic Gradient Overlay */}
      <Box
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 68,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(15, 28, 46, 0.25)',
          borderBottom: '2px solid var(--secondary)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, zIndex: 1 }}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: '12px',
              bgcolor: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <BadgeIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{ color: 'white', fontWeight: 800, letterSpacing: 0.6, lineHeight: 1.2, fontSize: '1.05rem' }}
          >
            Gate Pass System
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white', p: 0.5, zIndex: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        {/* Subtle Decorative Circle */}
        <Box sx={{
          position: 'absolute', right: '-15px', top: '-15px', width: 90, height: 90,
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none'
        }} />
      </Box>

      {/* User Info Card Section */}
      {user && (
        <Box
          sx={{
            px: 2.5,
            py: 2.8,
            bgcolor: isDark ? 'rgba(13, 18, 33, 0.45)' : 'rgba(241, 245, 249, 0.8)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 44, height: 44, fontSize: '1.05rem', fontWeight: 800,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                boxShadow: '0 4px 14px var(--accent-glow)',
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'white'}`
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1.3, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Admin' : 'User'}
                size="small"
                sx={{
                  height: 18, fontSize: '0.625rem', fontWeight: 800,
                  bgcolor: user.role === 'admin' ? 'secondary.main' : 'primary.main',
                  color: 'white', mt: 0.4, px: 0.5,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Nav Links */}
      <List sx={{ flexGrow: 1, px: 2, pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menuItems.filter(item => item.show).map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
              sx={{
                borderRadius: '14px',
                bgcolor: active ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                color: active ? 'primary.main' : 'text.secondary',
                fontWeight: active ? 800 : 600,
                border: active ? `1px solid ${isDark ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.15)'}` : '1px solid transparent',
                boxShadow: active ? (isDark ? '0 4px 12px rgba(0,0,0,0.15)' : '0 4px 12px rgba(15, 28, 46, 0.04)') : 'none',
                '&:hover': {
                  bgcolor: active ? 'rgba(37, 99, 235, 0.18)' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(37, 99, 235, 0.06)'),
                  color: 'primary.main',
                  transform: 'translateX(2px)',
                  '& .nav-icon': { color: 'primary.main' },
                },
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                px: 2.2, py: 1.3,
                position: 'relative',
              }}
            >
              <ListItemIcon
                className="nav-icon"
                sx={{
                  minWidth: 34,
                  color: active ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.2s ease',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: active ? 800 : 650,
                  letterSpacing: '0.15px',
                }}
              />
              {active && (
                <Box
                  component={motion.div}
                  layoutId="sidebar-active-indicator"
                  sx={{
                    position: 'absolute', right: 8, width: 4, height: 22, borderRadius: 2,
                    bgcolor: 'secondary.main',
                    boxShadow: '0 0 8px var(--accent-glow)'
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Logout Row */}
      <Divider sx={{ mx: 2, opacity: isDark ? 0.35 : 0.8 }} />
      {user && (
        <List sx={{ px: 2, pb: 2, pt: 1.5 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: '14px',
              color: 'error.main',
              '&:hover': { bgcolor: 'error.main' + '12', transform: 'translateX(2px)' },
              transition: 'all 0.25s ease',
              px: 2.2, py: 1.3,
            }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'error.main' }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout System"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 800 }}
            />
          </ListItem>
        </List>
      )}
    </Box>
  );

  if (isFullscreenRoute) {
    return <Box sx={{ minHeight: '100vh', width: '100%', m: 0, p: 0, bgcolor: 'transparent' }}>{children}</Box>;
  }

  const topBar = (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDark ? 'rgba(8, 12, 20, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 28, 46, 0.08)'}`,
        backdropFilter: 'blur(16px)',
        backgroundImage: 'none',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
        {user && (
          <Tooltip title="Menu">
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 1.5,
                display: { sm: 'none' },
                color: 'text.secondary',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
          <BadgeIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary' }}>
            Gate Pass System
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
            <IconButton
              onClick={toggleThemeMode}
              sx={{ color: 'text.secondary', borderRadius: '10px' }}
            >
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {user.email}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #0f172a, #2563eb)',
                  border: `2px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#fff'}`,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Sidebar — full height, not covered by top bar */}
      {user && (
        <Box
          component="nav"
          sx={{
            width: { xs: 0, sm: DRAWER_WIDTH },
            flexShrink: 0,
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              zIndex: theme.zIndex.drawer + 2,
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                border: 'none',
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                border: 'none',
                borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15, 28, 46, 0.08)'}`,
                boxShadow: isDark ? 'none' : '2px 0 12px rgba(15, 28, 46, 0.04)',
                zIndex: theme.zIndex.drawer,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main column — top bar only over content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        {user && topBar}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, sm: 4 },
            bgcolor: 'transparent',
            overflowX: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
