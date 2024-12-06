import { Product } from '../../store/services/productService';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedModifiers: Array<{
    name: string;
    option: {
      name: string;
      price: number;
    };
  }>;
  selectedDiscounts: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
  }>;
}

export interface Sale {
  _id: string;
  store: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    modifiers: Array<{
      name: string;
      option: {
        name: string;
        price: number;
      };
    }>;
    discounts: Array<{
      name: string;
      type: 'percentage' | 'fixed';
      value: number;
    }>;
    price: number;
  }>;
  total: number;
  paymentMethod: 'cash' | 'card' | 'qr';
  paymentDetails: any;
  status: 'completed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}