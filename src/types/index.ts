export interface Transaction {
  id: string;
  type: 'airtime' | 'bundle';
  network: string;
  phoneNumber: string;
  amount: number;
  tier?: string;
  bundleSize?: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
}

export interface NetworkProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface AirtimeTier {
  id: string;
  name: string;
  discount: number;
  minAmount: number;
  description: string;
}

export interface BundleOption {
  id: string;
  size: string;
  originalPrice: number;
  discountedPrice: number;
  validity: string;
  description: string;
}