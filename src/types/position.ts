import { Trade } from './trade';

export interface Position extends Trade {
  currentPrice?: number;
  pnlPercent?: number;
} 