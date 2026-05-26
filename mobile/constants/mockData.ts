import { Product, Order, Customer, Supplier, Expense } from '../types';

export const CATEGORIES = ['All', 'Food', 'Drinks', 'Snacks', 'Electronics', 'Pharmacy'];
export const EXPENSE_CATEGORIES = ['Rent', 'Utilities', 'Salaries', 'Marketing', 'Supplies', 'Other'];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Burger', price: 5.99, category: 'Food', stock: 50, emoji: '🍔', barcode: '1234567890' },
  { id: '2', name: 'Pizza', price: 8.99, category: 'Food', stock: 30, emoji: '🍕', barcode: '1234567891' },
  { id: '3', name: 'Cola', price: 1.99, category: 'Drinks', stock: 100, emoji: '🥤', barcode: '1234567892' },
  { id: '4', name: 'Water', price: 0.99, category: 'Drinks', stock: 200, emoji: '💧', barcode: '1234567893' },
  { id: '5', name: 'Chips', price: 2.49, category: 'Snacks', stock: 80, emoji: '🍟', barcode: '1234567894' },
  { id: '6', name: 'Coffee', price: 3.49, category: 'Drinks', stock: 60, emoji: '☕', barcode: '1234567895' },
  { id: '7', name: 'Sandwich', price: 4.99, category: 'Food', stock: 40, emoji: '🥪', barcode: '1234567896' },
  { id: '8', name: 'Ice Cream', price: 3.99, category: 'Snacks', stock: 25, emoji: '🍦', barcode: '1234567897' },
  { id: '9', name: 'Paracetamol', price: 2.99, category: 'Pharmacy', stock: 150, emoji: '💊', barcode: '1234567898' },
  { id: '10', name: 'Vitamin C', price: 4.99, category: 'Pharmacy', stock: 90, emoji: '🌿', barcode: '1234567899' },
  { id: '11', name: 'USB Cable', price: 9.99, category: 'Electronics', stock: 35, emoji: '🔌', barcode: '1234567800' },
  { id: '12', name: 'Earphones', price: 14.99, category: 'Electronics', stock: 20, emoji: '🎧', barcode: '1234567801' },
];

export const SAMPLE_CUSTOMERS: Customer[] = [
  { id: 'C001', name: 'Ahmed Mohamed', phone: '+252 61 234 5678', address: 'Mogadishu, Somalia', balance: 15.50, totalPurchases: 245.00, createdAt: '2025-01-10T08:00:00Z' },
  { id: 'C002', name: 'Fatima Ali', phone: '+252 61 345 6789', address: 'Hargeisa, Somalia', balance: 0, totalPurchases: 178.50, createdAt: '2025-01-12T08:00:00Z' },
  { id: 'C003', name: 'Omar Hassan', phone: '+252 61 456 7890', address: 'Kismayo, Somalia', balance: -5.00, totalPurchases: 89.99, createdAt: '2025-01-15T08:00:00Z' },
  { id: 'C004', name: 'Hodan Ibrahim', phone: '+252 61 567 8901', address: 'Bosaso, Somalia', balance: 32.00, totalPurchases: 412.75, createdAt: '2025-01-18T08:00:00Z' },
];

export const SAMPLE_SUPPLIERS: Supplier[] = [
  { id: 'S001', name: 'Abdi Warsame', phone: '+252 61 111 2222', company: 'Fresh Foods Ltd', totalPurchased: 1200.00, createdAt: '2025-01-05T08:00:00Z' },
  { id: 'S002', name: 'Nasra Osman', phone: '+252 61 222 3333', company: 'Drinks Wholesale Co', totalPurchased: 850.00, createdAt: '2025-01-06T08:00:00Z' },
  { id: 'S003', name: 'Yusuf Noor', phone: '+252 61 333 4444', company: 'Tech Supplies Inc', totalPurchased: 3200.00, createdAt: '2025-01-07T08:00:00Z' },
];

export const SAMPLE_EXPENSES: Expense[] = [
  { id: 'E001', category: 'Rent', amount: 500.00, note: 'Monthly shop rent', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: 'E002', category: 'Utilities', amount: 75.00, note: 'Electricity bill', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: 'E003', category: 'Salaries', amount: 800.00, note: 'Staff salaries', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: 'E004', category: 'Supplies', amount: 45.00, note: 'Packaging materials', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() },
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    items: [{ product: INITIAL_PRODUCTS[0], quantity: 2 }, { product: INITIAL_PRODUCTS[2], quantity: 2 }],
    total: 15.96, discount: 0, finalTotal: 15.96,
    paymentMethod: 'cash', customerId: 'C001',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: 'completed',
  },
  {
    id: 'ORD-002',
    items: [{ product: INITIAL_PRODUCTS[1], quantity: 1 }, { product: INITIAL_PRODUCTS[5], quantity: 2 }],
    total: 15.97, discount: 1.00, finalTotal: 14.97,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: 'completed',
  },
  {
    id: 'ORD-003',
    items: [{ product: INITIAL_PRODUCTS[6], quantity: 3 }, { product: INITIAL_PRODUCTS[3], quantity: 1 }],
    total: 15.96, discount: 0, finalTotal: 15.96,
    paymentMethod: 'mobile', customerId: 'C002',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), status: 'completed',
  },
];
