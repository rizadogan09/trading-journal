import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box, LinearProgress } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Timeline,
  Assessment,
  ShowChart
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { wsService } from '../../services/websocketService';
import { updatePosition } from '../../store/journalSlice';
import PerformanceChart from './components/PerformanceChart';
import { LivePerformanceStats } from './components/LivePerformanceStats';
import OpenPositions from './components/OpenPositions';

const StatCard = ({ title, value, icon, trend, color }: any) => (
  <Paper sx={{ 
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    background: 'linear-gradient(135deg, rgba(58, 143, 255, 0.05) 0%, rgba(18, 20, 26, 0) 100%)',
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      {icon}
    </Box>
    <Typography variant="h4">{value}</Typography>
    {trend && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {trend > 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
        <Typography 
          variant="body2" 
          color={trend > 0 ? 'success.main' : 'error.main'}
        >
          {Math.abs(trend)}%
        </Typography>
      </Box>
    )}
  </Paper>
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const trades = useSelector((state: RootState) => state.journal.trades);

  useEffect(() => {
    wsService.subscribe('trades', (data) => {
      if (data.type === 'update' || data.type === 'closed') {
        dispatch(updatePosition(data));
      }
    });

    return () => {
      wsService.unsubscribe('trades', () => {});
    };
  }, [dispatch]);

  const stats = React.useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'CLOSED');
    const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
    
    const winRate = closedTrades.length > 0 
      ? (winningTrades.length / closedTrades.length) * 100 
      : 0;

    const totalProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
    const averageRRR = closedTrades.length > 0 
      ? closedTrades.reduce((sum, t) => sum + t.rrr, 0) / closedTrades.length 
      : 0;

    return {
      winRate: Number(winRate.toFixed(2)),
      profitFactor: Number(profitFactor.toFixed(2)),
      averageRRR: Number(averageRRR.toFixed(2))
    };
  }, [trades]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Win Rate"
            value={`${stats.winRate}%`}
            icon={<Assessment sx={{ color: 'primary.main' }} />}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Profit Faktor"
            value={stats.profitFactor}
            icon={<ShowChart sx={{ color: 'primary.main' }} />}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Durchschn. RRR"
            value={`1:${stats.averageRRR}`}
            icon={<Timeline sx={{ color: 'primary.main' }} />}
          />
        </Grid>

        <Grid item xs={12}>
          <LivePerformanceStats />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Performance Übersicht</Typography>
            <PerformanceChart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Offene Positionen</Typography>
            <OpenPositions />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 