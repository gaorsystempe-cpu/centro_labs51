import type { Store, Product, Order, User } from '../types';
import { TemplateName } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user-root', name: 'Super Admin', role: 'ROOT', email: 'root@labs51.pe', password: 'root123' },
  { id: 'user-admin-1', name: 'Ana García', role: 'ADMIN', storeId: 'store-1', email: 'ana.garcia@labs51.pe', password: 'ana123' },
  { id: 'user-admin-2', name: 'Juan Pérez', role: 'ADMIN', storeId: 'store-2', email: 'juan.perez@labs51.pe', password: 'juan123' },
  { id: 'user-admin-3', name: 'María Rodriguez', role: 'ADMIN', storeId: 'store-3', email: 'maria.rodriguez@labs51.pe', password: 'maria123' },
  { id: 'user-admin-4', name: 'Carlos López', role: 'ADMIN', storeId: 'store-4', email: 'carlos.lopez@labs51.pe', password: 'carlos123' },
];


export const MOCK_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Aura Ropa',
    owner: 'Ana García',
    status: 'active',
    plan: 'premium',
    createdAt: '2023-01-15',
    template: TemplateName.MINIMAL_MODERN,
    logoUrl: 'https://picsum.photos/seed/logo1/200/100',
    currency: 'PEN',
    whatsappNumber: '51987654321',
    paymentInfo: {
      yape: { holder: 'Ana M. García', number: '987 654 321' },
      plin: { holder: 'Ana M. García', number: '987 654 321' },
    },
    theme: {
      primaryColor: '#1a202c',
      secondaryColor: '#a0aec0',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      font: 'Inter'
    }
  },
  {
    id: 'store-2',
    name: 'Gadget Manía',
    owner: 'Juan Pérez',
    status: 'active',
    plan: 'premium',
    createdAt: '2023-03-22',
    template: TemplateName.VIBRANT_STORE,
    logoUrl: 'https://picsum.photos/seed/logo2/200/100',
    currency: 'PEN',
    whatsappNumber: '51912345678',
    paymentInfo: {
      yape: { holder: 'Juan C. Pérez', number: '912 345 678' },
      plin: { holder: 'Juan C. Pérez', number: '912 345 678' },
    },
    theme: {
      primaryColor: '#4c51bf',
      secondaryColor: '#ed64a6',
      backgroundColor: '#f7fafc',
      textColor: '#1a202c',
      font: 'Inter'
    }
  },
  {
    id: 'store-3',
    name: 'Terra Bloom',
    owner: 'María Rodriguez',
    status: 'active',
    plan: 'basic',
    createdAt: '2023-05-10',
    template: TemplateName.ORGANIC_NATURAL,
    logoUrl: 'https://picsum.photos/seed/logo3/200/100',
    currency: 'PEN',
    whatsappNumber: '51955558888',
    paymentInfo: {
      yape: { holder: 'María F. Rodriguez', number: '955 558 888' },
      plin: { holder: 'María F. Rodriguez', number: '955 558 888' },
    },
    theme: {
      primaryColor: '#38a169',
      secondaryColor: '#dd6b20',
      backgroundColor: '#f0fff4',
      textColor: '#2f4f4f',
      font: 'Inter'
    }
  },
  {
    id: 'store-4',
    name: 'Cyber Circuito',
    owner: 'Carlos López',
    status: 'suspended',
    plan: 'basic',
    createdAt: '2023-07-01',
    template: TemplateName.TECH_STORE,
    logoUrl: 'https://picsum.photos/seed/logo4/200/100',
    currency: 'PEN',
    whatsappNumber: '51999888777',
    paymentInfo: {
      yape: { holder: 'Carlos A. López', number: '999 888 777' },
      plin: { holder: 'Carlos A. López', number: '999 888 777' },
    },
    theme: {
      primaryColor: '#00c5c8',
      secondaryColor: '#ff005d',
      backgroundColor: '#121212',
      textColor: '#e0e0e0',
      font: 'Inter'
    }
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // Tienda 1: Aura Ropa
  { id: 'p1-1', storeId: 'store-1', name: 'Polo Blanco Clásico', description: 'Un clásico atemporal, hecho de 100% algodón orgánico.', price: 89.90, imageUrl: 'https://picsum.photos/seed/p1-1/600/600', category: 'Polos', stock: 150 },
  { id: 'p1-2', storeId: 'store-1', name: 'Pantalones de Lino', description: 'Ligeros y transpirables, perfectos para el verano.', price: 179.90, imageUrl: 'https://picsum.photos/seed/p1-2/600/600', category: 'Pantalones', stock: 80 },
  { id: 'p1-3', storeId: 'store-1', name: 'Bufanda de Seda', description: 'Un accesorio de lujo para elevar cualquier atuendo.', price: 129.90, imageUrl: 'https://picsum.photos/seed/p1-3/600/600', category: 'Accesorios', stock: 200 },
  { id: 'p1-4', storeId: 'store-1', name: 'Chaqueta de Jean', description: 'Una prenda versátil para cualquier guardarropa.', price: 249.90, imageUrl: 'https://picsum.photos/seed/p1-4/600/600', category: 'Abrigos', stock: 60 },

  // Tienda 2: Gadget Manía
  { id: 'p2-1', storeId: 'store-2', name: 'Auriculares Inalámbricos Pro', description: 'Sonido cristalino con cancelación activa de ruido.', price: 499.00, imageUrl: 'https://picsum.photos/seed/p2-1/600/600', category: 'Audio', stock: 120 },
  { id: 'p2-2', storeId: 'store-2', name: 'Smartwatch Serie 5', description: 'Monitorea tu actividad física y mantente conectado.', price: 899.50, imageUrl: 'https://picsum.photos/seed/p2-2/600/600', category: 'Vestibles', stock: 90 },
  { id: 'p2-3', storeId: 'store-2', name: 'Batería Portátil', description: '20,000mAh para cargar tus dispositivos en cualquier lugar.', price: 159.00, imageUrl: 'https://picsum.photos/seed/p2-3/600/600', category: 'Accesorios', stock: 300 },
  { id: 'p2-4', storeId: 'store-2', name: 'Mouse Gamer RGB', description: 'Precisión y luces personalizables para gamers.', price: 219.90, imageUrl: 'https://picsum.photos/seed/p2-4/600/600', category: 'Gaming', stock: 110 },

  // Tienda 3: Terra Bloom
  { id: 'p3-1', storeId: 'store-3', name: 'Vela de Soya y Lavanda', description: 'Hecha a mano con aceites esenciales para la relajación.', price: 65.00, imageUrl: 'https://picsum.photos/seed/p3-1/600/600', category: 'Hogar', stock: 180 },
  { id: 'p3-2', storeId: 'store-3', name: 'Té Verde Orgánico', description: 'Una mezcla refrescante y saludable de hojas de té verde.', price: 45.00, imageUrl: 'https://picsum.photos/seed/p3-2/600/600', category: 'Alimentos y Bebidas', stock: 250 },
  { id: 'p3-3', storeId: 'store-3', name: 'Set de Cepillos de Bambú', description: 'Alternativa ecológica a los cepillos de plástico.', price: 29.90, imageUrl: 'https://picsum.photos/seed/p3-3/600/600', category: 'Cuidado Personal', stock: 400 },
  { id: 'p3-4', storeId: 'store-3', name: 'Barra de Jabón Artesanal', description: 'Hecho con ingredientes naturales y suave para la piel.', price: 22.50, imageUrl: 'https://picsum.photos/seed/p3-4/600/600', category: 'Cuidado Personal', stock: 320 },

  // Tienda 4: Cyber Circuito
  { id: 'p4-1', storeId: 'store-4', name: 'Teclado Mecánico X1', description: 'Switches táctiles para una experiencia de escritura satisfactoria.', price: 350.00, imageUrl: 'https://picsum.photos/seed/p4-1/600/600', category: 'Periféricos', stock: 75 },
  { id: 'p4-2', storeId: 'store-4', name: 'Monitor 4K Ultra-HD', description: 'Colores vibrantes y detalles nítidos para trabajo y juego.', price: 1899.00, imageUrl: 'https://picsum.photos/seed/p4-2/600/600', category: 'Monitores', stock: 40 },
  { id: 'p4-3', storeId: 'store-4', name: 'Casco de RV Gen 2', description: 'Sumérgete en mundos virtuales.', price: 1500.00, imageUrl: 'https://picsum.photos/seed/p4-3/600/600', category: 'RV', stock: 30 },
  { id: 'p4-4', storeId: 'store-4', name: 'Audífonos con Cancelación de Ruido', description: 'Bloquea las distracciones y enfócate en tu audio.', price: 999.00, imageUrl: 'https://picsum.photos/seed/p4-4/600/600', category: 'Audio', stock: 85 },
];

export const MOCK_ORDERS: Order[] = [
  // Pedidos Tienda 1
  { id: 'o1-1', storeId: 'store-1', customerName: 'Lucía', date: '2023-10-26', total: 219.70, status: 'delivered', items: [{ productId: 'p1-1', quantity: 1, name: 'Polo Blanco Clásico', price: 89.90 }, { productId: 'p1-3', quantity: 1, name: 'Bufanda de Seda', price: 129.90 }] },
  { id: 'o1-2', storeId: 'store-1', customerName: 'Mateo', date: '2023-10-25', total: 249.90, status: 'shipped', items: [{ productId: 'p1-4', quantity: 1, name: 'Chaqueta de Jean', price: 249.90 }] },
  
  // Pedidos Tienda 2
  { id: 'o2-1', storeId: 'store-2', customerName: 'Sofía', date: '2023-10-24', total: 658.00, status: 'pending', items: [{ productId: 'p2-1', quantity: 1, name: 'Auriculares Inalámbricos Pro', price: 499.00 }, { productId: 'p2-3', quantity: 1, name: 'Batería Portátil', price: 159.00 }] },
  { id: 'o2-2', storeId: 'store-2', customerName: 'Daniel', date: '2023-10-23', total: 899.50, status: 'delivered', items: [{ productId: 'p2-2', quantity: 1, name: 'Smartwatch Serie 5', price: 899.50 }] },

  // Pedidos Tienda 3
  { id: 'o3-1', storeId: 'store-3', customerName: 'Valentina', date: '2023-10-22', total: 94.90, status: 'shipped', items: [{ productId: 'p3-1', quantity: 1, name: 'Vela de Soya y Lavanda', price: 65.00 }, { productId: 'p3-3', quantity: 1, name: 'Set de Cepillos de Bambú', price: 29.90 }] },
  { id: 'o3-2', storeId: 'store-3', customerName: 'Javier', date: '2023-10-21', total: 45.00, status: 'cancelled', items: [{ productId: 'p3-4', quantity: 2, name: 'Barra de Jabón Artesanal', price: 22.50 }] },
  
  // Pedidos Tienda 4
  { id: 'o4-1', storeId: 'store-4', customerName: 'Camila', date: '2023-10-20', total: 1899.00, status: 'delivered', items: [{ productId: 'p4-2', quantity: 1, name: 'Monitor 4K Ultra-HD', price: 1899.00 }] },
];