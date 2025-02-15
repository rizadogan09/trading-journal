import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AdvantageMeterProps {
  advantage: number;
}

const MeterContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 60,
  backgroundColor: theme.palette.grey[800],
  borderRadius: 30,
  overflow: 'hidden',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const MeterFill = styled(Box)<{ advantage: number }>(({ theme, advantage }) => ({
  position: 'absolute',
  height: '100%',
  width: `${Math.abs(advantage)}%`,
  left: advantage < 0 ? 'auto' : '50%',
  right: advantage < 0 ? '50%' : 'auto',
  backgroundColor: advantage > 0 
    ? theme.palette.success.main 
    : advantage < 0 
      ? theme.palette.error.main 
      : theme.palette.warning.main,
  transition: 'all 0.3s ease'
}));

const CenterLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  height: '100%',
  width: 2,
  backgroundColor: theme.palette.grey[600],
  transform: 'translateX(-50%)'
}));

export const AdvantageMeter: React.FC<AdvantageMeterProps> = ({ advantage }) => {
  return (
    <Box>
      <Typography 
        variant="h3" 
        align="center" 
        color={advantage > 0 ? 'success.main' : advantage < 0 ? 'error.main' : 'warning.main'}
        sx={{ mb: 2 }}
      >
        {advantage}%
      </Typography>
      <MeterContainer>
        <CenterLine />
        <MeterFill advantage={advantage} />
      </MeterContainer>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        mt={1}
        sx={{ color: 'text.secondary' }}
      >
        <Typography>Short 100%</Typography>
        <Typography>Neutral</Typography>
        <Typography>Long 100%</Typography>
      </Box>
    </Box>
  );
}; 