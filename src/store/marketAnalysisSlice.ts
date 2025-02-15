import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import instrumentsData from '../data/instruments.json';
import type { Position } from '../types/position';

interface Strategy {
  id: string;
  name: string;
  variant?: string;
  longMin?: number;
  longMax?: number;
  shortMin?: number;
  shortMax?: number;
  description: string;
  minAdvantage?: number;
  maxAdvantage?: number;
}

interface Instrument {
  id: string;
  name: string;
  type: 'FUTURE' | 'STOCK';
  tickSize: number;
  tickValue: number;
  currency: string;
  exchange?: string;
}

interface Analysis {
  id: string;
  date: Date;
  instrumentId: string;
  timeLevels: Record<string, string>;
  advantage: number;
}

interface MarketAnalysisState {
  analyses: Analysis[];
  strategies: Strategy[];
  instruments: Instrument[];
  selectedInstrument: string | null;
  positions: Position[];
}

// Stelle sicher, dass die Daten im JSON-File den korrekten type haben
const instrumentsWithCorrectTypes = instrumentsData.instruments.map(inst => ({
  ...inst,
  type: inst.type as 'FUTURE' | 'STOCK'
}));

const initialState: MarketAnalysisState = {
  analyses: [],
  strategies: [
    {
      id: 'flow-short',
      name: 'Flow Trading Short',
      minAdvantage: -100,
      maxAdvantage: -33,
      description: 'Trendfolgestrategie für starke Abwärtsbewegungen'
    },
    {
      id: 'flow-long',
      name: 'Flow Trading Long',
      minAdvantage: 33,
      maxAdvantage: 100,
      description: 'Trendfolgestrategie für starke Aufwärtsbewegungen'
    },
    {
      id: 'range',
      name: 'Range Trading',
      minAdvantage: -32,
      maxAdvantage: 32,
      description: 'Seitwärtsstrategie für neutrale Marktphasen'
    }
  ],
  instruments: instrumentsWithCorrectTypes,
  selectedInstrument: null,
  positions: []
};

const marketAnalysisSlice = createSlice({
  name: 'marketAnalysis',
  initialState,
  reducers: {
    addAnalysis(state, action: PayloadAction<Analysis>) {
      state.analyses.push(action.payload);
    },
    updateAnalysis(state, action: PayloadAction<Analysis>) {
      const index = state.analyses.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.analyses[index] = action.payload;
      }
    },
    deleteAnalysis(state, action: PayloadAction<string>) {
      state.analyses = state.analyses.filter(a => a.id !== action.payload);
    },
    addInstrument(state, action: PayloadAction<Instrument>) {
      state.instruments.push(action.payload);
    },
    updateInstrument(state, action: PayloadAction<Instrument>) {
      const index = state.instruments.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.instruments[index] = action.payload;
      }
    },
    deleteInstrument(state, action: PayloadAction<string>) {
      state.instruments = state.instruments.filter(i => i.id !== action.payload);
    },
    setSelectedInstrument(state, action: PayloadAction<string>) {
      state.selectedInstrument = action.payload;
    },
    addStrategy(state, action: PayloadAction<Strategy>) {
      state.strategies.push(action.payload);
    },
    updateStrategy(state, action: PayloadAction<Strategy>) {
      const index = state.strategies.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.strategies[index] = action.payload;
      }
    },
    deleteStrategy(state, action: PayloadAction<string>) {
      state.strategies = state.strategies.filter(s => s.id !== action.payload);
    },
    updatePosition(state, action: PayloadAction<Position>) {
      const index = state.positions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.positions[index] = action.payload;
      }
    },
    addPosition(state, action: PayloadAction<Position>) {
      state.positions.push(action.payload);
    },
    removePosition(state, action: PayloadAction<string>) {
      state.positions = state.positions.filter(p => p.id !== action.payload);
    }
  }
});

export const { 
  addAnalysis, 
  updateAnalysis, 
  deleteAnalysis,
  addInstrument,
  updateInstrument,
  deleteInstrument,
  setSelectedInstrument,
  addStrategy,
  updateStrategy,
  deleteStrategy,
  updatePosition,
  addPosition,
  removePosition
} = marketAnalysisSlice.actions;

export default marketAnalysisSlice.reducer; 