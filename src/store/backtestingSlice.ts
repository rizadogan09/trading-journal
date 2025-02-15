import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Position } from '../types/position';

interface BacktestState {
  isRunning: boolean;
  currentTest: {
    trades: Position[];
    statistics: {
      totalTrades: number;
      winRate: number;
      profitFactor: number;
      maxDrawdown: number;
      averageRRR: number;
      netProfit: number;
      sharpeRatio: number;
    } | null;
    equity: Array<{
      date: Date;
      value: number;
    }>;
  } | null;
  error: string | null;
}

const initialState: BacktestState = {
  isRunning: false,
  currentTest: null,
  error: null
};

const backtestingSlice = createSlice({
  name: 'backtesting',
  initialState,
  reducers: {
    startBacktest(state) {
      state.isRunning = true;
      state.error = null;
    },
    backtestSuccess(state, action: PayloadAction<BacktestState['currentTest']>) {
      state.isRunning = false;
      state.currentTest = action.payload;
    },
    backtestError(state, action: PayloadAction<string>) {
      state.isRunning = false;
      state.error = action.payload;
    },
    clearBacktest(state) {
      state.currentTest = null;
      state.error = null;
    }
  }
});

export const {
  startBacktest,
  backtestSuccess,
  backtestError,
  clearBacktest
} = backtestingSlice.actions;

export default backtestingSlice.reducer; 