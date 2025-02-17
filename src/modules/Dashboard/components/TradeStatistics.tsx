import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export const TradeStatistics = () => {
  const trades = useSelector((state: RootState) => state.journal.trades);
  
  const stats = React.useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'CLOSED');
    const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
    
    const winRate = (winningTrades.length / closedTrades.length) * 100;
    const avgRRR = closedTrades.reduce((sum, t) => sum + t.rrr, 0) / closedTrades.length;
    
    const equity = closedTrades.reduce((acc, trade) => {
      const lastBalance = acc[acc.length - 1]?.balance || 10000;
      return [...acc, {
        date: trade.date,
        balance: lastBalance + (trade.pnl || 0)
      }];
    }, []);
    
    const maxDrawdown = calculateMaxDrawdown(equity);
    
    return {
      winRate,
      avgRRR,
      maxDrawdown,
      profitFactor: calculateProfitFactor(closedTrades)
    };
  }, [trades]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Performance Metriken</Typography>
        <Grid container spacing={2}>
          <StatItem 
            label="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            color={stats.winRate > 50 ? 'success' : 'error'}
          />
          <StatItem 
            label="Durchschn. RRR"
            value={`1:${stats.avgRRR.toFixed(2)}`}
            color="primary"
          />
          <StatItem 
            label="Max Drawdown"
            value={`${stats.maxDrawdown.toFixed(2)}%`}
            color="error"
          />
          <StatItem 
            label="Profit Faktor"
            value={stats.profitFactor.toFixed(2)}
            color={stats.profitFactor > 1 ? 'success' : 'error'}
          />
        </Grid>
      </CardContent>
    </Card>
  );
}; 