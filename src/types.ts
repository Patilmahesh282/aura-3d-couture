export type Category = 'hoodies' | 'tees' | 'jackets' | 'pants' | 'sneakers' | 'blazers';

export type Size = 'S' | 'M' | 'L' | 'XL';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface StockPerSize {
  S: number;
  M: number;
  L: number;
  XL: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  originalPrice?: number;
  description: string;
  materials: string[];
  stock: StockPerSize;
  colors: ColorOption[];
  defaultColor: string;
  modelType: 'hoodie' | 'shirt' | 'jacket' | 'pants' | 'sneaker' | 'blazer';
  decalOptions?: string[];
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  imageUrl?: string;
  realPhotos360?: string[];
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  name: string;
  category: Category;
  price: number;
  size: Size;
  selectedColor: string;
  colorName: string;
  decal?: string;
  quantity: number;
  maxStockAvailable: number;
  modelType: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  auraPoints: number;
  savedAddresses?: Array<{
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: Size;
  color: string;
}

export type OrderStatus = 'Processing' | 'Quality Check' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: 'card' | 'applepay' | 'crypto';
  paymentStatus: 'paid' | 'pending' | 'failed';
  transactionId: string;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
}

export interface InventoryUpdateMessage {
  type: 'INVENTORY_UPDATE' | 'FLASH_SALE' | 'STOCK_LOW';
  productId: string;
  stock: StockPerSize;
  message?: string;
  timestamp: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}
