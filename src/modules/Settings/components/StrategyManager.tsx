import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addStrategy, updateStrategy, deleteStrategy } from '../../../store/marketAnalysisSlice';

interface StrategyFormData {
  id?: string;
  name: string;
  variant: string;
  longMin: number;
  longMax: number;
  shortMin: number;
  shortMax: number;
}

const initialFormData: StrategyFormData = {
  name: '',
  variant: '',
  longMin: 33,
  longMax: 100,
  shortMin: -100,
  shortMax: -33
};

const StrategyManager = () => {
  const dispatch = useDispatch();
  const strategies = useSelector((state: RootState) => state.marketAnalysis.strategies);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<StrategyFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
  };

  const handleEdit = (strategy: any) => {
    setFormData({
      id: strategy.id,
      name: strategy.name,
      variant: strategy.variant || '',
      longMin: strategy.longMin || 33,
      longMax: strategy.longMax || 100,
      shortMin: strategy.shortMin || -100,
      shortMax: strategy.shortMax || -33
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleSave = () => {
    const strategyData = {
      id: formData.id || Date.now().toString(),
      name: formData.name,
      variant: formData.variant,
      longMin: Number(formData.longMin),
      longMax: Number(formData.longMax),
      shortMin: Number(formData.shortMin),
      shortMax: Number(formData.shortMax),
      description: `${formData.name} (${formData.variant})`
    };

    if (isEditing) {
      dispatch(updateStrategy(strategyData));
    } else {
      dispatch(addStrategy(strategyData));
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Möchten Sie diese Strategie wirklich löschen?')) {
      dispatch(deleteStrategy(id));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Strategien verwalten</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Neue Strategie
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bezeichnung</TableCell>
              <TableCell>Variante</TableCell>
              <TableCell>Long-Vorteil</TableCell>
              <TableCell>Short-Vorteil</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {strategies.map((strategy) => (
              <TableRow key={strategy.id}>
                <TableCell>{strategy.name}</TableCell>
                <TableCell>{strategy.variant}</TableCell>
                <TableCell>{`${strategy.longMin}% bis ${strategy.longMax}%`}</TableCell>
                <TableCell>{`${strategy.shortMin}% bis ${strategy.shortMax}%`}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(strategy)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(strategy.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Strategie bearbeiten' : 'Neue Strategie'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Bezeichnung"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Variante"
              value={formData.variant}
              onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Long Min (%)"
                type="number"
                value={formData.longMin}
                onChange={(e) => setFormData({ ...formData, longMin: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Long Max (%)"
                type="number"
                value={formData.longMax}
                onChange={(e) => setFormData({ ...formData, longMax: Number(e.target.value) })}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Short Min (%)"
                type="number"
                value={formData.shortMin}
                onChange={(e) => setFormData({ ...formData, shortMin: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Short Max (%)"
                type="number"
                value={formData.shortMax}
                onChange={(e) => setFormData({ ...formData, shortMax: Number(e.target.value) })}
                fullWidth
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Abbrechen</Button>
          <Button onClick={handleSave} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StrategyManager; 