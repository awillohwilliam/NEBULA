import React, { useState } from 'react';
import { Phone, CreditCard, Zap } from 'lucide-react';
import NetworkSelector from './NetworkSelector';
import TierSelector from './TierSelector';
import { Transaction } from '../types';
import { airtimeTiers } from '../data/tiers';

interface AirtimeFormProps {
  onTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

const AirtimeForm: React.FC<AirtimeFormProps> = ({ onTransaction }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState(airtimeTiers[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateDiscountedAmount = () => {
    const baseAmount = parseFloat(amount) || 0;
    const discount = (baseAmount * selectedTier.discount) / 100;
    return baseAmount - discount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNetwork || !phoneNumber || !amount) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onTransaction({
      type: 'airtime',
      network: selectedNetwork,
      phoneNumber,
      amount: calculateDiscountedAmount(),
      tier: selectedTier.name,
      status: 'completed'
    });

    setIsProcessing(false);
    setPhoneNumber('');
    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Phone className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Buy Airtime</h2>
          <p className="text-gray-600">Instant airtime top-up with great discounts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <NetworkSelector 
          selectedNetwork={selectedNetwork}
          onNetworkChange={setSelectedNetwork}
        />

        <TierSelector 
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₦)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min={selectedTier.minAmount}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum amount: ₦{selectedTier.minAmount}
          </p>
        </div>

        {amount && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Original Amount:</span>
              <span className="font-medium">₦{amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Discount ({selectedTier.discount}%):</span>
              <span className="text-green-600 font-medium">-₦{((parseFloat(amount) || 0) * selectedTier.discount / 100).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-green-200 pt-2 mt-2">
              <span className="text-gray-800 font-semibold">You Pay:</span>
              <span className="text-green-600 font-bold text-lg">₦{calculateDiscountedAmount().toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !selectedNetwork || !phoneNumber || !amount}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Buy Airtime</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AirtimeForm;