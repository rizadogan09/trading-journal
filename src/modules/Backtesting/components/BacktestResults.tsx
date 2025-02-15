import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface BacktestResultsProps {
  results: {
    trades: Array<any>;
    statistics: {
      totalTrades: number;
      winRate: number;
      profitFactor: number;
      maxDrawdown: number;
      averageRRR: number;
      netProfit: number;
      sharpeRatio: number;
    };
    equity: Array<{
      date: Date;
      value: number;
    }>;
  };
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ results }) => {
  const { statistics, equity, trades } = results;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Übersicht
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trades
                </Typography>
                <Typography variant="h5">
                  {statistics.totalTrades}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Win Rate
                </Typography>
                <Typography variant="h5" color="success.main">
                  {statistics.winRate.toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Profit Faktor
                </Typography>
                <Typography variant="h5">
                  {statistics.profitFactor.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Netto Profit
                </Typography>
                <Typography 
                  variant="h5"
                  color={statistics.netProfit >= 0 ? 'success.main' : 'error.main'}
                >
                  {statistics.netProfit.toFixed(2)}€
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Equity Kurve
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={equity}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value}€`, 'Equity']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trade Liste
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Datum</TableCell>
                  <TableCell>Richtung</TableCell>
                  <TableCell align="right">Entry</TableCell>
                  <TableCell align="right">Exit</TableCell>
                  <TableCell align="right">RRR</TableCell>
                  <TableCell align="right">P/L</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(trade.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={trade.direction}
                        color={trade.direction === 'LONG' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{trade.entryPrice}</TableCell>
                    <TableCell align="right">{trade.exitPrice}</TableCell>
                    <TableCell align="right">1:{trade.rrr.toFixed(2)}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: trade.pnl >= 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      {trade.pnl.toFixed(2)}€
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BacktestResults; 