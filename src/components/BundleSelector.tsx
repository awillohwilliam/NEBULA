import React from 'react';
import { BundleOption } from '../types';
import { bundleOptions } from '../data/bundles';

interface BundleSelectorProps {
  selectedBundle: BundleOption;
  onBundleChange: (bundle: BundleOption) => void;
}

const BundleSelector: React.FC<BundleSelectorProps> = ({ selectedBundle, onBundleChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Data Bundle
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundleOptions.map((bundle) => (
          <button
            key={bundle.id}
            type="button"
            onClick={() => onBundleChange(bundle)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
              selectedBundle.id === bundle.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg text-gray-800">{bundle.size}</span>
              <div className="text-right">
                <p className="text-sm text-gray-500 line-through">₦{bundle.originalPrice}</p>
                <p className="font-bold text-blue-600">₦{bundle.discountedPrice}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{bundle.validity}</p>
            <p className="text-xs text-gray-500">{bundle.description}</p>
            <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Save ₦{bundle.originalPrice - bundle.discountedPrice}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BundleSelector;