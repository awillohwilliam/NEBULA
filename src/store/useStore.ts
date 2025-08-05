import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  balance: number;
  tier: 'basic' | 'premium' | 'vip';
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Transaction state
  transactions: Transaction[];
  totalSavings: number;
  
  // UI state
  activeService: 'airtime' | 'bundle';
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }>;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  addTransaction: (transaction: Transaction) => void;
  setActiveService: (service: 'airtime' | 'bundle') => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  updateTotalSavings: (amount: number) => void;
  clearTransactions: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      transactions: [],
      totalSavings: 0,
      activeService: 'airtime',
      isLoading: false,
      notifications: [],

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
        
        // Initialize user if not exists
        if (!get().user) {
          set({
            user: {
              id: 'user-1',
              email: 'user@example.com',
              name: 'John Doe',
              phoneNumber: '08012345678',
              balance: 5000,
              tier: 'basic',
            },
            isAuthenticated: true,
          });
        }
      },
      
      setActiveService: (activeService) => set({ activeService }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          get().removeNotification(newNotification.id);
        }, 5000);
      },
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
      
      updateTotalSavings: (amount) => set((state) => ({
        totalSavings: state.totalSavings + amount,
      })),
      
      clearTransactions: () => set({ transactions: [], totalSavings: 0 }),
    }),
    {
      name: 'nebulanet-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        transactions: state.transactions,
        totalSavings: state.totalSavings,
      }),
    }
  )
);