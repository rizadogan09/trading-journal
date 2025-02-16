import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ShowChart,
  AccountBalance,
  Book,
  Settings,
  Token,
  Dashboard,
  Science,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { WebSocketStatus } from '../WebSocketStatus';
import { useTheme as useCustomTheme } from '../../theme/ThemeProvider';

const DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 72;

const Navigation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useCustomTheme();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      description: 'Übersicht und Statistiken'
    },
    {
      text: 'Marktanalyse',
      icon: <ShowChart />,
      path: '/market-analysis',
      description: 'Technische & fundamentale Analyse'
    },
    {
      text: 'Risikomanager',
      icon: <AccountBalance />,
      path: '/risk-manager',
      description: 'Risiko & Money Management'
    },
    { text: 'Journal', icon: <Book />, path: '/journal' },
    { text: 'Instrumente', icon: <Token />, path: '/instruments' },
    { text: 'Einstellungen', icon: <Settings />, path: '/settings' },
    { text: 'Backtesting', icon: <Science />, path: '/backtesting' },
  ];

  const drawer = (
    <>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: isOpen ? 'space-between' : 'center',
        minHeight: 80,
        px: isOpen ? 2 : 1
      }}>
        {isOpen ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png"
                alt="Tracevizion Logo" 
                style={{ 
                  height: '40px', 
                  marginRight: '1rem' 
                }} 
              />
              {!isMobile && (
                <IconButton onClick={() => setIsOpen(false)}>
                  <ChevronLeftIcon />
                </IconButton>
              )}
            </Box>
          </>
        ) : (
          <img 
            src="/symbol.png"
            alt="Tracevizion" 
            style={{ 
              height: 32,
              width: 'auto',
              margin: '0 auto'
            }} 
          />
        )}
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.text}
            title={!isOpen ? item.text : ''}
            placement="right"
            arrow
          >
            <ListItem
              button
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 56,
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                ...(isOpen && {
                  px: 2
                }),
                ...(location.pathname === item.path && {
                  bgcolor: 'primary.light',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main'
                  }
                })
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 0,
                mr: isOpen ? 2 : 'auto',
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              <Collapse in={isOpen} orientation="horizontal">
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    opacity: isOpen ? 1 : 0,
                    whiteSpace: 'nowrap'
                  }} 
                />
              </Collapse>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            sm: `calc(100% - ${isOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH}px)` 
          },
          ml: { 
            sm: `${isOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH}px` 
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setIsOpen(!isOpen)}
            sx={{ 
              mr: 2, 
              display: { xs: 'none', sm: 'flex' },
              ...(isOpen && { display: 'none' })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Tracevizion Trading Journal
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <WebSocketStatus />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: isOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH },
          flexShrink: { sm: 0 } 
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
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
              width: isOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
              boxSizing: 'border-box',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation; 