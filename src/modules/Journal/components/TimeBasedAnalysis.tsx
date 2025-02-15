import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';

interface TimeBasedAnalysisProps {
  trades: any[];
  dateFrom: Date;
  dateTo: Date;
}

const TimeBasedAnalysis = ({ trades, dateFrom, dateTo }: TimeBasedAnalysisProps) => {
  const monthlyData = React.useMemo(() => {
    const months = eachMonthOfInterval({ start: dateFrom, end: dateTo });
    
    return months.map(month => {
      const monthTrades = trades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate >= startOfMonth(month) && tradeDate <= endOfMonth(month);
      });

      const wins = monthTrades.filter(t => t.pnl > 0).length;
      const losses = monthTrades.filter(t => t.pnl < 0).length;
      const totalPnL = monthTrades.reduce((sum, t) => sum + t.pnl, 0);

      return {
        month: format(month, 'MMM yyyy', { locale: de }),
        trades: monthTrades.length,
        winRate: monthTrades.length > 0 ? (wins / monthTrades.length) * 100 : 0,
        pnl: totalPnL,
        avgTradeSize: monthTrades.length > 0 ? totalPnL / monthTrades.length : 0
      };
    });
  }, [trades, dateFrom, dateTo]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Monatliche Performance
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: 4
                  }}
                />
                <Bar yAxisId="left" dataKey="pnl" fill="#8884d8" name="P/L" />
                <Bar yAxisId="right" dataKey="winRate" fill="#82ca9d" name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Monatliche Statistiken
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Monat</TableCell>
                <TableCell align="right">Trades</TableCell>
                <TableCell align="right">Win Rate</TableCell>
                <TableCell align="right">P/L</TableCell>
                <TableCell align="right">Ø Trade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell>{data.month}</TableCell>
                  <TableCell align="right">{data.trades}</TableCell>
                  <TableCell align="right">{data.winRate.toFixed(1)}%</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: data.pnl >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 500
                    }}
                  >
                    {data.pnl > 0 ? '+' : ''}{data.pnl.toFixed(2)}€
                  </TableCell>
                  <TableCell align="right">{data.avgTradeSize.toFixed(2)}€</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TimeBasedAnalysis; 