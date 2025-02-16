import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Box, Typography, Chip } from '@mui/material';

const OpenPositions = () => {
  const trades = useSelector((state: RootState) => state.journal.trades);
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);

  const openTrades = trades.filter(t => t.status === 'OPEN');

  const getInstrumentName = (id: string) => {
    return instruments.find(i => i.id === id)?.name || id;
  };

  return (
    <Box>
      {openTrades.length === 0 ? (
        <Typography color="text.secondary">Keine offenen Positionen</Typography>
      ) : (
        openTrades.map(trade => (
          <Box key={trade.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">
                {getInstrumentName(trade.instrumentId)}
              </Typography>
              <Chip 
                label={trade.direction}
                color={trade.direction === 'LONG' ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Entry: {trade.entryPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stop: {trade.stopLoss}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: {trade.targetPrice}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default OpenPositions; 