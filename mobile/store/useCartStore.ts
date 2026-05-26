import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  discount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (discount: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getFinalTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  addItem: (product) => set((state) => {
    const existing = state.items.find((i) => i.product.id === product.id);
    if (existing) {
      return { items: state.items.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { product, quantity: 1 }] };
  }),
  removeItem: (productId) => set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) return { items: state.items.filter((i) => i.product.id !== productId) };
    return { items: state.items.map((i) => i.product.id === productId ? { ...i, quantity } : i) };
  }),
  setDiscount: (discount) => set({ discount }),
  clearCart: () => set({ items: [], discount: 0 }),
  getTotal: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  getFinalTotal: () => Math.max(0, get().getTotal() - get().discount),
}));
