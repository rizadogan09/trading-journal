export interface Trade {
  id: string;
  date: Date;
  instrumentId: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  size: number;
  riskAmount: number;
  potentialProfit: number;
  rrr: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  emotions: string[];
  notes: string;
  tags: string[];
  pnl?: number;
  strategy?: string;
  tradeNumber: number;
  exitPrice?: number;
  entryTime: string;
  exitTime?: string;
} 