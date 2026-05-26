import { create } from 'zustand';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants/mockData';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: INITIAL_PRODUCTS,
  addProduct: (productData) => set((state) => ({
    products: [...state.products, { ...productData, id: Date.now().toString() }],
  })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),
}));
