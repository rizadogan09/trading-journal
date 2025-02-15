export type TimeLevel = '240' | '60' | '15';
export type TrendDirection = '↑' | '↗' | '→' | '↘' | '↓';

export interface TimeLevelWeight {
  '240': number; // 4H = 0.2
  '60': number;  // 1H = 0.7
  '15': number;  // 15min = 0.1
}

export interface DirectionValue {
  '↑': number;   // +1
  '↗': number;   // +0.5
  '→': number;   // 0
  '↘': number;   // -0.5
  '↓': number;   // -1
}

export interface Strategy {
  id: string;
  name: string;
  minAdvantage: number;
  maxAdvantage: number;
  description: string;
}

export interface MarketAnalysis {
  id: string;
  date: Date;
  instrumentId: string;
  timeLevels: {
    [key in TimeLevel]: TrendDirection;
  };
  advantage: number;
  selectedStrategy?: string;
} 