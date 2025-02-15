import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface Stats {
  winRate: number;
  profitFactor: number;
  averageRRR: number;
  currentDrawdown: number;
  maxDrawdown: number;
}

const calculateStats = (analyses: any[]): Stats => {
  if (analyses.length === 0) {
    return {
      winRate: 0,
      profitFactor: 0,
      averageRRR: 0,
      currentDrawdown: 0,
      maxDrawdown: 0
    };
  }

  // Win Rate Berechnung
  const winningTrades = analyses.filter(a => a.advantage > 0).length;
  const winRate = (winningTrades / analyses.length) * 100;

  // Profit Faktor Berechnung
  const profits = analyses
    .filter(a => a.advantage > 0)
    .reduce((sum, a) => sum + a.advantage, 0);
  
  const losses = Math.abs(analyses
    .filter(a => a.advantage < 0)
    .reduce((sum, a) => sum + a.advantage, 0));

  const profitFactor = losses === 0 ? profits : profits / losses;

  // Durchschnittliches RRR
  const totalRRR = analyses
    .filter(a => a.advantage !== 0)
    .reduce((sum, a) => sum + Math.abs(a.advantage), 0) / analyses.length;

  // Drawdown Berechnung
  let peak = 0;
  let currentDrawdown = 0;
  let maxDrawdown = 0;

  analyses.forEach(analysis => {
    if (analysis.advantage > peak) {
      peak = analysis.advantage;
    }
    
    const drawdown = peak - analysis.advantage;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
    
    if (drawdown > currentDrawdown) {
      currentDrawdown = drawdown;
    }
  });

  return {
    winRate: Number(winRate.toFixed(1)),
    profitFactor: Number(profitFactor.toFixed(2)),
    averageRRR: Number(totalRRR.toFixed(1)),
    currentDrawdown: Number(currentDrawdown.toFixed(1)),
    maxDrawdown: Number(maxDrawdown.toFixed(1))
  };
};

const PerformanceStats = () => {
  const analyses = useSelector((state: RootState) => state.marketAnalysis.analyses);
  const stats = calculateStats(analyses);

  return {
    winRate: `${stats.winRate}%`,
    profitFactor: stats.profitFactor.toFixed(2),
    averageRRR: `1:${stats.averageRRR}`,
    drawdown: {
      current: stats.currentDrawdown,
      max: stats.maxDrawdown
    }
  };
};

export default PerformanceStats; 