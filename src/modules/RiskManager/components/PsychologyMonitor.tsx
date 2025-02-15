import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  TextField,
  Button,
  Slider,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updatePsychologyState } from '../../../store/psychologySlice';

const emotions = ['Angst', 'Gier', 'Euphorie', 'Unsicherheit', 'Frustration', 'Gelassenheit'];

const tradingRules = [
  { id: 'stopLoss', text: 'Stop-Loss immer setzen' },
  { id: 'positionSize', text: 'Positionsgröße beachten' },
  { id: 'revenge', text: 'Kein Revenge-Trading' },
  { id: 'plan', text: 'Trading-Plan folgen' },
  { id: 'risk', text: 'Risiko-Management beachten' }
];

interface StressLevels {
  drawdown: number;
  fomo: number;
  overtrading: number;
  revenge: number;
}

const PsychologyMonitor = () => {
  const dispatch = useDispatch();
  const psychologyState = useSelector((state: RootState) => state.psychology);
  const trades = useSelector((state: RootState) => state.journal.trades);
  const accounts = useSelector((state: RootState) => state.riskManager.accounts);
  const selectedAccountId = useSelector((state: RootState) => state.riskManager.selectedAccountId);
  
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [tradingThoughts, setTradingThoughts] = useState('');
  const [stressLevels, setStressLevels] = useState<StressLevels>({
    drawdown: 30,
    fomo: 50,
    overtrading: 70,
    revenge: 40
  });
  const [checkedRules, setCheckedRules] = useState<string[]>([]);
  const [warningShown, setWarningShown] = useState(false);

  // Automatische Berechnung der Stress-Level
  const calculateStressLevels = useCallback(() => {
    if (!selectedAccountId || !trades.length) return null;
    
    const account = accounts.find(a => a.id === selectedAccountId);
    if (!account) return null;

    // Letzte 20 Trades für den ausgewählten Account
    const recentTrades = trades
      .filter(t => t.status === 'CLOSED')
      .slice(-20);

    // Drawdown Level berechnen (Verhältnis von Verlusten zum Account-Balance)
    const lossTrades = recentTrades.filter(t => t.pnl && t.pnl < 0);
    const totalLoss = lossTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const drawdownLevel = Math.min(100, Math.abs((totalLoss / account.balance) * 100));

    // Overtrading Level berechnen (Anzahl der Trades pro Tag)
    const tradesPerDay = new Map<string, number>();
    recentTrades.forEach(trade => {
      const date = new Date(trade.date).toDateString();
      tradesPerDay.set(date, (tradesPerDay.get(date) || 0) + 1);
    });
    const avgTradesPerDay = Array.from(tradesPerDay.values()).reduce((a, b) => a + b, 0) / tradesPerDay.size;
    const overtradingLevel = Math.min(100, (avgTradesPerDay / 3) * 100); // 3 Trades pro Tag als Basis

    // Revenge Trading Level berechnen (Schnelle Trades nach Verlusten)
    let revengeTrades = 0;
    recentTrades.forEach((trade, index) => {
      if (index === 0) return;
      const prevTrade = recentTrades[index - 1];
      if (prevTrade.pnl && prevTrade.pnl < 0) {
        const timeDiff = new Date(trade.date).getTime() - new Date(prevTrade.date).getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        if (minutesDiff < 30) { // Weniger als 30 Minuten zwischen Trades
          revengeTrades++;
        }
      }
    });
    const revengeLevel = Math.min(100, (revengeTrades / recentTrades.length) * 100);

    // FOMO Level berechnen (Trades außerhalb der Handelszeiten oder ohne Setup)
    const fomoTrades = recentTrades.filter(trade => {
      const hour = new Date(trade.date).getHours();
      return hour < 9 || hour > 16 || trade.tags?.includes('Ohne Setup');
    });
    const fomoLevel = Math.min(100, (fomoTrades.length / recentTrades.length) * 100);

    return {
      drawdown: Math.round(drawdownLevel),
      overtrading: Math.round(overtradingLevel),
      revenge: Math.round(revengeLevel),
      fomo: Math.round(fomoLevel)
    };
  }, [trades, accounts, selectedAccountId]);

  // Stress-Level automatisch aktualisieren
  useEffect(() => {
    const levels = calculateStressLevels();
    if (levels) {
      setStressLevels(levels);
    }
  }, [calculateStressLevels]);

  // Warnungen basierend auf den berechneten Levels
  const getStressWarnings = () => {
    const warnings = [];
    if (stressLevels.drawdown > 70) {
      warnings.push("Hoher Drawdown - Reduzieren Sie Ihre Position Sizes");
    }
    if (stressLevels.overtrading > 70) {
      warnings.push("Überhandelt - Machen Sie eine Handelspause");
    }
    if (stressLevels.revenge > 70) {
      warnings.push("Revenge Trading erkannt - Halten Sie sich an Ihren Plan");
    }
    if (stressLevels.fomo > 70) {
      warnings.push("FOMO Trading erkannt - Handeln Sie nur mit Setup");
    }
    return warnings;
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleStressLevelChange = (type: keyof StressLevels) => (event: any, newValue: number | number[]) => {
    setStressLevels(prev => ({
      ...prev,
      [type]: newValue as number
    }));
  };

  const handleRuleToggle = (ruleId: string) => {
    setCheckedRules(prev => 
      prev.includes(ruleId)
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleSaveState = () => {
    const psychologyData = {
      emotions: selectedEmotions,
      thoughts: tradingThoughts,
      stressLevels,
      checkedRules,
      timestamp: new Date().toISOString()
    };

    dispatch(updatePsychologyState(psychologyData));
  };

  const getEmotionalBalance = () => {
    const positiveEmotions = ['Gelassenheit'].filter(e => selectedEmotions.includes(e)).length;
    const negativeEmotions = ['Angst', 'Gier', 'Frustration'].filter(e => selectedEmotions.includes(e)).length;
    return Math.round((positiveEmotions / (positiveEmotions + negativeEmotions || 1)) * 100);
  };

  const shouldShowTradingWarning = () => {
    return warningShown || 
           checkedRules.length < 3 || 
           selectedEmotions.includes('Gier') || 
           selectedEmotions.includes('Angst');
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Trading-Psychologie Monitor
      </Typography>
      
      {shouldShowTradingWarning() && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Achtung: Ihre aktuellen psychologischen Indikatoren deuten auf ein erhöhtes Risiko hin.
          Überdenken Sie Ihre Trading-Entscheidungen.
        </Alert>
      )}

      {getStressWarnings().map((warning, index) => (
        <Alert key={index} severity="warning" sx={{ mb: 1 }}>
          {warning}
        </Alert>
      ))}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Emotionales Trading-Tagebuch
            </Typography>
            <Box sx={{ mb: 2 }}>
              {emotions.map((emotion) => (
                <Chip
                  key={emotion}
                  label={emotion}
                  onClick={() => handleEmotionToggle(emotion)}
                  sx={{ 
                    m: 0.5,
                    bgcolor: selectedEmotions.includes(emotion) 
                      ? 'primary.main' 
                      : 'grey.800'
                  }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Trading-Gedanken"
              value={tradingThoughts}
              onChange={(e) => setTradingThoughts(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Stress-Level-Tracking
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Drawdown Level</Typography>
              <Slider
                value={stressLevels.drawdown}
                onChange={handleStressLevelChange('drawdown')}
                valueLabelDisplay="auto"
                sx={{ 
                  '& .MuiSlider-thumb': {
                    backgroundColor: stressLevels.drawdown > 70 ? 'error.main' : 'primary.main'
                  }
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>FOMO Level</Typography>
              <Slider
                value={stressLevels.fomo}
                onChange={handleStressLevelChange('fomo')}
                valueLabelDisplay="auto"
                sx={{ 
                  '& .MuiSlider-thumb': {
                    backgroundColor: stressLevels.fomo > 70 ? 'error.main' : 'primary.main'
                  }
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Overtrading Level</Typography>
              <Slider
                value={stressLevels.overtrading}
                onChange={handleStressLevelChange('overtrading')}
                valueLabelDisplay="auto"
                sx={{ 
                  '& .MuiSlider-thumb': {
                    backgroundColor: stressLevels.overtrading > 70 ? 'error.main' : 'primary.main'
                  }
                }}
              />
            </Box>
            <Box>
              <Typography gutterBottom>Revenge Level</Typography>
              <Slider
                value={stressLevels.revenge}
                onChange={handleStressLevelChange('revenge')}
                valueLabelDisplay="auto"
                sx={{ 
                  '& .MuiSlider-thumb': {
                    backgroundColor: stressLevels.revenge > 70 ? 'error.main' : 'primary.main'
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trading-Regeln Checkliste
            </Typography>
            <Grid container spacing={2}>
              {tradingRules.map((rule) => (
                <Grid item xs={12} sm={6} key={rule.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedRules.includes(rule.id)}
                        onChange={() => handleRuleToggle(rule.id)}
                      />
                    }
                    label={rule.text}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance-Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Beste Trading-Zeit: {psychologyState.bestTradingTime || '10:30 - 11:30'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Emotionale Balance: {getEmotionalBalance()}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSaveState}
          fullWidth
        >
          Psychologie-Status speichern
        </Button>
      </Box>
    </Box>
  );
};

export default PsychologyMonitor; 