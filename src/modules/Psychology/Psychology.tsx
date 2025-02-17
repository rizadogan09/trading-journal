import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Psychology: React.FC = () => {
  const psychologyState = useSelector((state: RootState) => state.psychology);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trading Psychologie Analyse
      </Typography>
      
      <Grid container spacing={3}>
        {/* Aktuelle Stress-Levels */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aktuelle Stress-Levels
              </Typography>
              <Typography>
                Drawdown: {psychologyState.stressLevels.drawdown}/10
              </Typography>
              <Typography>
                FOMO: {psychologyState.stressLevels.fomo}/10
              </Typography>
              <Typography>
                Überhandeln: {psychologyState.stressLevels.overtrading}/10
              </Typography>
              <Typography>
                Revenge Trading: {psychologyState.stressLevels.revenge}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Historische Analyse */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stress-Level Verlauf
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={psychologyState.history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="stressLevels.drawdown" name="Drawdown" stroke="#8884d8" />
                    <Line type="monotone" dataKey="stressLevels.fomo" name="FOMO" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="stressLevels.overtrading" name="Überhandeln" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notizen */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aktuelle Notizen
              </Typography>
              <Typography>
                {psychologyState.thoughts || 'Keine Notizen vorhanden'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Psychology; 