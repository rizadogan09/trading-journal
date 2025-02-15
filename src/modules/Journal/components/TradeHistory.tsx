import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Edit as EditIcon, Sync as SyncIcon } from '@mui/icons-material';
import { Position } from '../../../types/position';

interface TradeHistoryProps {
  onEditTrade: (trade: Position) => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ onEditTrade }) => {
  const trades = useSelector((state: RootState) => state.marketAnalysis.positions);
  const isConnected = useSelector((state: RootState) => state.realtime.isConnected);
  const lastUpdate = useSelector((state: RootState) => state.realtime.lastUpdate);

  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  const isUpdating = Date.now() - (lastUpdate || 0) < 5000;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Geschlossene Trades
        </Typography>
        {isConnected && (
          <Tooltip title={`Letztes Update: ${new Date(lastUpdate || 0).toLocaleTimeString()}`}>
            <Chip
              icon={<SyncIcon className={isUpdating ? 'rotating' : ''} />}
              label="Live Updates"
              color="success"
              variant="outlined"
              size="small"
            />
          </Tooltip>
        )}
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Datum</TableCell>
              <TableCell>Instrument</TableCell>
              <TableCell>Richtung</TableCell>
              <TableCell align="right">Entry</TableCell>
              <TableCell align="right">Exit</TableCell>
              <TableCell align="right">RRR</TableCell>
              <TableCell align="right">P/L</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {closedTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                <TableCell>{trade.instrumentId}</TableCell>
                <TableCell>
                  <Chip
                    label={trade.direction}
                    color={trade.direction === 'LONG' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{trade.entryPrice}</TableCell>
                <TableCell align="right">{trade.currentPrice}</TableCell>
                <TableCell align="right">1:{(Math.abs(trade.pnl) / trade.size).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Typography
                    color={trade.pnl >= 0 ? 'success.main' : 'error.main'}
                  >
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}€
                  </Typography>
                </TableCell>
                <TableCell>
                  {trade.tags?.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onEditTrade(trade)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}; 