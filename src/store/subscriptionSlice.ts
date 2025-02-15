import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSubscription, SubscriptionTier } from '../types/subscription';

interface SubscriptionState {
  currentSubscription: UserSubscription | null;
  features: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  currentSubscription: null,
  features: [],
  loading: false,
  error: null
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription(state, action: PayloadAction<UserSubscription>) {
      state.currentSubscription = action.payload;
    },
    setFeatures(state, action: PayloadAction<string[]>) {
      state.features = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

export const {
  setSubscription,
  setFeatures,
  setLoading,
  setError
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 