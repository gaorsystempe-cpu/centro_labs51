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

// NUEVAS INTERFACES PARA EL ESQUEMA DE PRODUCTOS
export interface Category {
  id: string;
  store_id: string;
  name: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  attributes: Record<string, string>; // e.g., { "Talla": "M", "Color": "Rojo" }
  price_override?: number;
  stock: number;
  sku?: string;
  image_url?: string;
}

// INTERFAZ DE PRODUCTO ACTUALIZADA
export interface Product {
  id: string;
  store_id: string;
  category_id?: string;
  name: string;
  description?: string;
  selling_price: number;
  image_urls?: string[];
  is_active: boolean;
  created_at: string;
}

// TIPO COMBINADO PARA FACILITAR EL MANEJO DE DATOS
export interface ProductWithVariants extends Product {
  product_variants: ProductVariant[];
  categories?: Category; // Supabase puede unir esto por nosotros
}
// FIN DE NUEVAS INTERFACES

export interface Order {
  id: string;
  store_id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

// INTERFAZ DE CARTITEM ACTUALIZADA
export interface CartItem {
  id: string; // ID de la variante
  productId: string; // ID del producto padre
  name: string; // Nombre del producto padre
  attributes: Record<string, string>;
  price: number; // Precio final de esta variante
  imageUrl?: string;
  quantity: number;
}
