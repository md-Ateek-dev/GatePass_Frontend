import { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { luxuryPalette } from '../theme/luxuryPalette';

export const ThemeModeContext = createContext({
  mode: 'light',
  toggleThemeMode: () => {},
});

const luxuryColors = {
  light: {
    primary: '#1e3a8a',
    primaryDark: '#0f172a',
    primaryLight: '#2563eb',
    secondary: '#2563eb',
    secondaryDark: '#1e3a8a',
    secondaryLight: '#60a5fa',
    bg: luxuryPalette.lightBg,
    paper: 'rgba(255, 255, 255, 0.82)',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
  },
  dark: {
    primary: '#2563eb',
    primaryDark: '#0f172a',
    primaryLight: '#60a5fa',
    secondary: '#1e3a8a',
    secondaryDark: '#0f172a',
    secondaryLight: '#3b82f6',
    bg: '#090d16',
    paper: 'rgba(17, 25, 40, 0.72)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
  },
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'light' || savedMode === 'dark') return savedMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleThemeMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    const isDark = mode === 'dark';
    const c = isDark ? luxuryColors.dark : luxuryColors.light;

    return createTheme({
      palette: {
        mode,
        primary: {
          main: c.primary,
          dark: c.primaryDark,
          light: c.primaryLight,
          contrastText: isDark ? luxuryPalette.navy : '#ffffff',
        },
        secondary: {
          main: c.secondary,
          dark: c.secondaryDark,
          light: c.secondaryLight,
          contrastText: luxuryPalette.navy,
        },
        success: { main: luxuryPalette.emerald },
        warning: { main: '#d97706' },
        error: { main: luxuryPalette.rose },
        background: {
          default: c.bg,
          paper: c.paper,
        },
        text: {
          primary: c.textPrimary,
          secondary: c.textSecondary,
        },
        divider: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 28, 46, 0.08)',
      },
      typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
        h4: { fontWeight: 800, letterSpacing: '-0.03em' },
        h5: { fontWeight: 800, letterSpacing: '-0.025em' },
        h6: { fontWeight: 700, letterSpacing: '-0.02em' },
        subtitle1: { fontWeight: 600, letterSpacing: '0.01em' },
        subtitle2: { fontWeight: 600 },
        button: { fontWeight: 700, letterSpacing: '0.02em' },
      },
      shape: { borderRadius: 16 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollbarColor: isDark
                ? `${luxuryPalette.goldDark} ${c.bg}`
                : `rgba(15, 23, 42, 0.2) ${c.bg}`,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 12,
              padding: '10px 22px',
              transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            },
            containedPrimary: {
              background: isDark
                ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)'
                : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
              color: '#ffffff',
              boxShadow: isDark
                ? '0 4px 16px rgba(59, 130, 246, 0.35)'
                : '0 4px 16px rgba(37, 99, 235, 0.22)',
              '&:hover': {
                background: isDark
                  ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                boxShadow: isDark
                  ? '0 6px 22px rgba(59, 130, 246, 0.5)'
                  : '0 6px 22px rgba(37, 99, 235, 0.32)',
                transform: 'translateY(-1px)',
              },
            },
            containedSecondary: {
              background: isDark
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))'
                : 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.03))',
              color: isDark ? '#60a5fa' : '#1e3a8a',
              border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)'}`,
              '&:hover': {
                background: isDark
                  ? 'rgba(59, 130, 246, 0.22)'
                  : 'rgba(37, 99, 235, 0.12)',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.5)'}`,
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.35)'
                : '0 8px 24px rgba(15, 23, 42, 0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.5)'}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { fontWeight: 700, borderRadius: 8 },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(226, 232, 240, 0.6)',
              color: isDark ? '#60a5fa' : c.primary,
              fontWeight: 800,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              borderBottom: `2px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.08)'}`,
            },
            root: {
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15, 23, 42, 0.05)'}`,
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: {
              height: 3,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #1e3a8a, #2563eb)',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              fontWeight: 700,
              '&.Mui-selected': {
                color: isDark ? luxuryPalette.goldLight : c.primary,
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 14,
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : '#ffffff',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 28, 46, 0.12)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(37, 99, 235, 0.4)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#60a5fa' : '#2563eb',
                borderWidth: '1px',
              },
              '&.Mui-focused': {
                boxShadow: isDark ? '0 0 14px rgba(59, 130, 246, 0.18)' : '0 0 14px rgba(37, 99, 235, 0.08)',
              },
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 20,
              border: `1px solid ${isDark ? 'rgba(197, 160, 89, 0.12)' : 'rgba(15, 23, 42, 0.08)'}`,
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35)',
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
