import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface PerformanceData {
  date: string;
  value: number;
  pnl: number;
}

const PerformanceChart = () => {
  const theme = useTheme();
  
  // Realistischere Beispieldaten
  const data: PerformanceData[] = [
    { date: '01.02', value: 10000, pnl: 0 },
    { date: '02.02', value: 10120, pnl: 120 },
    { date: '03.02', value: 10050, pnl: -70 },
    { date: '04.02', value: 10180, pnl: 130 },
    { date: '05.02', value: 10240, pnl: 60 },
    { date: '06.02', value: 10190, pnl: -50 },
    { date: '07.02', value: 10310, pnl: 120 },
    { date: '08.02', value: 10290, pnl: -20 },
    { date: '09.02', value: 10380, pnl: 90 },
    { date: '10.02', value: 10450, pnl: 70 },
  ];

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.divider}
            opacity={0.2}
          />
          <XAxis 
            dataKey="date" 
            stroke={theme.palette.text.secondary}
            fontSize={12}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            tickFormatter={(value) => `$${value}`}
            fontSize={12}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [`$${value}`, 'Account Value']}
            labelStyle={{ color: theme.palette.text.secondary }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PerformanceChart; 