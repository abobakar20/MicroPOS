import { create } from 'zustand';
import { Customer } from '../types';
import { SAMPLE_CUSTOMERS } from '../constants/mockData';

interface CustomerState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: SAMPLE_CUSTOMERS,
  addCustomer: (data) => set((state) => ({
    customers: [...state.customers, { ...data, id: `C${String(state.customers.length + 1).padStart(3, '0')}`, totalPurchases: 0, createdAt: new Date().toISOString() }],
  })),
  updateCustomer: (id, updates) => set((state) => ({ customers: state.customers.map((c) => c.id === id ? { ...c, ...updates } : c) })),
  deleteCustomer: (id) => set((state) => ({ customers: state.customers.filter((c) => c.id !== id) })),
}));
