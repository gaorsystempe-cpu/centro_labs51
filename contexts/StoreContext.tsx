import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { Store, Theme, Product, Order, TemplateName } from '../types';
import { getStoreById, getProductsByStoreId, getOrdersByStoreId } from '../services/api';

interface StoreContextType {
  store: Store | null;
  products: Product[];
  orders: Order[];
  loading: boolean;
  updateTheme: (newTheme: Partial<Theme>) => void;
  updateTemplate: (newTemplate: TemplateName) => void;
  updateStoreName: (newName: string) => void;
  updateCurrency: (newCurrency: 'PEN' | 'USD') => void;
  formatCurrency: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;
      setLoading(true);
      try {
        const [storeData, productsData, ordersData] = await Promise.all([
          getStoreById(storeId),
          getProductsByStoreId(storeId),
          getOrdersByStoreId(storeId)
        ]);
        setStore(storeData || null);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);
  
  const updateTheme = (newTheme: Partial<Theme>) => {
      if (store) {
          setStore({ ...store, theme: { ...store.theme, ...newTheme } });
      }
  };

  const updateTemplate = (newTemplate: TemplateName) => {
      if (store) {
          setStore({ ...store, template: newTemplate });
      }
  };
  
  const updateStoreName = (newName: string) => {
    if(store) {
      setStore({ ...store, name: newName });
    }
  };

  const updateCurrency = (newCurrency: 'PEN' | 'USD') => {
    if(store) {
      setStore({ ...store, currency: newCurrency });
    }
  };

  const formatCurrency = useCallback((amount: number) => {
    if (!store) return amount.toFixed(2);
    const options = {
        style: 'currency',
        currency: store.currency,
        minimumFractionDigits: 2
    };
    // Adjust for Peruvian Soles symbol
    if (store.currency === 'PEN') {
        return `S/ ${amount.toFixed(2)}`;
    }
    return new Intl.NumberFormat('en-US', options).format(amount);
  }, [store]);


  return (
    <StoreContext.Provider value={{ store, products, orders, loading, updateTheme, updateTemplate, updateStoreName, updateCurrency, formatCurrency }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
