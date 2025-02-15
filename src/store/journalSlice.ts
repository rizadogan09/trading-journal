import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Trade {
  id: string;
  tradeNumber: number;
  date: Date;
  instrumentId: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  exitPrice?: number;
  size: number;
  riskAmount: number;
  potentialProfit: number;
  rrr: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  pnl?: number;
  emotions?: string[];
  notes?: string;
  tags: string[];
}

interface JournalState {
  trades: Trade[];
  lastTradeNumber: number;
  tags: string[];
}

const initialState: JournalState = {
  trades: [],
  lastTradeNumber: 0,
  tags: [
    'FOMO', 
    'Überhandelt', 
    'Stop zu eng', 
    'Stop zu weit',
    'Zu früh raus',
    'Zu spät raus',
    'Position zu groß',
    'Position zu klein',
    'Ohne Setup',
    'Gegen Trend'
  ]
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addTrade(state, action: PayloadAction<Omit<Trade, 'tradeNumber'>>) {
      state.lastTradeNumber += 1;
      state.trades.push({
        ...action.payload,
        tradeNumber: state.lastTradeNumber,
        tags: []
      });
    },
    updateTrade(state, action: PayloadAction<Partial<Trade> & { id: string }>) {
      const index = state.trades.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.trades[index] = { ...state.trades[index], ...action.payload };
      }
    },
    deleteTrade(state, action: PayloadAction<string>) {
      state.trades = state.trades.filter(t => t.id !== action.payload);
    }
  }
});

export const { addTrade, updateTrade, deleteTrade } = journalSlice.actions;
export default journalSlice.reducer; 