export type Role = 'ROOT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock purposes, in real app this would not be sent to client
  role: Role;
  storeId?: string;
}

export enum TemplateName {
  MINIMAL_MODERN = "Minimal Modern",
  VIBRANT_STORE = "Vibrant Store",
  ORGANIC_NATURAL = "Organic & Natural",
  TECH_STORE = "Tech Store",
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
}

export interface PaymentMethodDetails {
  holder: string;
  number: string;
}

export interface PaymentInfo {
  yape: PaymentMethodDetails;
  plin: PaymentMethodDetails;
}

export interface Store {
  id: string;
  name: string;
  owner: string;
  status: 'active' | 'suspended';
  plan: 'basic' | 'premium';
  createdAt: string;
  template: TemplateName;
  theme: Theme;
  logoUrl?: string;
  currency: 'PEN' | 'USD';
  whatsappNumber: string; // e.g., '51987654321' (country code + number)
  paymentInfo: PaymentInfo;
}

export interface Product {
  id: string;
  storeId: string;
  name:string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: { productId: string; quantity: number; name: string; price: number }[];
}

// New type for items in the shopping cart
export interface CartItem extends Product {
  quantity: number;
}