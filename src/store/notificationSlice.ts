import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface NotificationState {
  current: Notification | null;
}

const initialState: NotificationState = {
  current: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<Notification>) {
      state.current = action.payload;
    },
    clearNotification(state) {
      state.current = null;
    }
  }
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 