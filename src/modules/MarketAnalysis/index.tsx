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
  
  const [selectedInstrument, setSelectedInstrument] = useState('');
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
  };

  const handleTimeFrameChange = (timeLevel: string, value: string) => {
    setTimeLevels({
      ...timeLevels,
      [timeLevel]: value
    });
  };

  const handleSaveAnalysis = () => {
    if (selectedInstrument) {
      dispatch(addAnalysis({
        id: Date.now().toString(),
        date: selectedDate,
        instrumentId: selectedInstrument,
        timeLevels: timeLevels,
        advantage
      }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Marktanalyse
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, minHeight: 500 }}>
            <TradingViewWidget />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Marktanalyse Eingabe
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Instrument</InputLabel>
                  <Select
                    value={selectedInstrument || ''}
                    onChange={(e) => handleInstrumentChange(e.target.value)}
                  >
                    {instruments.map((inst) => (
                      <MenuItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>4H</InputLabel>
                  <Select
                    value={timeLevels['4h']}
                    onChange={(e) => handleTimeFrameChange('4h', e.target.value)}
                  >
                    <MenuItem value="↑">↑</MenuItem>
                    <MenuItem value="↗">↗</MenuItem>
                    <MenuItem value="→">→</MenuItem>
                    <MenuItem value="↘">↘</MenuItem>
                    <MenuItem value="↓">↓</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>1H</InputLabel>
                  <Select
                    value={timeLevels['1h']}
                    onChange={(e) => handleTimeFrameChange('1h', e.target.value)}
                  >
                    <MenuItem value="↑">↑</MenuItem>
                    <MenuItem value="↗">↗</MenuItem>
                    <MenuItem value="→">→</MenuItem>
                    <MenuItem value="↘">↘</MenuItem>
                    <MenuItem value="↓">↓</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>15M</InputLabel>
                  <Select
                    value={timeLevels['15m']}
                    onChange={(e) => handleTimeFrameChange('15m', e.target.value)}
                  >
                    <MenuItem value="↑">↑</MenuItem>
                    <MenuItem value="↗">↗</MenuItem>
                    <MenuItem value="→">→</MenuItem>
                    <MenuItem value="↘">↘</MenuItem>
                    <MenuItem value="↓">↓</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSaveAnalysis}
                  disabled={!selectedInstrument}
                >
                  Analyse speichern
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Typography variant="h6" gutterBottom>
                    Marktvorteil
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <AdvantageMeter advantage={advantage} />
                  </Box>

                  <StrategySelector advantage={advantage} />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, minHeight: 400 }}>
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