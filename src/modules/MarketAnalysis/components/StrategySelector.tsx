import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Strategy } from '../../../types/marketAnalysis';

interface StrategySelectorProps {
  advantage: number;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ advantage }) => {
  const theme = useTheme();
  const strategies = useSelector((state: RootState) => state.marketAnalysis.strategies);

  const getApplicableStrategies = () => {
    return strategies.filter(strategy => 
      advantage >= strategy.minAdvantage && advantage <= strategy.maxAdvantage
    );
  };

  const getStrategyColor = (min: number, max: number) => {
    if (min >= 33 || max <= -33) return theme.palette.success.main;
    return theme.palette.warning.main;
  };

  const applicableStrategies = getApplicableStrategies();

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Handelbare Strategien
      </Typography>
      {applicableStrategies.length > 0 ? (
        <List>
          {applicableStrategies.map((strategy) => (
            <React.Fragment key={strategy.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {strategy.name}
                      <Chip
                        size="small"
                        label={`${strategy.minAdvantage}% bis ${strategy.maxAdvantage}%`}
                        sx={{
                          backgroundColor: getStrategyColor(strategy.minAdvantage, strategy.maxAdvantage),
                          color: 'white'
                        }}
                      />
                    </Box>
                  }
                  secondary={strategy.description}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography 
          color="text.secondary" 
          align="center"
          sx={{ 
            py: 4,
            backgroundColor: theme.palette.grey[900],
            borderRadius: 1
          }}
        >
          Keine Strategien für diesen Marktvorteil verfügbar
        </Typography>
      )}
    </Box>
  );
}; 