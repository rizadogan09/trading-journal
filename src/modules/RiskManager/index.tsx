import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { RootState } from '../../store';
import { setSelectedAccount } from '../../store/riskManagerSlice';
import PsychologyMonitor from './components/PsychologyMonitor';
import { addTrade } from '../../store/journalSlice';
import type { Trade } from '../../store/journalSlice';

interface PositionSize {
  size: number;
  riskPerPoint: number;
  totalRisk: number;
  riskPercent: number;
  potentialProfit: number;
  rrr: number;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

const RiskManager: React.FC = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.riskManager.accounts);
  const selectedAccountId = useSelector((state: RootState) => state.riskManager.selectedAccountId);
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);
  
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [positionSize, setPositionSize] = useState<PositionSize | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [tradingThoughts, setTradingThoughts] = useState('');

  // Automatische Richtungserkennung
  const direction = entryPrice > stopLoss ? 'LONG' : entryPrice < stopLoss ? 'SHORT' : null;

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const calculatePosition = () => {
    if (!selectedAccount || !direction || !selectedInstrument) return;

    const instrument = instruments.find(i => i.id === selectedInstrument);
    if (!instrument) return;

    // Risikobetrag in EUR
    const riskAmount = (selectedAccount.balance * riskPercent) / 100;
    
    // Punkte zwischen Entry und Stop
    const pointDistance = Math.abs(entryPrice - stopLoss);
    
    // Ticks Risiko
    const ticksAtRisk = pointDistance / instrument.tickSize;
    
    // Risiko pro Kontrakt
    const riskPerContract = ticksAtRisk * instrument.tickValue;
    
    // Maximale Kontraktgröße basierend auf Risiko
    const maxContracts = Math.floor(riskAmount / riskPerContract);

    // Ziel-Berechnung
    const targetDistance = Math.abs(entryPrice - targetPrice);
    const ticksToTarget = targetDistance / instrument.tickSize;
    const profitPerContract = ticksToTarget * instrument.tickValue;
    const potentialProfit = maxContracts * profitPerContract;

    // RRR Berechnung
    const rrr = profitPerContract / riskPerContract;

    setPositionSize({
      size: maxContracts,
      riskPerPoint: riskPerContract / pointDistance,
      totalRisk: maxContracts * riskPerContract,
      riskPercent,
      potentialProfit,
      rrr
    });
  };

  const handleCreateTrade = () => {
    if (!selectedAccount || !direction || !selectedInstrument || !positionSize) return;

    const instrument = instruments.find(i => i.id === selectedInstrument);
    if (!instrument) return;

    const trade = {
      id: Date.now().toString(),
      date: new Date(),
      entryTime: new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      instrumentId: selectedInstrument,
      direction: direction as 'LONG' | 'SHORT',
      entryPrice,
      stopLoss,
      targetPrice,
      size: positionSize.size,
      riskAmount: positionSize.totalRisk,
      potentialProfit: positionSize.potentialProfit,
      rrr: positionSize.rrr,
      status: 'OPEN' as const,
      emotions: selectedEmotions,
      notes: tradingThoughts,
      tags: []
    };

    dispatch(addTrade(trade));

    // Optional: Reset form
    setSelectedInstrument('');
    setEntryPrice(0);
    setStopLoss(0);
    setTargetPrice(0);
    setPositionSize(null);
    setSelectedEmotions([]);
    setTradingThoughts('');
  };

  const instrument = instruments.find(i => i.id === selectedInstrument);
  const tickSize = instrument?.tickSize ?? 1;
  const currency = instrument?.currency ?? 'EUR';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Risikomanager
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Position Sizing</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Account</InputLabel>
                  <Select
                    value={selectedAccountId || ''}
                    onChange={(e) => dispatch(setSelectedAccount(e.target.value))}
                  >
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name} ({account.balance} {account.currency})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Instrument</InputLabel>
                  <Select
                    value={selectedInstrument}
                    onChange={(e) => setSelectedInstrument(e.target.value)}
                  >
                    {instruments.map((instrument) => (
                      <MenuItem key={instrument.id} value={instrument.id}>
                        {instrument.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Risk %"
                  type="number"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Entry Price"
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stop Loss"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Price"
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                />
              </Grid>
              {direction && (
                <Grid item xs={12}>
                  <Alert 
                    severity={direction === 'LONG' ? 'success' : 'error'}
                    sx={{ mb: 2 }}
                  >
                    {direction === 'LONG' ? 'Long Position' : 'Short Position'}
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={calculatePosition}
                  disabled={!selectedAccount || !selectedInstrument || !direction}
                >
                  Berechnen
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Risiko Kalkulator</Typography>
            {positionSize && selectedInstrument && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Positionsgröße: {positionSize.size} Kontrakte
                </Typography>
                <Typography variant="body2">
                  Punkte Risiko: {Math.abs(entryPrice - stopLoss).toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Ticks at Risk: {Math.abs(entryPrice - stopLoss) / tickSize}
                </Typography>
                <Typography variant="body2">
                  Risiko pro Kontrakt: {(positionSize.totalRisk / positionSize.size).toFixed(2)} {currency}
                </Typography>
                <Typography variant="body2">
                  Gesamtrisiko: {positionSize.totalRisk.toFixed(2)} {currency} ({positionSize.riskPercent}%)
                </Typography>
                <Typography variant="body2">
                  Potenzieller Gewinn: {positionSize.potentialProfit.toFixed(2)} {currency}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: positionSize.rrr >= 2 ? 'success.main' : 'warning.main',
                  fontWeight: 'bold'
                }}>
                  Risk-Reward-Ratio: 1:{positionSize.rrr.toFixed(2)}
                </Typography>
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTrade}
          disabled={!positionSize || !selectedInstrument || !direction}
        >
          Trade erstellen
        </Button>
      </Box>

      {/* Psychologie-Monitor */}
      <PsychologyMonitor />
    </Box>
  );
};

export default RiskManager; 