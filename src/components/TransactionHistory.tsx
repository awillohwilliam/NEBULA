import React from 'react';
import { Clock, CheckCircle, XCircle, Smartphone, Wifi } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">Your purchase history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {transaction.type === 'airtime' ? (
                  <Smartphone className="w-4 h-4 text-purple-600" />
                ) : (
                  <Wifi className="w-4 h-4 text-blue-600" />
                )}
                <span className="font-medium text-gray-800 capitalize">
                  {transaction.type}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {getStatusIcon(transaction.status)}
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Network:</span> {transaction.network}</p>
              <p><span className="font-medium">Phone:</span> {transaction.phoneNumber}</p>
              {transaction.tier && (
                <p><span className="font-medium">Tier:</span> {transaction.tier}</p>
              )}
              {transaction.bundleSize && (
                <p><span className="font-medium">Bundle:</span> {transaction.bundleSize}</p>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {transaction.timestamp.toLocaleString()}
                </span>
                <span className="font-bold text-gray-800">₦{transaction.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;