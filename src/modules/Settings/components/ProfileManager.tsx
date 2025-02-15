import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

const ProfileManager = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  return (
    <Box>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" gutterBottom>Persönliche Daten</Typography>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Vorname"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nachname"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="E-Mail"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Telefon"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                fullWidth
              />
              <Button variant="contained">
                Änderungen speichern
              </Button>
            </Stack>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Abonnement</Typography>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Aktueller Plan</Typography>
                  <Typography variant="h6">Pro</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Status</Typography>
                  <Typography color="success.main">Aktiv</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Nächste Zahlung</Typography>
                  <Typography>01.03.2024</Typography>
                </Box>
                <Divider />
                <Button variant="outlined" color="primary">
                  Plan ändern
                </Button>
                <Button variant="outlined" color="error">
                  Abonnement kündigen
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileManager; 