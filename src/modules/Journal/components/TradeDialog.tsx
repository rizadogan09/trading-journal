import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Trade } from '../../../store/journalSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Sync as SyncIcon } from '@mui/icons-material';
import instrumentsData from '../../../data/instruments.json';

interface TradeDialogProps {
  open: boolean;
  trade: Trade;
  onClose: () => void;
  onSave: (updatedTrade: Trade) => void;
}

const TradeDialog: React.FC<TradeDialogProps> = ({ open, trade, onClose, onSave }) => {
  const [localTrade, setLocalTrade] = useState(trade);
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);
  const availableTags = useSelector((state: RootState) => state.journal.tags);
  const isConnected = useSelector((state: RootState) => state.realtime.isConnected);

  useEffect(() => {
    if (isConnected) {
      setLocalTrade(trade);
    }
  }, [trade, isConnected]);

  const handleChange = (field: keyof Trade, value: any) => {
    setLocalTrade(prev => {
      const updatedTrade = { ...prev, [field]: value };
      
      if (field === 'status' && value === 'CLOSED') {
        updatedTrade.exitTime = new Date().toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      if (field === 'exitPrice' && updatedTrade.status === 'CLOSED') {
        const instrument = instruments.find((i: { id: string }) => i.id === trade.instrumentId);
        if (instrument) {
          const pnl = updatedTrade.direction === 'LONG'
            ? (value - updatedTrade.entryPrice) / instrument.tickSize * instrument.tickValue * updatedTrade.size
            : (updatedTrade.entryPrice - value) / instrument.tickSize * instrument.tickValue * updatedTrade.size;
          
          updatedTrade.pnl = Number(pnl.toFixed(2));
        }
      }

      return updatedTrade;
    });
  };

  const handleTagToggle = (tag: string) => {
    setLocalTrade(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSave = () => {
    if (localTrade.status === 'CLOSED' && localTrade.exitPrice) {
      const instrument = instruments.find((i: { id: string }) => i.id === trade.instrumentId);
      if (instrument) {
        const pnl = localTrade.direction === 'LONG'
          ? (localTrade.exitPrice - localTrade.entryPrice) / instrument.tickSize * instrument.tickValue * localTrade.size
          : (localTrade.entryPrice - localTrade.exitPrice) / instrument.tickSize * instrument.tickValue * localTrade.size;

        setLocalTrade(prev => ({
          ...prev,
          pnl: Number(pnl.toFixed(2))
        }));
      }
    }
    
    onSave(localTrade);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Trade Details
        {isConnected && (
          <Chip
            icon={<SyncIcon />}
            label="Live"
            color="success"
            size="small"
            variant="outlined"
          />
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={localTrade.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="OPEN">Offen</MenuItem>
                <MenuItem value="CLOSED">Geschlossen</MenuItem>
                <MenuItem value="CANCELLED">Storniert</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {localTrade.status === 'CLOSED' && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exit Preis"
                type="number"
                value={localTrade.exitPrice || ''}
                onChange={(e) => handleChange('exitPrice', Number(e.target.value))}
              />
            </Grid>
          )}
          {localTrade.exitTime && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Exit Zeit: {localTrade.exitTime}
              </Typography>
            </Grid>
          )}
          {localTrade.pnl !== undefined && (
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color={localTrade.pnl >= 0 ? 'success.main' : 'error.main'}
                align="center"
              >
                P&L: {localTrade.pnl.toFixed(2)}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notizen"
              value={localTrade.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Trade-Analyse Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableTags.map((tag: string) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  color={localTrade.tags.includes(tag) ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          color="primary"
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeDialog; 