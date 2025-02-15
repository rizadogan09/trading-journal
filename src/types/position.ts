export interface Position {
  id: string;
  instrumentId: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  date: string;
  strategy?: string;
  tags?: string[];
} 