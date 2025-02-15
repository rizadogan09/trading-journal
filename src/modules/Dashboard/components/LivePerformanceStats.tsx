import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Box, Typography, Paper } from '@mui/material';

export const LivePerformanceStats = () => {
  const trades = useSelector((state: RootState) => state.journal.trades);
  
  const todaysTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    const today = new Date();
    return (
      tradeDate.getDate() === today.getDate() &&
      tradeDate.getMonth() === today.getMonth() &&
      tradeDate.getFullYear() === today.getFullYear()
    );
  });

  const todaysPnL = todaysTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winRate = todaysTrades.length > 0 
    ? (todaysTrades.filter(t => (t.pnl || 0) > 0).length / todaysTrades.length) * 100 
    : 0;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Live Performance</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Tages P/L</Typography>
          <Typography 
            variant="h5"
            color={todaysPnL >= 0 ? 'success.main' : 'error.main'}
          >
            {todaysPnL.toFixed(2)}€
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Win Rate (heute)</Typography>
          <Typography variant="h5">{winRate.toFixed(1)}%</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Aktive Positionen</Typography>
          <Typography variant="h5">
            {trades.filter(t => t.status === 'OPEN').length}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}; 