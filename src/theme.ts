import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3a8fff',
      light: '#5ba3ff',
      dark: '#2979ff',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff5a92',
      dark: '#f50057',
    },
    error: {
      main: '#ff4444',
      light: '#ff6b6b',
    },
    success: {
      main: '#00e676',
      light: '#69f0ae',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
    },
    background: {
      default: '#0A0B0D',
      paper: '#12141A',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.04)',
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    h4: {
      fontWeight: 500,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '0.875rem',
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.8125rem',
      letterSpacing: '-0.01em',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#12141A',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          '&:hover': {
            boxShadow: '0 0 30px rgba(58, 143, 255, 0.1)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0a0a0a', 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0a0a',
          borderRight: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #3a8fff 0%, #2979ff 100%)',
          boxShadow: '0 8px 16px rgba(58, 143, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 12px 20px rgba(58, 143, 255, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(58, 143, 255, 0.5)',
          '&:hover': {
            borderColor: '#3a8fff',
            backgroundColor: 'rgba(58, 143, 255, 0.08)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: alpha('#3a8fff', 0.15),
            '&:hover': {
              backgroundColor: alpha('#3a8fff', 0.25),
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: alpha('#12141A', 0.4),
            backdropFilter: 'blur(20px)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(58, 143, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3a8fff',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(58, 143, 255, 0.05) 0%, rgba(18, 20, 26, 0) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
        },
        head: {
          fontWeight: 500,
          backgroundColor: alpha('#12141A', 0.5),
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          '& .MuiTabs-indicator': {
            backgroundColor: '#3a8fff',
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          minWidth: 100,
          '&.Mui-selected': {
            color: '#3a8fff',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'linear-gradient(135deg, rgba(58, 143, 255, 0.03) 0%, rgba(18, 20, 26, 0) 100%)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme; 