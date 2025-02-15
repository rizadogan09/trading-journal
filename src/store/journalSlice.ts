import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import instrumentsData from '../data/instruments.json';

export interface Trade {
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
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  emotions: string[];
  notes: string;
  tags: string[];
  pnl?: number;
  strategy?: string;
  tradeNumber: number;
  exitPrice?: number;
  exitTime?: string;
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
        const trade = state.trades[index];
        
        if (action.payload.status === 'CLOSED') {
          const exitPrice = action.payload.exitPrice || trade.exitPrice;
          const entryPrice = trade.entryPrice;
          
          if (exitPrice && entryPrice) {
            const instrument = instrumentsData.instruments.find(i => i.id === trade.instrumentId);
            if (!instrument) return;

            // Berechnung der Ticks
            const tickDiff = Math.abs(exitPrice - entryPrice) / instrument.tickSize;
            
            // P/L pro Tick
            const valuePerTick = instrument.tickValue;
            
            // Gesamter P/L
            const pnl = trade.direction === 'LONG'
              ? (exitPrice - entryPrice) / instrument.tickSize * valuePerTick * trade.size
              : (entryPrice - exitPrice) / instrument.tickSize * valuePerTick * trade.size;

            state.trades[index] = {
              ...trade,
              ...action.payload,
              pnl: Number(pnl.toFixed(2)),
              exitPrice,
              exitTime: action.payload.exitTime || new Date().toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              })
            };
          }
        } else {
          state.trades[index] = { ...trade, ...action.payload };
        }
      }
    },
    deleteTrade(state, action: PayloadAction<string>) {
      state.trades = state.trades.filter(t => t.id !== action.payload);
    },
    updatePosition(state, action: PayloadAction<any>) {
      const { id, pnl, status, exitPrice } = action.payload;
      const index = state.trades.findIndex(t => t.id === id);
      if (index !== -1) {
        state.trades[index] = {
          ...state.trades[index],
          pnl,
          status,
          exitPrice
        };
      }
    }
  }
});

export const { addTrade, updateTrade, deleteTrade, updatePosition } = journalSlice.actions;
export default journalSlice.reducer; 