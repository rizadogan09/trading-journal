import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PriceUpdate {
  instrumentId: string;
  price: number;
  timestamp: number;
}

interface RealtimeState {
  prices: Record<string, PriceUpdate>;
  isConnected: boolean;
  lastUpdate: number | null;
}

const initialState: RealtimeState = {
  prices: {},
  isConnected: false,
  lastUpdate: null
};

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    updatePrice(state, action: PayloadAction<PriceUpdate>) {
      const { instrumentId, price, timestamp } = action.payload;
      state.prices[instrumentId] = { instrumentId, price, timestamp };
      state.lastUpdate = timestamp;
    },
    setConnectionStatus(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    clearPrices(state) {
      state.prices = {};
    }
  }
});

export const { updatePrice, setConnectionStatus, clearPrices } = realtimeSlice.actions;
export default realtimeSlice.reducer; 