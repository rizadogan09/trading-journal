import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export const LivePerformanceStats = () => {
  const trades = useSelector((state: RootState) => state.marketAnalysis.positions);
  const isConnected = useSelector((state: RootState) => state.realtime.isConnected);

  const stats = React.useMemo(() => {
    const activeTrades = trades.filter(t => t.status === 'OPEN');
    const dailyPnL = activeTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winningTrades = activeTrades.filter(t => t.pnl > 0).length;
    const winRate = activeTrades.length > 0 ? (winningTrades / activeTrades.length) * 100 : 0;

    return {
      dailyPnL,
      winRate,
      activePositions: activeTrades.length
    };
  }, [trades]);

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Live Performance
            {isConnected && (
              <Box component="span" sx={{ ml: 1, animation: 'pulse 2s infinite' }}>
                •
              </Box>
            )}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tages P/L
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {stats.dailyPnL > 0 ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
              <Typography
                variant="h6"
                color={stats.dailyPnL >= 0 ? 'success.main' : 'error.main'}
              >
                {stats.dailyPnL.toFixed(2)}€
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Win Rate (Heute)
          </Typography>
          <Typography variant="h6">
            {stats.winRate.toFixed(1)}%
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Aktive Positionen
          </Typography>
          <Typography variant="h6">
            {stats.activePositions}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}; 