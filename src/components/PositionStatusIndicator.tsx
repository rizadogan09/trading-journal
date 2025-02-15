import React from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PositionStatusIndicatorProps {
  positionId: string;
}

export const PositionStatusIndicator: React.FC<PositionStatusIndicatorProps> = ({ positionId }) => {
  const position = useSelector((state: RootState) => 
    state.marketAnalysis.positions.find(p => p.id === positionId)
  );
  const lastUpdate = useSelector((state: RootState) => state.realtime.lastUpdate);

  if (!position) return null;

  const isUpdating = Date.now() - (lastUpdate || 0) < 5000;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {isUpdating && (
        <CircularProgress size={16} />
      )}
      <Chip
        label={`${position.pnl > 0 ? '+' : ''}${position.pnl.toFixed(2)}€`}
        color={position.pnl >= 0 ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    </Box>
  );
}; 