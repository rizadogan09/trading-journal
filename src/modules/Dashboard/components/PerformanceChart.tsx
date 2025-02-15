import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const PerformanceChart = () => {
  const trades = useSelector((state: RootState) => state.journal.trades);

  const data = trades
    .filter(t => t.status === 'CLOSED')
    .reduce((acc, trade) => {
      const date = format(new Date(trade.date), 'MMM yyyy', { locale: de });
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        existing.pnl += trade.pnl || 0;
        existing.trades += 1;
      } else {
        acc.push({
          date,
          pnl: trade.pnl || 0,
          trades: 1
        });
      }
      
      return acc;
    }, [] as Array<{ date: string; pnl: number; trades: number }>);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="pnl" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart; 