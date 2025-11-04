import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    price: 0,
  },
  pro: {
    name: 'Pro',
    price: 9800,
    interval: 'month' as const,
  },
  enterprise: {
    name: 'Enterprise',
    price: 0, // Custom pricing
    interval: 'year' as const,
  },
} as const;




