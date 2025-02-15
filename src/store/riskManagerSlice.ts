import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface RiskManagerState {
  accounts: Account[];
  selectedAccountId: string | null;
  accountBalance: number;
  riskAmount: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  instrument: string;
  position: 'LONG' | 'SHORT';
}

const initialState: RiskManagerState = {
  accounts: [
    { id: '1', name: 'Live Account', balance: 10000, currency: 'EUR' },
    { id: '2', name: 'Demo Account', balance: 50000, currency: 'EUR' }
  ],
  selectedAccountId: null,
  accountBalance: 0,
  riskAmount: 0,
  entryPrice: 0,
  stopLoss: 0,
  takeProfit: 0,
  instrument: '',
  position: 'LONG',
};

const riskManagerSlice = createSlice({
  name: 'riskManager',
  initialState,
  reducers: {
    setSelectedAccount(state, action: PayloadAction<string>) {
      state.selectedAccountId = action.payload;
    },
    updateAccountBalance(state, action: PayloadAction<{ id: string; balance: number }>) {
      const account = state.accounts.find(a => a.id === action.payload.id);
      if (account) {
        account.balance = action.payload.balance;
      }
    },
    updateCalculation(state, action: PayloadAction<Partial<RiskManagerState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setSelectedAccount, updateAccountBalance, updateCalculation } = riskManagerSlice.actions;
export default riskManagerSlice.reducer; 