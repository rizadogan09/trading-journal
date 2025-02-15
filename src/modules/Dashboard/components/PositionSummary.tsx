import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export const PositionSummary = () => {
  const positions = useSelector((state: RootState) => state.marketAnalysis.positions);
  const isConnected = useSelector((state: RootState) => state.realtime.isConnected);

  const summary = React.useMemo(() => {
    const openPositions = positions.filter(p => p.status === 'OPEN');
    const totalPnL = openPositions.reduce((sum, p) => sum + p.pnl, 0);
    const profitablePositions = openPositions.filter(p => p.pnl > 0);
    
    return {
      totalPositions: openPositions.length,
      profitablePositions: profitablePositions.length,
      totalPnL,
      averagePnL: openPositions.length > 0 ? totalPnL / openPositions.length : 0
    };
  }, [positions]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Position Summary</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Offene Positionen
            </Typography>
            <Typography variant="h5">
              {summary.totalPositions}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Im Gewinn
            </Typography>
            <Typography variant="h5" color="success.main">
              {summary.profitablePositions}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Gesamt P/L
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {summary.totalPnL > 0 ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
              <Typography 
                variant="h5" 
                color={summary.totalPnL >= 0 ? 'success.main' : 'error.main'}
              >
                {summary.totalPnL.toFixed(2)}€
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Ø P/L pro Position
            </Typography>
            <Typography 
              variant="h5" 
              color={summary.averagePnL >= 0 ? 'success.main' : 'error.main'}
            >
              {summary.averagePnL.toFixed(2)}€
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {!isConnected && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ display: 'block', mt: 2 }}
        >
          * Live-Updates nicht verfügbar
        </Typography>
      )}
    </Paper>
  );
}; 