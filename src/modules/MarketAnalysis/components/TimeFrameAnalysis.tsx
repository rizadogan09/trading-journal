import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

interface TimeFrameAnalysisProps {
  timeLevels: Record<string, string>;
  onTimeFrameChange: (timeFrame: string, value: string) => void;
}

const TimeFrameAnalysis: React.FC<TimeFrameAnalysisProps> = ({
  timeLevels,
  onTimeFrameChange
}) => {
  const timeFrames = [
    { id: '4h', label: '4H' },
    { id: '1h', label: '1H' },
    { id: '15m', label: '15M' }
  ];

  const handleTimeFrameChange = (timeFrame: string, value: string) => {
    onTimeFrameChange(timeFrame, value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Zeitebenen Analyse
      </Typography>
      <Grid container spacing={2}>
        {timeFrames.map((tf) => (
          <Grid item xs={12} key={tf.id}>
            <FormControl fullWidth>
              <InputLabel>{tf.label}</InputLabel>
              <Select
                value={timeLevels[tf.id] || ''}
                onChange={(e) => handleTimeFrameChange(tf.id, e.target.value)}
              >
                <MenuItem value="bullish">Bullish</MenuItem>
                <MenuItem value="bearish">Bearish</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TimeFrameAnalysis; 