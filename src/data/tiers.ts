import { AirtimeTier } from '../types';

export const airtimeTiers: AirtimeTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    discount: 2,
    minAmount: 100,
    description: 'Perfect for regular users'
  },
  {
    id: 'premium',
    name: 'Premium',
    discount: 5,
    minAmount: 500,
    description: 'Great savings for frequent users'
  },
  {
    id: 'vip',
    name: 'VIP',
    discount: 8,
    minAmount: 1000,
    description: 'Maximum savings for power users'
  }
];