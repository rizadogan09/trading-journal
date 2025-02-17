import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PsychologyState {
  emotions: string[];
  thoughts: string;
  stressLevels: {
    drawdown: number;
    fomo: number;
    overtrading: number;
    revenge: number;
  };
  history: Array<{
    timestamp: string;
    emotions: string[];
    stressLevels: {
      drawdown: number;
      fomo: number;
      overtrading: number;
      revenge: number;
    };
    thoughts: string;
  }>;
}

// Lade aus localStorage
const loadState = () => {
  try {
    const savedState = localStorage.getItem('psychologyState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (err) {
    console.error('Error loading psychology state:', err);
  }
  return {
    emotions: [],
    thoughts: '',
    stressLevels: {
      drawdown: 0,
      fomo: 0,
      overtrading: 0,
      revenge: 0
    },
    history: []
  };
};

const initialState: PsychologyState = loadState();

const psychologySlice = createSlice({
  name: 'psychology',
  initialState,
  reducers: {
    updatePsychologyState(state, action: PayloadAction<{
      emotions: string[];
      thoughts: string;
      stressLevels: {
        drawdown: number;
        fomo: number;
        overtrading: number;
        revenge: number;
      };
      timestamp: string;
    }>) {
      state.emotions = action.payload.emotions;
      state.thoughts = action.payload.thoughts;
      state.stressLevels = action.payload.stressLevels;
      state.history.push({
        timestamp: action.payload.timestamp,
        emotions: action.payload.emotions,
        stressLevels: action.payload.stressLevels,
        thoughts: action.payload.thoughts
      });

      // Speichern im localStorage
      try {
        localStorage.setItem('psychologyState', JSON.stringify(state));
      } catch (err) {
        console.error('Error saving psychology state:', err);
      }
    }
  }
});

export const { updatePsychologyState } = psychologySlice.actions;
export default psychologySlice.reducer; 