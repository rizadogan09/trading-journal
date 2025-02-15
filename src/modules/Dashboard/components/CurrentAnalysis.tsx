import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const CurrentAnalysis = () => {
  const analyses = useSelector((state: RootState) => state.marketAnalysis.analyses);
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);
  
  // Letzte 3 Analysen holen
  const recentAnalyses = [...analyses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Stack spacing={2}>
      {recentAnalyses.map((analysis) => {
        const instrument = instruments.find(i => i.id === analysis.instrumentId);
        const advantage = analysis.advantage;
        
        return (
          <Box key={analysis.id} sx={{ 
            p: 2, 
            borderRadius: 1,
            bgcolor: 'rgba(58, 143, 255, 0.05)',
            border: '1px solid rgba(58, 143, 255, 0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">
                {instrument?.name}
              </Typography>
              <Chip 
                label={`${advantage}%`}
                color={advantage > 0 ? 'success' : advantage < 0 ? 'error' : 'default'}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {Object.entries(analysis.timeLevels).map(([timeLevel, direction]) => (
                <Chip
                  key={timeLevel}
                  label={`${timeLevel}min: ${direction}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};

export default CurrentAnalysis; 