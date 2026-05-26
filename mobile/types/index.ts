export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  emoji: string;
  barcode?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  customerId?: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  balance: number;
  totalPurchases: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  company: string;
  totalPurchased: number;
  createdAt: string;
}

export interface Purchase {
  id: string;
  supplierId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: 'Rent' | 'Utilities' | 'Salaries' | 'Marketing' | 'Supplies' | 'Other';
  amount: number;
  note: string;
  createdAt: string;
}
