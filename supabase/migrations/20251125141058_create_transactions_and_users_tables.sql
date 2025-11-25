/*
  # Create NebulaNeT Database Schema

  ## New Tables
  
  ### `users`
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email address
  - `name` (text) - User full name
  - `phone_number` (text) - User phone number
  - `balance` (numeric) - User account balance
  - `tier` (text) - User tier: basic, premium, or vip
  - `total_savings` (numeric) - Total savings accumulated
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `transactions`
  - `id` (uuid, primary key) - Unique transaction identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `type` (text) - Transaction type: airtime or bundle
  - `network` (text) - Network provider
  - `phone_number` (text) - Recipient phone number
  - `amount` (numeric) - Transaction amount
  - `original_amount` (numeric) - Original amount before discount
  - `discount_percentage` (numeric) - Discount applied
  - `tier` (text) - Tier used for transaction
  - `bundle_id` (text) - Bundle ID if applicable
  - `bundle_size` (text) - Bundle size if applicable
  - `status` (text) - Transaction status: completed, pending, failed
  - `reference` (text, unique) - Transaction reference number
  - `created_at` (timestamptz) - Transaction timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  phone_number text DEFAULT '',
  balance numeric DEFAULT 0,
  tier text DEFAULT 'basic' CHECK (tier IN ('basic', 'premium', 'vip')),
  total_savings numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('airtime', 'bundle')),
  network text NOT NULL,
  phone_number text NOT NULL,
  amount numeric NOT NULL,
  original_amount numeric NOT NULL,
  discount_percentage numeric DEFAULT 0,
  tier text DEFAULT 'basic',
  bundle_id text,
  bundle_size text,
  status text DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
  reference text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Create updated_at trigger for users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
