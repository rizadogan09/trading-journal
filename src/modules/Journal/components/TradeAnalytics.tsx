interface TradeAnalytics {
  entryPrice: number;
  exitPrice: number;
  volume: number;
  strategy: string;
  setupQuality: 1 | 2 | 3 | 4 | 5;
  emotions: string;
  marketConditions: string;
  screenshots: string[];
  lessons: string;
} 