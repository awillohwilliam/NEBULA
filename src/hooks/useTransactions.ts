import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, AirtimePurchaseRequest, BundlePurchaseRequest } from '../services/api';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const { addTransaction, addNotification, updateTotalSavings } = useStore();

  // Fetch transaction history
  const {
    data: transactionHistory,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.getTransactionHistory(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Purchase airtime mutation
  const purchaseAirtimeMutation = useMutation({
    mutationFn: (data: AirtimePurchaseRequest) => apiService.purchaseAirtime(data),
    onSuccess: (response, variables) => {
      const transaction = {
        id: response.id,
        type: 'airtime' as const,
        network: variables.network,
        phoneNumber: variables.phoneNumber,
        amount: variables.amount,
        tier: variables.tier,
        status: response.status === 'success' ? 'completed' as const : 'pending' as const,
        timestamp: new Date(),
      };

      addTransaction(transaction);
      
      if (response.status === 'success') {
        toast.success(`Airtime purchase successful! ₦${variables.amount} sent to ${variables.phoneNumber}`);
        addNotification({
          type: 'success',
          message: `₦${variables.amount} airtime sent to ${variables.phoneNumber}`,
        });
        
        // Calculate and update savings
        const originalAmount = variables.amount / (1 - (variables.tier === 'basic' ? 0.02 : variables.tier === 'premium' ? 0.05 : 0.08));
        const savings = originalAmount - variables.amount;
        updateTotalSavings(savings);
      } else {
        toast.info('Transaction is being processed...');
      }

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to purchase airtime';
      toast.error(message);
      addNotification({
        type: 'error',
        message,
      });
    },
  });

  // Purchase bundle mutation
  const purchaseBundleMutation = useMutation({
    mutationFn: (data: BundlePurchaseRequest) => apiService.purchaseBundle(data),
    onSuccess: (response, variables) => {
      const transaction = {
        id: response.id,
        type: 'bundle' as const,
        network: variables.network,
        phoneNumber: variables.phoneNumber,
        amount: response.amount,
        bundleSize: variables.bundleId,
        status: response.status === 'success' ? 'completed' as const : 'pending' as const,
        timestamp: new Date(),
      };

      addTransaction(transaction);
      
      if (response.status === 'success') {
        toast.success(`Data bundle activated! Sent to ${variables.phoneNumber}`);
        addNotification({
          type: 'success',
          message: `Data bundle activated for ${variables.phoneNumber}`,
        });
      } else {
        toast.info('Transaction is being processed...');
      }

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to purchase data bundle';
      toast.error(message);
      addNotification({
        type: 'error',
        message,
      });
    },
  });

  return {
    transactionHistory,
    isLoadingHistory,
    historyError,
    purchaseAirtime: purchaseAirtimeMutation.mutate,
    purchaseBundle: purchaseBundleMutation.mutate,
    isPurchasingAirtime: purchaseAirtimeMutation.isPending,
    isPurchasingBundle: purchaseBundleMutation.isPending,
  };
};