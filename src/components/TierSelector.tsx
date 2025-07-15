import React from 'react';
import { Crown, Star, Zap } from 'lucide-react';
import { AirtimeTier } from '../types';
import { airtimeTiers } from '../data/tiers';

interface TierSelectorProps {
  selectedTier: AirtimeTier;
  onTierChange: (tier: AirtimeTier) => void;
}

const TierSelector: React.FC<TierSelectorProps> = ({ selectedTier, onTierChange }) => {
  const getIcon = (tierId: string) => {
    switch (tierId) {
      case 'basic': return <Zap className="w-5 h-5" />;
      case 'premium': return <Star className="w-5 h-5" />;
      case 'vip': return <Crown className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getColorClasses = (tierId: string, isSelected: boolean) => {
    const colors = {
      basic: isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300',
      premium: isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300',
      vip: isSelected ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'
    };
    return colors[tierId as keyof typeof colors] || colors.basic;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Choose Your Tier
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {airtimeTiers.map((tier) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => onTierChange(tier)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
              getColorClasses(tier.id, selectedTier.id === tier.id)
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              {getIcon(tier.id)}
              <span className="font-semibold">{tier.name}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm opacity-90">{tier.description}</p>
              <p className="text-lg font-bold">{tier.discount}% OFF</p>
              <p className="text-xs opacity-75">Min: ₦{tier.minAmount}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TierSelector;