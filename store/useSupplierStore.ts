import { create } from 'zustand';
import { Supplier, Purchase } from '../types';
import { SAMPLE_SUPPLIERS } from '../constants/mockData';

interface SupplierState {
  suppliers: Supplier[];
  purchases: Purchase[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchased'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: SAMPLE_SUPPLIERS,
  purchases: [],

  addSupplier: (data) => set((state) => ({
    suppliers: [
      ...state.suppliers,
      {
        ...data,
        id: `S${String(state.suppliers.length + 1).padStart(3, '0')}`,
        totalPurchased: 0,
        createdAt: new Date().toISOString(),
      },
    ],
  })),

  updateSupplier: (id, updates) => set((state) => ({
    suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  })),

  deleteSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter((s) => s.id !== id),
  })),

  addPurchase: (purchaseData) => set((state) => {
    const purchase: Purchase = {
      ...purchaseData,
      id: `P${String(state.purchases.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    return {
      purchases: [purchase, ...state.purchases],
      suppliers: state.suppliers.map((s) =>
        s.id === purchaseData.supplierId
          ? { ...s, totalPurchased: s.totalPurchased + purchaseData.totalCost }
          : s
      ),
    };
  }),
}));
