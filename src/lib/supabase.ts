import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone_number: string;
          balance: number;
          tier: 'basic' | 'premium' | 'vip';
          total_savings: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          phone_number?: string;
          balance?: number;
          tier?: 'basic' | 'premium' | 'vip';
          total_savings?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          phone_number?: string;
          balance?: number;
          tier?: 'basic' | 'premium' | 'vip';
          total_savings?: number;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'airtime' | 'bundle';
          network: string;
          phone_number: string;
          amount: number;
          original_amount: number;
          discount_percentage: number;
          tier: string;
          bundle_id: string | null;
          bundle_size: string | null;
          status: 'completed' | 'pending' | 'failed';
          reference: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'airtime' | 'bundle';
          network: string;
          phone_number: string;
          amount: number;
          original_amount: number;
          discount_percentage?: number;
          tier?: string;
          bundle_id?: string | null;
          bundle_size?: string | null;
          status?: 'completed' | 'pending' | 'failed';
          reference: string;
          created_at?: string;
        };
        Update: {
          status?: 'completed' | 'pending' | 'failed';
        };
      };
    };
  };
};
