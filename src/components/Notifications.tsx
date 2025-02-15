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

  return (
    <Box>
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {notification && (
          <Alert
            onClose={handleClose}
            severity={notification.type}
            variant="filled"
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}; 