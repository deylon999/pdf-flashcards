import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7FD8B0', contrastText: '#14161A' },
    background: { default: '#14161A', paper: '#1E2229' },
    text: { primary: '#E8EAED', secondary: '#8B9099' },
    divider: '#2A2F38',
  },
  typography: {
    fontFamily: 'Sora, sans-serif',
    h1: { fontWeight: 300 },
    h2: { fontWeight: 300 },
    h3: { fontWeight: 300 },
    h4: {
      fontWeight: 300,
      fontSize: '2.125rem',
      '@media (max-width:600px)': { fontSize: '1.6rem' },
    },
    h5: {
      fontWeight: 300,
      '@media (max-width:600px)': { fontSize: '1.25rem' },
    },
    h6: { fontWeight: 300 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', boxShadow: 'none' },
      },
    },
  },
});
