import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { subscriptionPlans } from '../../data/subscriptionPlans';

const Subscription: React.FC = () => {
  const handleSubscribe = (planId: string) => {
    // Implementierung der Zahlungsabwicklung
    console.log(`Subscribe to plan: ${planId}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Abonnement
      </Typography>
      <Grid container spacing={3}>
        {subscriptionPlans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {plan.price === 0
                    ? 'Kostenlos'
                    : `${plan.price} ${plan.currency}/Monat`}
                </Typography>
                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.price === 0 ? 'Jetzt starten' : 'Jetzt abonnieren'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Subscription; 