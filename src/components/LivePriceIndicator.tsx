import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Typography, Chip } from '@mui/material';

interface LivePriceIndicatorProps {
  instrumentId: string;
}

export const LivePriceIndicator: React.FC<LivePriceIndicatorProps> = ({ instrumentId }) => {
  const priceData = useSelector((state: RootState) => 
    state.realtime.prices[instrumentId]
  );
  const isConnected = useSelector((state: RootState) => 
    state.realtime.isConnected
  );

  if (!priceData) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2">
        Live: {priceData.price.toFixed(2)}
      </Typography>
      <Chip 
        size="small"
        label={isConnected ? 'Connected' : 'Disconnected'}
        color={isConnected ? 'success' : 'error'}
      />
    </Box>
  );
}; 