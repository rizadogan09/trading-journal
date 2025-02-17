import React from 'react';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import Navigation from './components/Navigation';
import MarketAnalysis from './modules/MarketAnalysis';
import RiskManager from './modules/RiskManager';
import Journal from './modules/Journal';
import Instruments from './modules/Instruments';
import Settings from './modules/Settings';
import Dashboard from './modules/Dashboard';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import { WebSocketProvider } from './providers/WebSocketProvider';
import './styles/animations.css';  // CSS für Animationen
import { Notifications } from './components/Notifications';
import Backtesting from './modules/Backtesting';
import { CustomThemeProvider } from './theme/ThemeProvider';
import Psychology from './modules/Psychology/Psychology';

declare global {
  interface Window {
    TradingView: any;
  }
}

function App() {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
          <WebSocketProvider>
            <CssBaseline />
            <Notifications />
            <Router>
              <Box sx={{ display: 'flex' }}>
                <Navigation />
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    overflow: 'auto',
                    backgroundColor: theme.palette.background.default
                  }}
                >
                  <Toolbar />
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/market-analysis" element={<MarketAnalysis />} />
                    <Route path="/risk-manager" element={<RiskManager />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/instruments" element={<Instruments />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/backtesting" element={<Backtesting />} />
                    <Route path="/psychology" element={<Psychology />} />
                  </Routes>
                </Box>
              </Box>
            </Router>
          </WebSocketProvider>
        </LocalizationProvider>
      </CustomThemeProvider>
    </Provider>
  );
}

export default App; 