export interface Instrument {
  id: string;
  name: string;
  type: 'FUTURE' | 'STOCK';
  exchange: string;
  tickSize: number;
  tickValue: number;
  currency: string;
  multiplier?: number;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  riskPerTrade: number; // in Prozent
  maxDrawdown: number; // in Prozent
}

export interface Trade {
  id: string;
  instrumentId: string;
  entryPrice: number;
  exitPrice?: number;
  position: 'LONG' | 'SHORT';
  size: number;
  stopLoss: number;
  takeProfit: number;
  entryDate: Date;
  exitDate?: Date;
  status: 'OPEN' | 'CLOSED';
  pnl?: number;
  notes?: string;
} 