const CalculationDetails: React.FC<{ calculation: any }> = ({ calculation }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Berechnungsdetails:</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>
            Preis-Differenz: {calculation.priceDiff?.toFixed(2)} Punkte
          </Typography>
          <Typography>
            Tick-Differenz: {calculation.tickDiff?.toFixed(2)} Ticks
          </Typography>
          <Typography>
            Risiko pro Kontrakt: ${calculation.riskPerContract?.toFixed(2)}
          </Typography>
          <Typography>
            Empfohlene Positionsgröße: {calculation.positionSize} Kontrakt(e)
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}; 