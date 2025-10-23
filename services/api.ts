import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_USERS } from './mockData';
import type { Store, Product, Order, User } from '../types';
import { TemplateName } from '../types';

const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 300));
};

export const getStores = (): Promise<Store[]> => {
  return simulateDelay(MOCK_STORES);
};

export const getStoreById = (id: string): Promise<Store | undefined> => {
  const store = MOCK_STORES.find(s => s.id === id);
  return simulateDelay(store);
};

export const createStore = (storeData: Omit<Store, 'id' | 'createdAt' | 'theme' | 'logoUrl'> & Partial<Pick<Store, 'theme' | 'logoUrl'>>): Promise<Store> => {
  const newStore: Store = {
    id: `store-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    logoUrl: storeData.logoUrl || `https://picsum.photos/seed/logo${Date.now()}/200/100`,
    theme: storeData.theme || {
        primaryColor: '#4c51bf',
        secondaryColor: '#ed64a6',
        backgroundColor: '#f7fafc',
        textColor: '#1a202c',
        font: 'Inter'
    },
    ...storeData,
  };
  MOCK_STORES.push(newStore);
  return simulateDelay(newStore);
};

export const updateStore = (storeId: string, updates: Partial<Store>): Promise<Store | undefined> => {
  const storeIndex = MOCK_STORES.findIndex(s => s.id === storeId);
  if (storeIndex !== -1) {
    MOCK_STORES[storeIndex] = { ...MOCK_STORES[storeIndex], ...updates };
    return simulateDelay(MOCK_STORES[storeIndex]);
  }
  return simulateDelay(undefined);
};

// Fix: Corrected issue where an imported array was being reassigned.
// The MOCK_STORES array is now mutated in place to remove an element, which is the correct approach for handling imported module variables.
export const deleteStore = (storeId: string): Promise<boolean> => {
    const storeIndex = MOCK_STORES.findIndex(s => s.id === storeId);
    if (storeIndex !== -1) {
        MOCK_STORES.splice(storeIndex, 1);
        return simulateDelay(true);
    }
    return simulateDelay(false);
}


export const getProductsByStoreId = (storeId: string): Promise<Product[]> => {
  const products = MOCK_PRODUCTS.filter(p => p.storeId === storeId);
  return simulateDelay(products);
};

export const getOrdersByStoreId = (storeId: string): Promise<Order[]> => {
  const orders = MOCK_ORDERS.filter(o => o.storeId === storeId);
  return simulateDelay(orders);
};

export const authenticateUser = (email: string, password: string): Promise<User | undefined> => {
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  return simulateDelay(user);
}