import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Chip, Tooltip } from '@mui/material';
import { WifiOff, Wifi } from '@mui/icons-material';

export const WebSocketStatus = () => {
  const isConnected = useSelector((state: RootState) => state.realtime.isConnected);
  const lastUpdate = useSelector((state: RootState) => state.realtime.lastUpdate);

  return (
    <Tooltip title={`Letztes Update: ${lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Nie'}`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={isConnected ? <Wifi /> : <WifiOff />}
          label={isConnected ? 'Live' : 'Offline'}
          color={isConnected ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      </Box>
    </Tooltip>
  );
}; 