import React from 'react';
import { networkProviders } from '../data/networks';

interface NetworkSelectorProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ selectedNetwork, onNetworkChange }) => {
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
                ? `border-${network.color}-500 bg-${network.color}-50 shadow-md`
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 rounded-full bg-${network.color}-100 flex items-center justify-center`}>
                <span className={`text-${network.color}-600 font-bold text-lg`}>
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