/** Shared login TextField styles — no blue autofill/focus tint */
export const getLoginFieldSx = (isDark, { mb = 3 } = {}) => ({
  mb,
  '& .MuiInputLabel-root': {
    color: isDark ? 'rgba(245, 240, 232, 0.65)' : 'rgba(15, 28, 46, 0.55)',
    '&.Mui-focused': { color: '#a6843f' },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
    color: isDark ? '#f5f0e8' : '#0f1c2e',
    '& fieldset': {
      borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 28, 46, 0.14)',
    },
    '&:hover fieldset': {
      borderColor: isDark ? 'rgba(197, 160, 89, 0.45)' : 'rgba(15, 28, 46, 0.28)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#c5a059',
      borderWidth: '1px',
    },
    '&.Mui-focused': {
      boxShadow: 'none',
    },
  },
  '& input': {
    color: isDark ? '#f5f0e8' : '#0f1c2e',
  },
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
    WebkitBoxShadow: isDark
      ? '0 0 0 1000px #141c2e inset'
      : '0 0 0 1000px #ffffff inset',
    WebkitTextFillColor: isDark ? '#f5f0e8' : '#0f1c2e',
    caretColor: isDark ? '#f5f0e8' : '#0f1c2e',
    transition: 'background-color 99999s ease-out 0s',
  },
});
