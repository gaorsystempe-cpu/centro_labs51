// Fix: Replaced incorrect file content with proper type definitions.
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ROOT' | 'ADMIN';
  storeId?: string;
}

export enum TemplateName {
  MINIMAL_MODERN = 'Minimal Modern',
  VIBRANT_STORE = 'Vibrant Store',
  ORGANIC_NATURAL = 'Organic & Natural',
  TECH_STORE = 'Tech Store',
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
}

export interface Store {
  id: string;
  createdAt: string;
  name: string;
  owner: string;
  status: 'active' | 'suspended';
  plan: 'basic' | 'premium';
  template: TemplateName;
  currency: 'PEN' | 'USD';
  whatsappNumber: string;
  paymentInfo: {
    yape: { holder: string; number: string };
    plin: { holder: string; number: string };
  };
  theme: Theme;
  adminEmail?: string;
  logoUrl?: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface Order {
  id: string;
  store_id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export interface CartItem extends Product {
  quantity: number;
}
