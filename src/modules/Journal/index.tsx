import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  TablePagination,
  IconButton,
  Grid,
  Divider,
  Stack
} from '@mui/material';
import { RootState } from '../../store';
import { Trade as JournalTrade } from '../../store/journalSlice';
import { updateTrade } from '../../store/journalSlice';
import TradeDialog from './components/TradeDialog';
import { Edit as EditIcon } from '@mui/icons-material';
import StatisticsFilter from './components/StatisticsFilter';
import TimeBasedAnalysis from './components/TimeBasedAnalysis';
import TradeDetails from './components/TradeDetails';
import ExportTools from './components/ExportTools';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import { exportToExcel, exportToPdf } from '../../utils/exportHelpers';
import { TradeHistory } from './components/TradeHistory';
import { LivePerformanceStats } from './components/LivePerformanceStats';
import TradingTimeAnalysis from './components/TradingTimeAnalysis';
import { Position } from '../../types/position';

// Status-Type erweitern
type TradeStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

interface Trade {
  id: string;
  date: Date;
  instrumentId: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  size: number;
  riskAmount: number;
  potentialProfit: number;
  rrr: number;
  status: TradeStatus;
  emotions: string[];
  notes: string;
  tags: string[];
  pnl?: number;
  strategy?: string;
  tradeNumber: number;
  exitPrice?: number;
  entryTime?: string;
  exitTime?: string;
}

const Journal = () => {
  const trades = useSelector((state: RootState) => state.journal.trades);
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);
  const strategies = useSelector((state: RootState) => state.marketAnalysis.strategies);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [filters, setFilters] = useState({
    dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    dateTo: new Date(),
    instrument: '',
    strategy: '',
    setupQuality: ''
  });

  const analyses = useSelector((state: RootState) => state.marketAnalysis.analyses);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInstrumentName = (instrumentId: string) => {
    return instruments.find(i => i.id === instrumentId)?.name || instrumentId;
  };

  const getStatusColor = (status: Trade['status']) => {
    switch (status) {
      case 'OPEN':
        return 'primary';
      case 'CLOSED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEditClick = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleDialogClose = () => {
    setSelectedTrade(null);
  };

  const handleTradeSave = (updatedTrade: Trade) => {
    dispatch(updateTrade(updatedTrade));
    setSelectedTrade(null);
  };

  const handleExport = async (format: string, options: any) => {
    const dataToExport = {
      trades: filteredTrades,
      statistics: {
        winRate: calculateWinRate(filteredTrades),
        profitFactor: calculateProfitFactor(filteredTrades),
        averageRRR: calculateAverageRRR(filteredTrades)
      },
      dateRange: {
        from: filters.dateFrom,
        to: filters.dateTo
      }
    };

    try {
      if (format === 'excel') {
        await exportToExcel(dataToExport, options);
      } else if (format === 'pdf') {
        await exportToPdf(dataToExport, options);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Hier später einen Toast oder eine Fehlermeldung anzeigen
    }
  };

  const calculateWinRate = (trades: Trade[]) => {
    const winningTrades = trades.filter(t => (t.pnl ?? 0) > 0).length;
    return trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
  };

  const calculateProfitFactor = (trades: Trade[]) => {
    const profits = trades
      .filter(t => (t.pnl ?? 0) > 0)
      .reduce((sum, t) => sum + (t.pnl ?? 0), 0);
    
    const losses = Math.abs(
      trades
        .filter(t => (t.pnl ?? 0) < 0)
        .reduce((sum, t) => sum + (t.pnl ?? 0), 0)
    );
    
    return losses > 0 ? profits / losses : profits > 0 ? Infinity : 0;
  };

  const calculateAverageRRR = (trades: Trade[]) => {
    return trades.length > 0 
      ? trades.reduce((sum, t) => sum + t.rrr, 0) / trades.length 
      : 0;
  };

  const filteredTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return (
      tradeDate >= filters.dateFrom &&
      tradeDate <= filters.dateTo &&
      (filters.instrument ? trade.instrumentId === filters.instrument : true) &&
      (filters.strategy ? trade.strategy === filters.strategy : true)
    );
  });

  const handleEditTrade = (trade: JournalTrade) => {
    setSelectedTrade(trade);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Trading Journal</Typography>
            <ExportTools onExport={handleExport} />
          </Grid>

          <Grid item xs={12}>
            <StatisticsFilter
              onFilterChange={setFilters}
              instruments={instruments}
              strategies={strategies}
            />
          </Grid>

          <Grid item xs={12}>
            <TimeBasedAnalysis
              trades={filteredTrades}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
            />
          </Grid>

          <Grid item xs={12}>
            <LivePerformanceStats />
          </Grid>

          <Grid item xs={12}>
            <TradeHistory onEditTrade={handleEditTrade} />
          </Grid>

          <Grid item xs={12}>
            <TradingTimeAnalysis trades={filteredTrades} />
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trade Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nr.</TableCell>
                      <TableCell>Datum</TableCell>
                      <TableCell>Entry Zeit</TableCell>
                      <TableCell>Exit Zeit</TableCell>
                      <TableCell>Instrument</TableCell>
                      <TableCell>Richtung</TableCell>
                      <TableCell>Größe</TableCell>
                      <TableCell>Entry</TableCell>
                      <TableCell>Stop</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>Exit</TableCell>
                      <TableCell>Risiko</TableCell>
                      <TableCell>RRR</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>P&L</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Aktionen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trades
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell>{trade.tradeNumber}</TableCell>
                          <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                          <TableCell>{trade.entryTime || '-'}</TableCell>
                          <TableCell>{trade.exitTime || '-'}</TableCell>
                          <TableCell>{getInstrumentName(trade.instrumentId)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={trade.direction}
                              color={trade.direction === 'LONG' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{trade.size}</TableCell>
                          <TableCell>{trade.entryPrice}</TableCell>
                          <TableCell>{trade.stopLoss}</TableCell>
                          <TableCell>{trade.targetPrice}</TableCell>
                          <TableCell>{trade.exitPrice || '-'}</TableCell>
                          <TableCell>{trade.riskAmount.toFixed(2)}</TableCell>
                          <TableCell>1:{trade.rrr.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={trade.status}
                              color={getStatusColor(trade.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {trade.pnl !== undefined ? (
                              <Typography
                                color={trade.pnl >= 0 ? 'success.main' : 'error.main'}
                              >
                                {trade.pnl.toFixed(2)}
                              </Typography>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {trade.tags?.map(tag => (
                              <Chip 
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ m: 0.2 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small"
                              onClick={() => handleEditClick(trade)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={trades.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {selectedTrade && (
          <TradeDialog
            open={true}
            trade={selectedTrade}
            onClose={handleDialogClose}
            onSave={handleTradeSave}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Journal; 