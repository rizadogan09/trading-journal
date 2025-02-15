import { showNotification } from '../store/notificationSlice';
import { store } from '../store';
import { mockServer } from './mockWebSocketServer';

type WebSocketCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: Map<string, WebSocketCallback[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;

  constructor(private url: string) {}

  connect() {
    try {
      if (import.meta.env.DEV) {
        // Im Development-Modus Mock-Server verwenden
        this.socket = new WebSocket('ws://localhost:8080');
        mockServer.addClient(this.socket as WebSocket);
      } else {
        // Im Production-Modus echte WebSocket-URL verwenden
        this.socket = new WebSocket(this.url);
      }
      
      this.socket.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.socket.onclose = () => {
        console.log('WebSocket Disconnected');
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    } catch (error) {
      console.error('WebSocket Connection Error:', error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectTimeout);
    }
  }

  subscribe(channel: string, callback: WebSocketCallback) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, []);
    }
    this.subscribers.get(channel)?.push(callback);

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ 
        action: 'subscribe', 
        channel 
      }));
    }
  }

  unsubscribe(channel: string, callback: WebSocketCallback) {
    const callbacks = this.subscribers.get(channel);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private handleMessage(data: any) {
    const { channel, payload } = data;
    
    // Benachrichtigungen für neue Trades
    if (channel === 'trades' && payload.type === 'new') {
      store.dispatch(showNotification({
        type: 'info',
        message: `Neuer Trade: ${payload.instrumentId} ${payload.direction} @ ${payload.price}`
      }));
    }

    // Benachrichtigungen für geschlossene Trades
    if (channel === 'trades' && payload.type === 'closed') {
      const pnl = payload.pnl;
      store.dispatch(showNotification({
        type: pnl >= 0 ? 'success' : 'warning',
        message: `Trade geschlossen: ${payload.instrumentId} mit ${pnl.toFixed(2)}€ ${pnl >= 0 ? 'Gewinn' : 'Verlust'}`
      }));
    }

    // Bestehende Message-Handling-Logik
    const callbacks = this.subscribers.get(channel);
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService(import.meta.env.VITE_WS_URL); 