import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Slider,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface BacktestSettingsProps {
  onRunBacktest: (settings: any) => void;
  disabled: boolean;
}

const BacktestSettings: React.FC<BacktestSettingsProps> = ({ onRunBacktest, disabled }) => {
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);
  const strategies = useSelector((state: RootState) => state.marketAnalysis.strategies);

  const [settings, setSettings] = useState({
    instrumentId: '',
    strategy: '',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    initialCapital: 10000,
    positionSize: 'fixed' as const,
    sizeValue: 1,
    stopLoss: 1.5,
    takeProfit: 3
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onRunBacktest(settings);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Backtest Einstellungen
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Instrument</InputLabel>
            <Select
              value={settings.instrumentId}
              label="Instrument"
              onChange={(e) => handleChange('instrumentId', e.target.value)}
              disabled={disabled}
            >
              {instruments.map(inst => (
                <MenuItem key={inst.id} value={inst.id}>
                  {inst.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Strategie</InputLabel>
            <Select
              value={settings.strategy}
              label="Strategie"
              onChange={(e) => handleChange('strategy', e.target.value)}
              disabled={disabled}
            >
              {strategies.map(strat => (
                <MenuItem key={strat.id} value={strat.id}>
                  {strat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Start Datum"
            value={settings.startDate}
            onChange={(date) => handleChange('startDate', date)}
            disabled={disabled}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="End Datum"
            value={settings.endDate}
            onChange={(date) => handleChange('endDate', date)}
            disabled={disabled}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Initial Kapital"
            type="number"
            value={settings.initialCapital}
            onChange={(e) => handleChange('initialCapital', Number(e.target.value))}
            disabled={disabled}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Position Size</InputLabel>
            <Select
              value={settings.positionSize}
              label="Position Size"
              onChange={(e) => handleChange('positionSize', e.target.value)}
              disabled={disabled}
            >
              <MenuItem value="fixed">Fixed Size</MenuItem>
              <MenuItem value="percent">Prozent vom Kapital</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={settings.positionSize === 'fixed' ? 'Kontrakte' : 'Prozent'}
            type="number"
            value={settings.sizeValue}
            onChange={(e) => handleChange('sizeValue', Number(e.target.value))}
            disabled={disabled}
            InputProps={{
              endAdornment: <InputAdornment position="end">
                {settings.positionSize === 'fixed' ? 'Lots' : '%'}
              </InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>Stop Loss (R)</Typography>
          <Slider
            value={settings.stopLoss}
            onChange={(_, value) => handleChange('stopLoss', value)}
            min={0.5}
            max={3}
            step={0.1}
            marks
            disabled={disabled}
            valueLabelDisplay="auto"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>Take Profit (R)</Typography>
          <Slider
            value={settings.takeProfit}
            onChange={(_, value) => handleChange('takeProfit', value)}
            min={1}
            max={5}
            step={0.1}
            marks
            disabled={disabled}
            valueLabelDisplay="auto"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={disabled}
          >
            Backtest Starten
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BacktestSettings; 