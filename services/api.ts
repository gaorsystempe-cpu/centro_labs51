import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_USERS } from './mockData';
import type { Store, Product, Order, User } from '../types';

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