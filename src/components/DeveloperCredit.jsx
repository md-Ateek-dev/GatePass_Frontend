import { Box, Typography, Link } from '@mui/material';

export const DEVELOPER_PORTFOLIO_URL = 'https://ateek.netlify.app/';
export const DEVELOPER_CONTACT = '7054375826';

const DeveloperCredit = ({ variant = 'light', sx = {} }) => {
  const isDark = variant === 'dark';
  const muted = isDark ? 'rgba(255,255,255,0.55)' : '#94a3b8';
  const accent = isDark ? '#93c5fd' : '#1565c0';
  const border = isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0';

  return (
    <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: `1px solid ${border}`, ...sx }}>
      <Typography variant="caption" sx={{ color: muted, display: 'block', lineHeight: 1.9 }}>
        Developed by <Box component="span" sx={{ fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.85)' : '#475569' }}>Mohd Ateek</Box>
      </Typography>
      <Typography variant="caption" sx={{ color: muted, display: 'block', lineHeight: 1.9 }}>
        Contact:{' '}
        <Link href={`tel:${DEVELOPER_CONTACT}`} sx={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
          {DEVELOPER_CONTACT}
        </Link>
      </Typography>
      <Typography variant="caption" sx={{ color: muted, display: 'block', lineHeight: 1.9 }}>
        Portfolio:{' '}
        <Link href={DEVELOPER_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" sx={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
          Visit ateek.netlify.app
        </Link>
      </Typography>
    </Box>
  );
};

export default DeveloperCredit;
