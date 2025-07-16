import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useNetworks } from '../hooks/useNetworks';

const NetworkStatus: React.FC = () => {
  const { networkBalances, isLoading, error, refetch } = useNetworks();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600">Checking network status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">Network status unavailable</span>
          </div>
          <button
            onClick={() => refetch()}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-800">Network Status</h3>
        <button
          onClick={() => refetch()}
          className="text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {networkBalances?.map((network) => (
          <div key={network.network} className="flex items-center space-x-2">
            {network.status === 'active' ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <div>
              <p className="text-xs font-medium text-gray-700">{network.network}</p>
              <p className="text-xs text-gray-500">₦{network.balance.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkStatus;