import { create } from 'zustand';
import { Order, CartItem } from '../types';
import { SAMPLE_ORDERS } from '../constants/mockData';

interface OrderState {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, discount: number, paymentMethod: Order['paymentMethod']) => Order;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: SAMPLE_ORDERS,
  addOrder: (items, total, discount, paymentMethod) => {
    const order: Order = {
      id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
      items, total, discount,
      finalTotal: Math.max(0, total - discount),
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'completed',
    };
    set((state) => ({ orders: [order, ...state.orders] }));
    return order;
  },
}));
