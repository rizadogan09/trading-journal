import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Chip,
  Typography,
  Box
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { LivePriceIndicator } from '../../../components/LivePriceIndicator';
import { PositionStatusIndicator } from '../../../components/PositionStatusIndicator';

interface Position {
  id: string;
  instrumentId: string;
  entryPrice: number;
  currentPrice: number;
  direction: 'LONG' | 'SHORT';
  size: number;
  pnl: number;
  pnlPercent: number;
}

const OpenPositions = () => {
  const positions = useSelector((state: RootState) => state.marketAnalysis.positions);
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Instrument</TableCell>
          <TableCell>Richtung</TableCell>
          <TableCell align="right">Entry</TableCell>
          <TableCell align="right">Aktuell</TableCell>
          <TableCell align="right">P/L</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {positions.map((position) => (
          <TableRow key={position.id}>
            <TableCell>{position.instrumentId}</TableCell>
            <TableCell>
              <Chip 
                label={position.direction}
                color={position.direction === 'LONG' ? 'success' : 'error'}
                size="small"
              />
            </TableCell>
            <TableCell align="right">{position.entryPrice}</TableCell>
            <TableCell align="right">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>{position.currentPrice}</Typography>
                <LivePriceIndicator instrumentId={position.instrumentId} />
                <PositionStatusIndicator positionId={position.id} />
              </Box>
            </TableCell>
            <TableCell align="right">
              <Typography 
                color={position.pnl >= 0 ? 'success.main' : 'error.main'}
              >
                {position.pnl > 0 ? '+' : ''}{position.pnl}$ ({position.pnlPercent}%)
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OpenPositions; 