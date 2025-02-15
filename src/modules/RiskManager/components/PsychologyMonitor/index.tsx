import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  TextField,
  Button,
  Card,
  CardContent,
  Slider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material';
import {
  Mood,
  MoodBad,
  Timer,
  TrendingUp,
  Psychology,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const emotions = [
  { name: 'Angst', color: '#ff4d4d' },
  { name: 'Gier', color: '#ffd700' },
  { name: 'Euphorie', color: '#4caf50' },
  { name: 'Unsicherheit', color: '#ff9800' },
  { name: 'Frustration', color: '#9c27b0' },
  { name: 'Gelassenheit', color: '#2196f3' }
];

const tradingRules = [
  'Stop-Loss immer setzen',
  'Positionsgröße beachten',
  'Kein Revenge-Trading',
  'Trading-Plan folgen',
  'Risiko-Management beachten'
];

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    borderRadius: 5
  }
}));

const PsychologyMonitor: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [stressLevels, setStressLevels] = useState({
    drawdown: 30,
    fomo: 40,
    overtrading: 20,
    revenge: 50
  });
  const [checkedRules, setCheckedRules] = useState<string[]>([]);
  const [focusTimer, setFocusTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  const handleRuleToggle = (rule: string) => {
    const currentIndex = checkedRules.indexOf(rule);
    const newCheckedRules = [...checkedRules];

    if (currentIndex === -1) {
      newCheckedRules.push(rule);
    } else {
      newCheckedRules.splice(currentIndex, 1);
    }

    setCheckedRules(newCheckedRules);
  };

  const getStressColor = (value: number) => {
    if (value < 30) return '#4caf50';
    if (value < 70) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trading-Psychologie Monitor
      </Typography>

      <Grid container spacing={3}>
        {/* Emotionales Trading-Tagebuch */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Emotionales Trading-Tagebuch
            </Typography>
            <Box sx={{ mb: 2 }}>
              {emotions.map((emotion) => (
                <Chip
                  key={emotion.name}
                  label={emotion.name}
                  onClick={() => setSelectedEmotion(emotion.name)}
                  sx={{
                    m: 0.5,
                    bgcolor: selectedEmotion === emotion.name ? emotion.color : 'default',
                    color: selectedEmotion === emotion.name ? 'white' : 'inherit'
                  }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Trading-Gedanken"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary">
              Eintrag speichern
            </Button>
          </Paper>
        </Grid>

        {/* Stress-Level-Tracking */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Stress-Level-Tracking
            </Typography>
            <Box sx={{ mb: 2 }}>
              {Object.entries(stressLevels).map(([key, value]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Level
                  </Typography>
                  <StyledLinearProgress
                    variant="determinate"
                    value={value}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getStressColor(value)
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Trading-Ziele & Mindset */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trading-Regeln Checkliste
            </Typography>
            <List>
              {tradingRules.map((rule) => (
                <ListItem
                  key={rule}
                  dense
                  button
                  onClick={() => handleRuleToggle(rule)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedRules.includes(rule)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={rule} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Performance-Insights */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance-Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Beste Trading-Zeit
                    </Typography>
                    <Typography variant="h5">10:30 - 11:30</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Emotionale Balance
                    </Typography>
                    <Typography variant="h5">75%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PsychologyMonitor; 