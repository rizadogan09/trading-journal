import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';
import { Trade } from '../../../types/trade';

interface TradingTimeAnalysisProps {
  trades: Trade[];
}

const TradingTimeAnalysis: React.FC<TradingTimeAnalysisProps> = ({ trades }) => {
  const getHourlyStats = () => {
    const hourlyStats = new Map<number, { count: number; pnl: number }>();
    
    trades.forEach(trade => {
      if (trade.entryTime) {
        const hour = parseInt(trade.entryTime.split(':')[0]);
        const current = hourlyStats.get(hour) || { count: 0, pnl: 0 };
        
        hourlyStats.set(hour, {
          count: current.count + 1,
          pnl: current.pnl + (trade.pnl || 0)
        });
      }
    });

    return Array.from(hourlyStats.entries())
      .sort(([hourA], [hourB]) => hourA - hourB);
  };

  const hourlyStats = getHourlyStats();

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Handelszeiten Analyse
      </Typography>
      <Grid container spacing={2}>
        {hourlyStats.map(([hour, stats]) => (
          <Grid item xs={4} sm={3} md={2} key={hour}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">
                {`${hour}:00 - ${hour + 1}:00`}
              </Typography>
              <Typography color={stats.pnl >= 0 ? 'success.main' : 'error.main'}>
                {stats.pnl.toFixed(2)}€
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.count} Trades
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TradingTimeAnalysis; 