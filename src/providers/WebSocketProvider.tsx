import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { wsService } from '../services/websocketService';
import { positionUpdateService } from '../services/positionUpdateService';
import { updatePrice, setConnectionStatus } from '../store/realtimeSlice';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // WebSocket Verbindung aufbauen
    wsService.connect();

    // Position Updates initialisieren
    positionUpdateService.initialize();

    // Price Updates subscriben
    wsService.subscribe('prices', (data) => {
      dispatch(updatePrice({
        instrumentId: data.instrumentId,
        price: data.price,
        timestamp: Date.now()
      }));
    });

    // Connection Status subscriben
    wsService.subscribe('connection', (isConnected) => {
      dispatch(setConnectionStatus(isConnected));
    });

    return () => {
      wsService.disconnect();
    };
  }, [dispatch]);

  return <>{children}</>;
}; 