import { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { luxuryPalette } from '../theme/luxuryPalette';

export const ThemeModeContext = createContext({
  mode: 'light',
  toggleThemeMode: () => {},
});

const luxuryColors = {
  light: {
    primary: luxuryPalette.lightPrimaryMid,
    primaryDark: luxuryPalette.lightPrimary,
    primaryLight: luxuryPalette.lightPrimaryLight,
    secondary: luxuryPalette.lightSecondary,
    secondaryDark: luxuryPalette.lightSecondaryDark,
    secondaryLight: luxuryPalette.lightSecondaryLight,
    bg: luxuryPalette.lightBg,
    paper: luxuryPalette.lightPaper,
    textPrimary: luxuryPalette.lightTextPrimary,
    textSecondary: luxuryPalette.lightTextSecondary,
  },
  dark: {
    primary: luxuryPalette.goldLight,
    primaryDark: luxuryPalette.gold,
    primaryLight: '#e8d4a8',
    secondary: luxuryPalette.gold,
    secondaryDark: luxuryPalette.goldDark,
    secondaryLight: luxuryPalette.goldLight,
    bg: '#080c14',
    paper: '#101827',
    textPrimary: '#f5f0e8',
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
        divider: isDark ? 'rgba(197, 160, 89, 0.12)' : 'rgba(15, 28, 46, 0.08)',
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
                ? `linear-gradient(135deg, ${luxuryPalette.goldLight}, ${luxuryPalette.gold})`
                : `linear-gradient(135deg, ${c.primaryLight}, ${c.primary})`,
              color: isDark ? luxuryPalette.navy : '#fff',
              boxShadow: isDark
                ? '0 4px 16px rgba(197, 160, 89, 0.25)'
                : '0 4px 16px rgba(15, 23, 42, 0.15)',
              '&:hover': {
                background: isDark
                  ? `linear-gradient(135deg, ${luxuryPalette.gold}, ${luxuryPalette.goldDark})`
                  : `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`,
                boxShadow: isDark
                  ? '0 6px 22px rgba(197, 160, 89, 0.35)'
                  : '0 6px 22px rgba(15, 23, 42, 0.22)',
                transform: 'translateY(-1px)',
              },
            },
            containedSecondary: {
              background: `linear-gradient(135deg, ${luxuryPalette.goldLight}, ${luxuryPalette.goldDark})`,
              color: luxuryPalette.navy,
              '&:hover': {
                background: `linear-gradient(135deg, ${luxuryPalette.gold}, ${luxuryPalette.goldDark})`,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(197, 160, 89, 0.1)' : 'rgba(15, 23, 42, 0.06)'}`,
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 24px rgba(15, 23, 42, 0.04)',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(197, 160, 89, 0.1)' : 'rgba(15, 23, 42, 0.06)'}`,
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
              backgroundColor: isDark ? '#141e30' : '#f1f5f9',
              color: isDark ? luxuryPalette.goldLight : c.primary,
              fontWeight: 800,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              borderBottom: `2px solid ${isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(15, 23, 42, 0.08)'}`,
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
              background: `linear-gradient(90deg, ${luxuryPalette.gold}, ${luxuryPalette.goldLight})`,
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
              borderRadius: 12,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: c.secondary,
                borderWidth: '1px',
              },
              '&.Mui-focused': {
                boxShadow: 'none',
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
