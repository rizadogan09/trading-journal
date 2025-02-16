import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearNotification } from '../store/notificationSlice';

export const Notifications = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.notifications.current);

  const handleClose = () => {
    dispatch(clearNotification());
  };

  if (!notification) return null;  // Early return wenn keine Notification

  return (
    <Box>
      <Snackbar
        open={true}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.type}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 