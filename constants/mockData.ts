import { Product, Order } from '../types';

export const CATEGORIES = ['All', 'Food', 'Drinks', 'Snacks', 'Electronics', 'Pharmacy'];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Burger', price: 5.99, category: 'Food', stock: 50, emoji: '🍔' },
  { id: '2', name: 'Pizza', price: 8.99, category: 'Food', stock: 30, emoji: '🍕' },
  { id: '3', name: 'Cola', price: 1.99, category: 'Drinks', stock: 100, emoji: '🥤' },
  { id: '4', name: 'Water', price: 0.99, category: 'Drinks', stock: 200, emoji: '💧' },
  { id: '5', name: 'Chips', price: 2.49, category: 'Snacks', stock: 80, emoji: '🍟' },
  { id: '6', name: 'Coffee', price: 3.49, category: 'Drinks', stock: 60, emoji: '☕' },
  { id: '7', name: 'Sandwich', price: 4.99, category: 'Food', stock: 40, emoji: '🥪' },
  { id: '8', name: 'Ice Cream', price: 3.99, category: 'Snacks', stock: 25, emoji: '🍦' },
  { id: '9', name: 'Paracetamol', price: 2.99, category: 'Pharmacy', stock: 150, emoji: '💊' },
  { id: '10', name: 'Vitamin C', price: 4.99, category: 'Pharmacy', stock: 90, emoji: '🌿' },
  { id: '11', name: 'USB Cable', price: 9.99, category: 'Electronics', stock: 35, emoji: '🔌' },
  { id: '12', name: 'Earphones', price: 14.99, category: 'Electronics', stock: 20, emoji: '🎧' },
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[2], quantity: 2 },
    ],
    total: 15.96,
    discount: 0,
    finalTotal: 15.96,
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'completed',
  },
  {
    id: 'ORD-002',
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 1 },
      { product: INITIAL_PRODUCTS[5], quantity: 2 },
    ],
    total: 15.97,
    discount: 1.00,
    finalTotal: 14.97,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'completed',
  },
  {
    id: 'ORD-003',
    items: [
      { product: INITIAL_PRODUCTS[6], quantity: 3 },
      { product: INITIAL_PRODUCTS[3], quantity: 1 },
    ],
    total: 15.96,
    discount: 0,
    finalTotal: 15.96,
    paymentMethod: 'mobile',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'completed',
  },
];
