import { configureStore } from '@reduxjs/toolkit';
import marketAnalysisReducer from './marketAnalysisSlice';
import riskManagerReducer from './riskManagerSlice';
import journalReducer from './journalSlice';
import psychologyReducer from './psychologySlice';
import realtimeReducer from './realtimeSlice';
import notificationReducer from './notificationSlice';
import backtestingReducer from './backtestingSlice';

const store = configureStore({
  reducer: {
    marketAnalysis: marketAnalysisReducer,
    riskManager: riskManagerReducer,
    journal: journalReducer,
    psychology: psychologyReducer,
    realtime: realtimeReducer,
    notifications: notificationReducer,
    backtesting: backtestingReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store }; 