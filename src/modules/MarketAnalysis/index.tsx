import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Stack
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addAnalysis } from '../../store/marketAnalysisSlice';
import { AdvantageMeter } from './components/AdvantageMeter';
import { StrategySelector } from './components/StrategySelector';
import TradingViewWidget from './components/TradingViewWidget';
import EconomicCalendar from './components/EconomicCalendar';

const TIME_LEVEL_WEIGHTS = {
  '4h': 0.2,  // 4H
  '1h': 0.7,  // 1H
  '15m': 0.1  // 15min
};

const DIRECTION_VALUES = {
  '↑': 1,    // Strong Up
  '↗': 0.5,  // Slight Up
  '→': 0,    // Neutral
  '↘': -0.5, // Slight Down
  '↓': -1    // Strong Down
};

const MarketAnalysis: React.FC = () => {
  const dispatch = useDispatch();
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);
  
  const [selectedInstrument, setSelectedInstrument] = useState<string>(instruments[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeLevels, setTimeLevels] = useState({
    '4h': 'neutral',   // 4H zuerst
    '1h': 'neutral',   // 1H dann
    '15m': 'neutral'   // 15min zuletzt
  });
  const [advantage, setAdvantage] = useState(0);

  useEffect(() => {
    calculateAdvantage();
  }, [timeLevels]);

  const calculateAdvantage = () => {
    let total = 0;
    Object.entries(timeLevels).forEach(([timeLevel, direction]) => {
      const weight = TIME_LEVEL_WEIGHTS[timeLevel as keyof typeof TIME_LEVEL_WEIGHTS];
      const value = DIRECTION_VALUES[direction as keyof typeof DIRECTION_VALUES] || 0;
      total += weight * value;
    });

    // Umrechnung in Prozent (-100 bis +100)
    const advantagePercent = Math.round(total * 100);
    setAdvantage(advantagePercent);
  };

  const handleInstrumentChange = (value: string) => {
    setSelectedInstrument(value);
    dispatch(addAnalysis({
      id: Date.now().toString(),
      date: selectedDate,
      instrumentId: value,
      timeLevels,
      advantage
    }));
  };

  const handleTimeFrameChange = (timeLevel: string, value: string) => {
    setTimeLevels({
      ...timeLevels,
      [timeLevel]: value
    });
  };

  const handleSaveAnalysis = () => {
    dispatch(addAnalysis({
      id: Date.now().toString(),
      date: selectedDate,
      instrumentId: selectedInstrument,
      timeLevels,
      advantage
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Marktanalyse
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Instrument</InputLabel>
                <Select
                  value={selectedInstrument}
                  label="Instrument"
                  onChange={(e) => handleInstrumentChange(e.target.value)}
                >
                  {instruments.map((instrument) => (
                    <MenuItem key={instrument.id} value={instrument.id}>
                      {instrument.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="date"
                label="Datum"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                sx={{ width: 200 }}
              />
            </Stack>
            <TradingViewWidget symbol={selectedInstrument} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {Object.keys(timeLevels).map((timeLevel) => (
                <FormControl key={timeLevel} fullWidth>
                  <InputLabel>{timeLevel}</InputLabel>
                  <Select
                    value={timeLevels[timeLevel]}
                    label={timeLevel}
                    onChange={(e) => handleTimeFrameChange(timeLevel, e.target.value)}
                  >
                    <MenuItem value="↑">↑ Strong Up</MenuItem>
                    <MenuItem value="↗">↗ Slight Up</MenuItem>
                    <MenuItem value="→">→ Neutral</MenuItem>
                    <MenuItem value="↘">↘ Slight Down</MenuItem>
                    <MenuItem value="↓">↓ Strong Down</MenuItem>
                  </Select>
                </FormControl>
              ))}
              <Button 
                variant="contained" 
                onClick={handleSaveAnalysis}
                sx={{ height: 56 }}
              >
                Analyse speichern
              </Button>
            </Stack>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Marktvorteil
              </Typography>
              <AdvantageMeter advantage={advantage} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Strategien
            </Typography>
            <StrategySelector advantage={advantage} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Wirtschaftskalender
            </Typography>
            <EconomicCalendar />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketAnalysis; 