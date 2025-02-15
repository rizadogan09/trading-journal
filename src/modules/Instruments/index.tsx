import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { RootState } from '../../store';
import { addInstrument, updateInstrument } from '../../store/marketAnalysisSlice';
import { LivePriceIndicator } from '../../components/LivePriceIndicator';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Instruments = () => {
  const dispatch = useDispatch();
  const instruments = useSelector((state: RootState) => state.marketAnalysis.instruments);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<any>(null);

  const futures = instruments.filter(i => i.type === 'FUTURE');
  const stocks = instruments.filter(i => i.type === 'STOCK');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddNew = () => {
    setEditingInstrument({
      type: tabValue === 0 ? 'FUTURE' : 'STOCK',
      tickSize: 0.01,
      tickValue: 0.01,
      currency: 'USD'
    });
    setDialogOpen(true);
  };

  const handleEdit = (instrument: any) => {
    setEditingInstrument(instrument);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingInstrument) {
      const instrumentData = {
        ...editingInstrument,
        type: tabValue === 0 ? 'FUTURE' : 'STOCK'
      };
      
      if (!instrumentData.id) return; // Keine ID, kein Speichern
      
      if (!instruments.find(i => i.id === instrumentData.id)) {
        dispatch(addInstrument(instrumentData));
      } else {
        dispatch(updateInstrument(instrumentData));
      }
      setDialogOpen(false);
      setEditingInstrument(null);
    }
  };

  const InstrumentTable = ({ data }: { data: any[] }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Tick Size</TableCell>
            <TableCell>Tick Value</TableCell>
            <TableCell>Währung</TableCell>
            {tabValue === 1 && <TableCell>Börse</TableCell>}
            <TableCell>Live Price</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((instrument) => (
            <TableRow key={instrument.id}>
              <TableCell>{instrument.id}</TableCell>
              <TableCell>{instrument.name}</TableCell>
              <TableCell>{instrument.tickSize}</TableCell>
              <TableCell>{instrument.tickValue}</TableCell>
              <TableCell>{instrument.currency}</TableCell>
              {tabValue === 1 && <TableCell>{instrument.exchange}</TableCell>}
              <TableCell>
                <LivePriceIndicator instrumentId={instrument.id} />
              </TableCell>
              <TableCell>
                <Button 
                  size="small" 
                  onClick={() => handleEdit(instrument)}
                >
                  Bearbeiten
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Handelbare Instrumente
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleAddNew}
        >
          Neu hinzufügen
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Futures" />
          <Tab label="Aktien" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <InstrumentTable data={futures} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <InstrumentTable data={stocks} />
      </TabPanel>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {editingInstrument?.id ? 'Instrument bearbeiten' : 'Neues Instrument'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Symbol"
              value={editingInstrument?.id || ''}
              onChange={(e) => setEditingInstrument({
                ...editingInstrument,
                id: e.target.value
              })}
            />
            <TextField
              label="Name"
              value={editingInstrument?.name || ''}
              onChange={(e) => setEditingInstrument({
                ...editingInstrument,
                name: e.target.value
              })}
            />
            <TextField
              label="Tick Size"
              type="number"
              value={editingInstrument?.tickSize || ''}
              onChange={(e) => setEditingInstrument({
                ...editingInstrument,
                tickSize: Number(e.target.value)
              })}
            />
            <TextField
              label="Tick Value"
              type="number"
              value={editingInstrument?.tickValue || ''}
              onChange={(e) => setEditingInstrument({
                ...editingInstrument,
                tickValue: Number(e.target.value)
              })}
            />
            <FormControl>
              <InputLabel>Währung</InputLabel>
              <Select
                value={editingInstrument?.currency || ''}
                onChange={(e) => setEditingInstrument({
                  ...editingInstrument,
                  currency: e.target.value
                })}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </FormControl>
            {tabValue === 1 && (
              <FormControl>
                <InputLabel>Börse</InputLabel>
                <Select
                  value={editingInstrument?.exchange || ''}
                  onChange={(e) => setEditingInstrument({
                    ...editingInstrument,
                    exchange: e.target.value
                  })}
                >
                  <MenuItem value="NASDAQ">NASDAQ</MenuItem>
                  <MenuItem value="XETRA">XETRA</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSave} color="primary">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Instruments; 