export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  emoji: string;
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
  createdAt: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface DailySales {
  date: string;
  total: number;
  orderCount: number;
}
