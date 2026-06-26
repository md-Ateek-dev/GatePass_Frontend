/** Executive luxury palette — navy, champagne gold, warm ivory */
export const luxuryPalette = {
  navy: '#0f1c2e',
  navyMid: '#1a2d4a',
  navyLight: '#2a4365',
  gold: '#c5a059',
  goldLight: '#d4b87a',
  goldDark: '#a6843f',
  champagne: '#e8dcc8',
  ivory: '#f8f6f2',
  ivoryDark: '#ebe6dc',
  slate: '#64748b',
  emerald: '#0d9488',
  rose: '#be123c',

  // Premium Light Theme Palette (High contrast slate & burnished gold)
  lightBg: '#f8fafc',
  lightPaper: '#ffffff',
  lightPrimary: '#0f172a',
  lightPrimaryMid: '#1e293b',
  lightPrimaryLight: '#334155',
  lightSecondary: '#926f2f',
  lightSecondaryLight: '#b59049',
  lightSecondaryDark: '#75541c',
  lightTextPrimary: '#0f172a',
  lightTextSecondary: '#475569',
  lightBorder: 'rgba(15, 23, 42, 0.08)',
};

export const luxuryGradients = {
  primary: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
  goldAccent: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
  hero: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 40%, #2563eb 100%)',
  subtle: 'linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, transparent 100%)',
};

export const pagePaperSx = {
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: (theme) =>
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0,0,0,0.35)'
      : '0 4px 24px rgba(15, 28, 46, 0.06)',
  overflow: 'hidden',
  bgcolor: 'background.paper',
};

export const primaryButtonSx = {
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '12px',
  px: 2.5,
  py: 1,
  background: luxuryGradients.primary,
  color: '#ffffff',
  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
    transform: 'translateY(-1px)',
  },
};

export const outlinedGoldButtonSx = {
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '12px',
  borderColor: 'primary.main',
  color: 'primary.main',
  '&:hover': {
    borderColor: 'primary.light',
    bgcolor: 'rgba(37, 99, 235, 0.08)',
  },
};
