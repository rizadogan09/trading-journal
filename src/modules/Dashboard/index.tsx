import React from 'react';
import { Grid, Paper, Typography, Box, LinearProgress } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Timeline,
  Assessment,
  ShowChart
} from '@mui/icons-material';
import PerformanceChart from './components/PerformanceChart';
import CurrentAnalysis from './components/CurrentAnalysis';
import OpenPositions from './components/OpenPositions';
import PerformanceStats from './components/PerformanceStats';
import { PositionSummary } from './components/PositionSummary';

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

const Dashboard = () => {
  const stats = PerformanceStats();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Win Rate"
            value={stats.winRate}
            icon={<Assessment sx={{ color: 'primary.main' }} />}
            trend={2.5}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Profit Faktor"
            value={stats.profitFactor}
            icon={<ShowChart sx={{ color: 'primary.main' }} />}
            trend={-1.2}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Durchschn. RRR"
            value={stats.averageRRR}
            icon={<Timeline sx={{ color: 'primary.main' }} />}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Drawdown
            </Typography>
            <Box sx={{ mt: 2, mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={(stats.drawdown.current / stats.drawdown.max) * 100} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {stats.drawdown.current}% von max. {stats.drawdown.max}%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <PositionSummary />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aktuelle Marktanalyse
            </Typography>
            <CurrentAnalysis />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Offene Positionen
            </Typography>
            <OpenPositions />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Übersicht
            </Typography>
            <PerformanceChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 