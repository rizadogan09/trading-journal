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
  entryTime: string;
}

interface JournalState {
  trades: Trade[];
  lastTradeNumber: number;
  tags: string[];
}

// Lade initiale Daten aus localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('journalState');
    if (serializedState === null) {
      return {
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
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

const initialState = loadState();

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
      // Speichere nach jedem Trade
      saveState(state);
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

            const tickDiff = Math.abs(exitPrice - entryPrice) / instrument.tickSize;
            const valuePerTick = instrument.tickValue;
            
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
        // Speichere nach jedem Update
        saveState(state);
      }
    },
    deleteTrade(state, action: PayloadAction<string>) {
      state.trades = state.trades.filter(t => t.id !== action.payload);
      // Speichere nach jedem Löschen
      saveState(state);
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
        // Speichere nach jedem Position Update
        saveState(state);
      }
    }
  }
});

// Helper Funktion zum Speichern des States
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('journalState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

export const { addTrade, updateTrade, deleteTrade, updatePosition } = journalSlice.actions;
export default journalSlice.reducer; 