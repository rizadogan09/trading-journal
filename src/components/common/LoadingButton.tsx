import React from 'react';
import { Button, CircularProgress } from '@mui/material';

interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ 
  loading = false, 
  children, 
  ...props 
}) => {
  return (
    <Button
      disabled={loading}
      sx={{
        position: 'relative',
        '& .MuiCircularProgress-root': {
          position: 'absolute',
          left: '50%',
          marginLeft: '-12px'
        }
      }}
      {...props}
    >
      {loading && <CircularProgress size={24} />}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </Button>
  );
}; 