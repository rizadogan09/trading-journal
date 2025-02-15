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
  checkedRules: string[];
  bestTradingTime: string;
  emotionalBalance: number;
  history: Array<{
    timestamp: string;
    emotions: string[];
    stressLevels: {
      drawdown: number;
      fomo: number;
      overtrading: number;
      revenge: number;
    };
    checkedRules: string[];
  }>;
}

const initialState: PsychologyState = {
  emotions: [],
  thoughts: '',
  stressLevels: {
    drawdown: 0,
    fomo: 0,
    overtrading: 0,
    revenge: 0
  },
  checkedRules: [],
  bestTradingTime: '',
  emotionalBalance: 0,
  history: []
};

const psychologySlice = createSlice({
  name: 'psychology',
  initialState,
  reducers: {
    updatePsychologyState(state, action: PayloadAction<any>) {
      state.emotions = action.payload.emotions;
      state.thoughts = action.payload.thoughts;
      state.stressLevels = action.payload.stressLevels;
      state.checkedRules = action.payload.checkedRules;
      state.history.push({
        timestamp: action.payload.timestamp,
        emotions: action.payload.emotions,
        stressLevels: action.payload.stressLevels,
        checkedRules: action.payload.checkedRules
      });
    }
  }
});

export const { updatePsychologyState } = psychologySlice.actions;
export default psychologySlice.reducer; 