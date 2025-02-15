import { SubscriptionTier } from '../types/subscription';

interface FeatureRestrictions {
  maxTradesPerDay: number;
  maxAccounts: number;
  hasAdvancedAnalytics: boolean;
  hasApiAccess: boolean;
}

const tierRestrictions: Record<SubscriptionTier, FeatureRestrictions> = {
  FREE: {
    maxTradesPerDay: 5,
    maxAccounts: 1,
    hasAdvancedAnalytics: false,
    hasApiAccess: false
  },
  BASIC: {
    maxTradesPerDay: Infinity,
    maxAccounts: 3,
    hasAdvancedAnalytics: false,
    hasApiAccess: false
  },
  PRO: {
    maxTradesPerDay: Infinity,
    maxAccounts: Infinity,
    hasAdvancedAnalytics: true,
    hasApiAccess: true
  },
  ENTERPRISE: {
    maxTradesPerDay: Infinity,
    maxAccounts: Infinity,
    hasAdvancedAnalytics: true,
    hasApiAccess: true
  }
};

export const checkFeatureAccess = (
  tier: SubscriptionTier,
  feature: keyof FeatureRestrictions
): boolean => {
  return !!tierRestrictions[tier][feature];
}; 