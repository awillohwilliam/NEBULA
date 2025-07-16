import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useNetworks = () => {
  const {
    data: networkBalances,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['network-balances'],
    queryFn: apiService.getNetworkBalances,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  const verifyPhoneNumber = async (phoneNumber: string, network: string) => {
    try {
      const result = await apiService.verifyPhoneNumber(phoneNumber, network);
      return result;
    } catch (error) {
      console.error('Phone verification failed:', error);
      return { valid: false, carrier: '' };
    }
  };

  return {
    networkBalances,
    isLoading,
    error,
    refetch,
    verifyPhoneNumber,
  };
};