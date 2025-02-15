import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { RootState } from '../../store';
import BacktestSettings from './components/BacktestSettings';
import BacktestResults from './components/BacktestResults';
import { backtestingService } from '../../services/backtestingService';
import { startBacktest, backtestSuccess, backtestError } from '../../store/backtestingSlice';

const Backtesting = () => {
  const dispatch = useDispatch();
  const { isRunning, currentTest, error } = useSelector(
    (state: RootState) => state.backtesting
  );

  const handleRunBacktest = async (settings: any) => {
    try {
      dispatch(startBacktest());
      const result = await backtestingService.runBacktest(settings);
      dispatch(backtestSuccess(result));
    } catch (err) {
      dispatch(backtestError(err instanceof Error ? err.message : 'Backtest failed'));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Strategie Backtesting
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BacktestSettings onRunBacktest={handleRunBacktest} disabled={isRunning} />
        </Grid>

        <Grid item xs={12} md={8}>
          {isRunning ? (
            <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>
                Backtesting läuft...
              </Typography>
            </Paper>
          ) : currentTest ? (
            <BacktestResults results={currentTest} />
          ) : error ? (
            <Paper sx={{ p: 3, bgcolor: 'error.light' }}>
              <Typography color="error">
                Fehler: {error}
              </Typography>
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Backtesting; 