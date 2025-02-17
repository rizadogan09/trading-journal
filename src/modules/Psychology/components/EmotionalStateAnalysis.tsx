import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  Card,
  CardContent,
  Typography,
  Box
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

export const EmotionalStateAnalysis: React.FC = () => {
  const emotionalStates = useSelector(
    (state: RootState) => state.psychology.emotionalStates
  );

  const chartData = emotionalStates.map(state => ({
    date: new Date(state.date).toLocaleDateString(),
    stress: state.stress,
    focus: state.focus,
    confidence: state.confidence
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Psychologie-Analyse
        </Typography>
        
        <Box sx={{ height: 300, mb: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="stress" stroke="#ff0000" name="Stress" />
              <Line type="monotone" dataKey="focus" stroke="#00ff00" name="Fokus" />
              <Line type="monotone" dataKey="confidence" stroke="#0000ff" name="Selbstvertrauen" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}; 