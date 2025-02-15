export const defaultInstruments = [
  // CME Futures
  {
    id: 'ES',
    name: 'E-mini S&P 500',
    type: 'FUTURE',
    exchange: 'CME',
    tickSize: 0.25,
    tickValue: 12.50,
    currency: 'USD',
    multiplier: 50
  },
  {
    id: 'NQ',
    name: 'E-mini NASDAQ-100',
    type: 'FUTURE',
    exchange: 'CME',
    tickSize: 0.25,
    tickValue: 5,
    currency: 'USD',
    multiplier: 20
  },
  // EUREX Futures
  {
    id: 'FDAX',
    name: 'DAX Future',
    type: 'FUTURE',
    exchange: 'EUREX',
    tickSize: 0.5,
    tickValue: 12.50,
    currency: 'EUR',
    multiplier: 25
  },
  // Top 10 US Aktien
  {
    id: 'AAPL',
    name: 'Apple Inc.',
    type: 'STOCK',
    exchange: 'NASDAQ',
    tickSize: 0.01,
    tickValue: 0.01,
    currency: 'USD'
  },
  {
    id: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'STOCK',
    exchange: 'NASDAQ',
    tickSize: 0.01,
    tickValue: 0.01,
    currency: 'USD'
  }
  // ... weitere Instrumente
]; 