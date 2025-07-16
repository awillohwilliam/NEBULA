import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ServiceSelector from './components/ServiceSelector';
import AirtimeForm from './components/AirtimeForm';
import BundleForm from './components/BundleForm';
import TransactionHistory from './components/TransactionHistory';
import NotificationSystem from './components/NotificationSystem';
import { useStore } from './store/useStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { activeService, setActiveService, transactions, totalSavings } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
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
            {totalSavings > 0 && (
              <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <span className="font-semibold">Total Savings: ₦{totalSavings.toFixed(2)}</span>
              </div>
            )}
          </div>

          <ServiceSelector 
            activeService={activeService} 
            onServiceChange={setActiveService} 
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeService === 'airtime' ? (
                <AirtimeForm />
              ) : (
                <BundleForm />
              )}
            </div>
            
            <div className="lg:col-span-1">
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        </main>
        
        <NotificationSystem />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;