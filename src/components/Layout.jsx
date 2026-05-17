import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
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

const DRAWER_WIDTH = 250;

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', show: !!user },
    { text: 'Create Pass', icon: <AddCircleOutlineIcon />, path: '/create-pass', show: !!user },
    { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin', show: user?.role === 'admin' },
  ];

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <BadgeIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{ color: 'white', fontWeight: 800, letterSpacing: 0.3, lineHeight: 1.2 }}
          >
            Gate Pass Pro
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white', p: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      {user && (
        <Box sx={{ px: 2, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 38, height: 38, fontSize: '0.95rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #1976d2, #7c3aed)',
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a', lineHeight: 1.3 }}>
                {user.name}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Admin' : 'User'}
                size="small"
                sx={{
                  height: 18, fontSize: '0.65rem', fontWeight: 600,
                  bgcolor: user.role === 'admin' ? '#7c3aed' : '#1976d2',
                  color: 'white', mt: 0.3,
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Nav Links */}
      <List sx={{ flexGrow: 1, px: 1.5, pt: 1.5 }}>
        {menuItems.filter(item => item.show).map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
            sx={{
              mb: 0.5, borderRadius: '10px',
              bgcolor: isActive(item.path) ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
              color: isActive(item.path) ? '#1976d2' : '#475569',
              fontWeight: isActive(item.path) ? 700 : 500,
              '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)', color: '#1976d2' },
              transition: 'all 0.2s ease',
              px: 1.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: isActive(item.path) ? '#1976d2' : '#94a3b8',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive(item.path) ? 700 : 500 }}
            />
            {isActive(item.path) && (
              <Box
                sx={{
                  width: 4, height: 28, borderRadius: 2,
                  bgcolor: '#1976d2', ml: 'auto',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>

      {/* Logout */}
      <Divider sx={{ mx: 1.5 }} />
      {user && (
        <List sx={{ px: 1.5, pb: 1.5, pt: 1 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: '10px', color: '#ef4444',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#ef4444' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
            />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f4f8' }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'white',
          borderBottom: '1px solid #e2e8f0',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 3 } }}>
          {user && (
            <Tooltip title="Toggle Menu">
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 1.5,
                  display: { sm: 'none' },
                  color: '#475569',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Logo (shown in AppBar on desktop when no sidebar) */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
            <BadgeIcon sx={{ color: '#1976d2', fontSize: 22 }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800, color: '#1976d2',
                background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              Gate Pass Pro
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side info */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {user.email}
                </Typography>
              </Box>
              <Tooltip title={user.name}>
                <Avatar
                  sx={{
                    width: 36, height: 36, fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #1976d2, #7c3aed)',
                    boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      {user && (
        <Box
          component="nav"
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box', width: DRAWER_WIDTH,
                border: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box', width: DRAWER_WIDTH,
                border: 'none', borderRight: '1px solid #e2e8f0',
                boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: '56px', sm: '64px' },
          width: { sm: `calc(100% - ${user ? DRAWER_WIDTH : 0}px)` },
          minHeight: '100vh',
          bgcolor: '#f0f4f8',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
