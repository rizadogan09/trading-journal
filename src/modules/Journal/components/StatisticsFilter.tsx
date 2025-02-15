import React from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import deLocale from 'date-fns/locale/de';
import { Sync as SyncIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface FilterOptions {
  dateFrom: Date | null;
  dateTo: Date | null;
  instrument: string;
  strategy: string;
  setupQuality: string;
}

interface StatisticsFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  instruments: any[];
  strategies: any[];
}

const StatisticsFilter = ({ onFilterChange, instruments, strategies }: StatisticsFilterProps) => {
  const [filters, setFilters] = React.useState<FilterOptions>({
    dateFrom: null,
    dateTo: null,
    instrument: '',
    strategy: '',
    setupQuality: '',
  });

  const handleChange = (field: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const isConnected = useSelector((state: RootState) => state.realtime.isConnected);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={deLocale}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filter & Statistiken</Typography>
          {isConnected && (
            <Chip
              icon={<SyncIcon className="rotating" />}
              label="Live Updates"
              color="success"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Von"
              value={filters.dateFrom}
              onChange={(date) => handleChange('dateFrom', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Bis"
              value={filters.dateTo}
              onChange={(date) => handleChange('dateTo', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Instrument</InputLabel>
              <Select
                value={filters.instrument}
                label="Instrument"
                onChange={(e) => handleChange('instrument', e.target.value)}
              >
                <MenuItem value="">Alle</MenuItem>
                {instruments.map((inst) => (
                  <MenuItem key={inst.id} value={inst.id}>
                    {inst.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Strategie</InputLabel>
              <Select
                value={filters.strategy}
                label="Strategie"
                onChange={(e) => handleChange('strategy', e.target.value)}
              >
                <MenuItem value="">Alle</MenuItem>
                {strategies.map((strat) => (
                  <MenuItem key={strat.id} value={strat.id}>
                    {strat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Setup Qualität</InputLabel>
              <Select
                value={filters.setupQuality}
                label="Setup Qualität"
                onChange={(e) => handleChange('setupQuality', e.target.value)}
              >
                <MenuItem value="">Alle</MenuItem>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default StatisticsFilter; 