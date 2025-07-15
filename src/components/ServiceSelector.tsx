import React from 'react';
import { Smartphone, Wifi } from 'lucide-react';

interface ServiceSelectorProps {
  activeService: 'airtime' | 'bundle';
  onServiceChange: (service: 'airtime' | 'bundle') => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ activeService, onServiceChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => onServiceChange('airtime')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeService === 'airtime'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span>Airtime</span>
          </button>
          
          <button
            onClick={() => onServiceChange('bundle')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeService === 'bundle'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Wifi className="w-5 h-5" />
            <span>Data Bundle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;