import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
  DialogActions,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface TradingAccount {
  id: string;
  name: string;
  broker: string;
  accountType: 'LIVE' | 'DEMO';
  currency: string;
  balance: number;
  riskPerTrade: number;
  maxDrawdown: number;
}

const initialAccount: TradingAccount = {
  id: '',
  name: '',
  broker: '',
  accountType: 'DEMO',
  currency: 'USD',
  balance: 0,
  riskPerTrade: 1,
  maxDrawdown: 10
};

const AccountManager = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<TradingAccount>(initialAccount);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => {
    setAccount(initialAccount);
    setIsEditing(false);
    setOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Trading Accounts</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Neuer Account
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Broker</TableCell>
              <TableCell>Typ</TableCell>
              <TableCell>Währung</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Risk/Trade</TableCell>
              <TableCell align="right">Max DD</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Account Liste hier */}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Account bearbeiten' : 'Neuer Trading Account'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Account Name"
              value={account.name}
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Broker"
              value={account.broker}
              onChange={(e) => setAccount({ ...account, broker: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Account Typ</InputLabel>
              <Select
                value={account.accountType}
                onChange={(e) => setAccount({ ...account, accountType: e.target.value as 'LIVE' | 'DEMO' })}
              >
                <MenuItem value="DEMO">Demo Account</MenuItem>
                <MenuItem value="LIVE">Live Account</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Währung</InputLabel>
              <Select
                value={account.currency}
                onChange={(e) => setAccount({ ...account, currency: e.target.value as string })}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Balance"
              type="number"
              value={account.balance}
              onChange={(e) => setAccount({ ...account, balance: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Risk pro Trade (%)"
              type="number"
              value={account.riskPerTrade}
              onChange={(e) => setAccount({ ...account, riskPerTrade: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Maximaler Drawdown (%)"
              type="number"
              value={account.maxDrawdown}
              onChange={(e) => setAccount({ ...account, maxDrawdown: Number(e.target.value) })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={() => {}}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountManager; 