import React from 'react';
import { networkProviders } from '../data/networks';

interface NetworkSelectorProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ selectedNetwork, onNetworkChange }) => {
  const getSelectedStyles = (color: string) => {
    const styles = {
      yellow: 'border-yellow-500 bg-yellow-50 shadow-md',
      red: 'border-red-500 bg-red-50 shadow-md',
      green: 'border-green-500 bg-green-50 shadow-md',
      emerald: 'border-emerald-500 bg-emerald-50 shadow-md'
    };
    return styles[color as keyof typeof styles] || styles.yellow;
  };

  const getIconStyles = (color: string) => {
    const styles = {
      yellow: 'bg-yellow-100',
      red: 'bg-red-100',
      green: 'bg-green-100',
      emerald: 'bg-emerald-100'
    };
    return styles[color as keyof typeof styles] || styles.yellow;
  };

  const getTextStyles = (color: string) => {
    const styles = {
      yellow: 'text-yellow-600',
      red: 'text-red-600',
      green: 'text-green-600',
      emerald: 'text-emerald-600'
    };
    return styles[color as keyof typeof styles] || styles.yellow;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Network Provider
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {networkProviders.map((network) => (
          <button
            key={network.id}
            type="button"
            onClick={() => onNetworkChange(network.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              selectedNetwork === network.id
                ? getSelectedStyles(network.color)
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 rounded-full ${getIconStyles(network.color)} flex items-center justify-center`}>
                <span className={`${getTextStyles(network.color)} font-bold text-lg`}>
                  {network.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{network.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;