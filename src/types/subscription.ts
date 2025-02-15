export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billingPeriod: 'MONTHLY' | 'YEARLY';
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
} 