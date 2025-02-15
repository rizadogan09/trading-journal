import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Tabs, Tab } from '@mui/material';
import StrategyManager from './components/StrategyManager';
import AccountManager from './components/AccountManager';
import ProfileManager from './components/ProfileManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      {...other}
      sx={{ mt: 3 }}
    >
      {value === index && children}
    </Box>
  );
};

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Einstellungen
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Trading Accounts" />
          <Tab label="Profil" />
          <Tab label="Strategien" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <AccountManager />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ProfileManager />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <StrategyManager />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings; 