import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';

interface TradeDetailsProps {
  open: boolean;
  onClose: () => void;
  trade: any;
  onSave: (trade: any) => void;
}

const TradeDetails = ({ open, onClose, trade, onSave }: TradeDetailsProps) => {
  const [localTrade, setLocalTrade] = React.useState(trade);
  const [screenshots, setScreenshots] = React.useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshots([...screenshots, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Trade Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Entry Preis"
              value={localTrade.entryPrice}
              onChange={(e) => setLocalTrade({...localTrade, entryPrice: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Exit Preis"
              value={localTrade.exitPrice}
              onChange={(e) => setLocalTrade({...localTrade, exitPrice: e.target.value})}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Setup Qualität
            </Typography>
            {[1,2,3,4,5].map((rating) => (
              <Chip
                key={rating}
                label={rating}
                onClick={() => setLocalTrade({...localTrade, setupQuality: rating})}
                color={localTrade.setupQuality === rating ? "primary" : "default"}
                sx={{ mr: 1 }}
              />
            ))}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notizen"
              value={localTrade.notes}
              onChange={(e) => setLocalTrade({...localTrade, notes: e.target.value})}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Screenshots
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {screenshots.map((screenshot, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1}`} 
                    style={{ width: 200, height: 150, objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'background.paper' }}
                    onClick={() => setScreenshots(screenshots.filter((_, i) => i !== index))}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                sx={{ height: 150, width: 200 }}
              >
                Upload
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={() => onSave({...localTrade, screenshots})} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeDetails; 