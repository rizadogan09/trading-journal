import { SubscriptionPlan } from '../types/subscription';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Kostenlos',
    tier: 'FREE',
    price: 0,
    currency: 'EUR',
    billingPeriod: 'MONTHLY',
    features: [
      'Basis Risikomanager',
      'Max. 5 Trades pro Tag',
      'Basis Instrumente',
      '1 Account'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    tier: 'BASIC',
    price: 29.99,
    currency: 'EUR',
    billingPeriod: 'MONTHLY',
    features: [
      'Erweiterter Risikomanager',
      'Unbegrenzte Trades',
      'Alle Instrumente',
      'Bis zu 3 Accounts',
      'Trade-Statistiken'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    tier: 'PRO',
    price: 49.99,
    currency: 'EUR',
    billingPeriod: 'MONTHLY',
    features: [
      'Alle Basic-Features',
      'Erweiterte Analysen',
      'Unbegrenzte Accounts',
      'API-Zugang',
      'Prioritäts-Support'
    ]
  }
]; 