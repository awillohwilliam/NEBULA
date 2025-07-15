import React, { useState } from 'react';
import Header from './components/Header';
import ServiceSelector from './components/ServiceSelector';
import AirtimeForm from './components/AirtimeForm';
import BundleForm from './components/BundleForm';
import TransactionHistory from './components/TransactionHistory';
import { Transaction } from './types';

function App() {
  const [activeService, setActiveService] = useState<'airtime' | 'bundle'>('airtime');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to <span className="text-purple-600">NebulaNeT</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Purchase airtime and data bundles at unbeatable prices
          </p>
        </div>

        <ServiceSelector 
          activeService={activeService} 
          onServiceChange={setActiveService} 
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeService === 'airtime' ? (
              <AirtimeForm onTransaction={addTransaction} />
            ) : (
              <BundleForm onTransaction={addTransaction} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;