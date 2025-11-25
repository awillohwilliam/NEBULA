import { supabase } from '../lib/supabase';
import { bundleOptions } from '../data/bundles';

export interface AirtimePurchaseRequest {
  phoneNumber: string;
  amount: number;
  network: string;
  tier: string;
}

export interface BundlePurchaseRequest {
  phoneNumber: string;
  bundleId: string;
  network: string;
}

export interface TransactionResponse {
  id: string;
  reference: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
  amount: number;
  recipient: string;
  tier?: string;
}

// Helper to get current session token
const getSessionToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// Helper to ensure user exists (for demo purposes without auth)
const ensureDemoUser = async () => {
  const demoUserId = 'demo-user-id';
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', demoUserId)
    .maybeSingle();

  if (!existingUser) {
    await supabase.from('users').insert({
      id: demoUserId,
      email: 'demo@nebulanet.com',
      name: 'Demo User',
      phone_number: '08012345678',
      balance: 10000,
      tier: 'basic',
      total_savings: 0,
    });
  }

  return demoUserId;
};

export const supabaseApiService = {
  purchaseAirtime: async (data: AirtimePurchaseRequest): Promise<TransactionResponse> => {
    try {
      // Calculate discount
      const tierDiscounts: Record<string, number> = { basic: 0.02, premium: 0.05, vip: 0.08 };
      const discount = tierDiscounts[data.tier] || 0.02;
      const discountedAmount = data.amount * (1 - discount);
      const originalAmount = data.amount;

      // Get or create demo user (in production, use actual auth)
      const userId = await ensureDemoUser();

      // Generate reference
      const reference = `AIR${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Simulate success rate
      const status = Math.random() > 0.05 ? 'completed' : 'pending';

      // Insert transaction
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'airtime',
          network: data.network,
          phone_number: data.phoneNumber,
          amount: discountedAmount,
          original_amount: originalAmount,
          discount_percentage: discount * 100,
          tier: data.tier,
          status: status,
          reference: reference,
        })
        .select()
        .single();

      if (error) throw error;

      // Update user savings if completed
      if (status === 'completed') {
        const savings = originalAmount - discountedAmount;
        await supabase.rpc('increment_total_savings', {
          p_user_id: userId,
          p_amount: savings,
        }).catch(() => {
          // Fallback if function doesn't exist
          supabase
            .from('users')
            .select('total_savings')
            .eq('id', userId)
            .single()
            .then(({ data: user }) => {
              if (user) {
                supabase
                  .from('users')
                  .update({ total_savings: (user.total_savings || 0) + savings })
                  .eq('id', userId);
              }
            });
        });
      }

      return {
        id: transaction.id,
        reference: transaction.reference,
        status: status === 'completed' ? 'success' : status,
        message: status === 'completed' ? 'Airtime purchase successful' : 'Transaction is being processed',
        amount: discountedAmount,
        recipient: data.phoneNumber,
        tier: data.tier,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to purchase airtime');
    }
  },

  purchaseBundle: async (data: BundlePurchaseRequest): Promise<TransactionResponse> => {
    try {
      // Get bundle details
      const bundle = bundleOptions.find(b => b.id === data.bundleId);
      if (!bundle) {
        throw new Error('Bundle not found');
      }

      // Get or create demo user
      const userId = await ensureDemoUser();

      // Generate reference
      const reference = `BUN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Simulate success rate
      const status = Math.random() > 0.05 ? 'completed' : 'pending';

      // Insert transaction
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'bundle',
          network: data.network,
          phone_number: data.phoneNumber,
          amount: bundle.discountedPrice,
          original_amount: bundle.originalPrice,
          discount_percentage: ((bundle.originalPrice - bundle.discountedPrice) / bundle.originalPrice) * 100,
          bundle_id: data.bundleId,
          bundle_size: bundle.size,
          status: status,
          reference: reference,
        })
        .select()
        .single();

      if (error) throw error;

      // Update user savings if completed
      if (status === 'completed') {
        const savings = bundle.originalPrice - bundle.discountedPrice;
        await supabase.rpc('increment_total_savings', {
          p_user_id: userId,
          p_amount: savings,
        }).catch(() => {
          // Fallback
          supabase
            .from('users')
            .select('total_savings')
            .eq('id', userId)
            .single()
            .then(({ data: user }) => {
              if (user) {
                supabase
                  .from('users')
                  .update({ total_savings: (user.total_savings || 0) + savings })
                  .eq('id', userId);
              }
            });
        });
      }

      return {
        id: transaction.id,
        reference: transaction.reference,
        status: status === 'completed' ? 'success' : status,
        message: status === 'completed' ? 'Bundle purchase successful' : 'Transaction is being processed',
        amount: bundle.discountedPrice,
        recipient: data.phoneNumber,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to purchase bundle');
    }
  },

  getTransactionHistory: async () => {
    try {
      const userId = await ensureDemoUser();

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Failed to fetch transaction history:', error);
      return [];
    }
  },

  getUserProfile: async () => {
    try {
      const userId = await ensureDemoUser();

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  },
};
