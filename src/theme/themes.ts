import { ThemeOptions } from '@mui/material';

export const baseTheme = {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1E1E1E',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.4)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E1E1E',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          variants: []
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 16px'
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#252525',
          color: '#fff'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#252525'
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#fff'
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#fff'
    },
    body1: {
      fontSize: '0.875rem',
      color: '#fff'
    },
    body2: {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.7)'
    }
  }
};

export const darkTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#0088CC',
      light: '#0099E6',
      dark: '#007AB8'
    },
    secondary: {
      main: '#00B894',
      light: '#00D1AB',
      dark: '#00A67D'
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E'
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)'
    },
    divider: 'rgba(255, 255, 255, 0.1)'
  }
};

export const lightTheme = darkTheme; // Wir verwenden nur das dunkle Theme 