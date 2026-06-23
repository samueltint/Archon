import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#aa3bff', // accent purple
    },
    secondary: {
      main: '#aa3bff',
    },
    text: {
      primary: '#6b6375',
      secondary: '#08060d',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    divider: '#e5e4e7',
    action: {
      hover: 'rgba(170, 59, 255, 0.1)',
      selected: 'rgba(170, 59, 255, 0.1)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
    fontSize: 18,
    lineHeight: 1.45,
    letterSpacing: '0.18px',
    h1: {
      fontSize: '56px',
      fontWeight: 500,
      color: '#08060d',
      letterSpacing: '-1.68px',
      margin: '32px 0',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
      color: '#08060d',
      letterSpacing: '-0.24px',
      margin: '0 0 8px',
      lineHeight: '118%',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c084fc', // lighter purple for dark mode
    },
    secondary: {
      main: '#c084fc',
    },
    text: {
      primary: '#9ca3af',
      secondary: '#f3f4f6',
    },
    background: {
      default: '#16171d',
      paper: '#16171d',
    },
    divider: '#2e303a',
    action: {
      hover: 'rgba(192, 132, 252, 0.15)',
      selected: 'rgba(192, 132, 252, 0.15)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
    fontSize: 18,
    lineHeight: 1.45,
    letterSpacing: '0.18px',
    h1: {
      fontSize: '56px',
      fontWeight: 500,
      color: '#f3f4f6',
      letterSpacing: '-1.68px',
      margin: '32px 0',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
      color: '#f3f4f6',
      letterSpacing: '-0.24px',
      margin: '0 0 8px',
      lineHeight: '118%',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px',
        },
      },
    },
  },
});
