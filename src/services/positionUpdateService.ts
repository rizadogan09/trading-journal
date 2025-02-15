import { store } from '../store';
import { wsService } from './websocketService';
import { updatePosition } from '../store/marketAnalysisSlice';
import { Position } from '../types/position';

class PositionUpdateService {
  initialize() {
    // Subscribe für Position Updates
    wsService.subscribe('position-updates', (data) => {
      this.handlePositionUpdate(data);
    });

    // Subscribe für P&L Updates
    wsService.subscribe('pnl-updates', (data) => {
      this.handlePnLUpdate(data);
    });
  }

  private handlePositionUpdate(data: any) {
    const position: Position = {
      ...data,
      pnl: this.calculatePnL(data),
      pnlPercent: this.calculatePnLPercent(data)
    };

    store.dispatch(updatePosition(position));
  }

  private handlePnLUpdate(data: { instrumentId: string; currentPrice: number }) {
    const state = store.getState();
    const position = state.marketAnalysis.positions.find(
      p => p.instrumentId === data.instrumentId
    );

    if (position) {
      const updatedPosition = {
        ...position,
        currentPrice: data.currentPrice,
        pnl: this.calculatePnL({ ...position, currentPrice: data.currentPrice }),
        pnlPercent: this.calculatePnLPercent({ ...position, currentPrice: data.currentPrice })
      };

      store.dispatch(updatePosition(updatedPosition));
    }
  }

  private calculatePnL(position: { 
    direction: string; 
    entryPrice: number; 
    currentPrice: number;
    size: number;
  }) {
    const priceDiff = position.currentPrice - position.entryPrice;
    return position.direction === 'LONG' 
      ? priceDiff * position.size
      : -priceDiff * position.size;
  }

  private calculatePnLPercent(position: {
    direction: string;
    entryPrice: number;
    currentPrice: number;
  }) {
    const priceDiff = position.currentPrice - position.entryPrice;
    return position.direction === 'LONG'
      ? (priceDiff / position.entryPrice) * 100
      : (-priceDiff / position.entryPrice) * 100;
  }
}

export const positionUpdateService = new PositionUpdateService(); 