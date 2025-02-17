import React from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, Button } from '@mui/material';
import { updatePsychologyState } from '../../../store/psychologySlice';

export const EmotionalStateInput: React.FC = () => {
  const dispatch = useDispatch();
  
  const handleSave = () => {
    dispatch(updatePsychologyState({
      emotions: [],  // Hier können wir später Emotionen hinzufügen
      thoughts: 'Test Notiz',  // Testdaten
      stressLevels: {
        drawdown: 5,  // Testdaten
        fomo: 5,
        overtrading: 5,
        revenge: 5
      },
      timestamp: new Date().toISOString()
    }));
    console.log('Speichern ausgelöst'); // Debug-Log
  };

  return (
    <Card>
      <CardContent>
        <Button 
          variant="contained" 
          onClick={handleSave}
          fullWidth
        >
          Test-Speichern
        </Button>
      </CardContent>
    </Card>
  );
}; 