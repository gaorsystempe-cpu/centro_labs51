import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStoreById, getProductsByStoreId } from '../services/api';
import type { Store, Product } from '../types';
import { TemplateName } from '../types';

import MinimalModernTemplate from '../templates/MinimalModernTemplate';
import VibrantStoreTemplate from '../templates/VibrantStoreTemplate';
import OrganicNaturalTemplate from '../templates/OrganicNaturalTemplate';
import TechStoreTemplate from '../templates/TechStoreTemplate';

const StorefrontPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setError("No se proporcionó un ID de tienda.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const storeData = await getStoreById(storeId);
        if (!storeData) {
          setError(`Tienda con ID ${storeId} no encontrada.`);
          setStore(null);
        } else {
          setStore(storeData);
          const productsData = await getProductsByStoreId(storeId);
          setProducts(productsData);
        }
      } catch (e) {
        setError("Error al cargar los datos de la tienda.");
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [storeId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando Tienda...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!store) {
    return <div className="flex items-center justify-center min-h-screen">Tienda no disponible.</div>;
  }
  
  if (store.status === 'suspended') {
     return <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 text-2xl font-semibold">Esta tienda no está disponible temporalmente.</div>
  }

  const renderTemplate = () => {
    const props = { store, products };
    switch (store.template) {
      case TemplateName.MINIMAL_MODERN:
        return <MinimalModernTemplate {...props} />;
      case TemplateName.VIBRANT_STORE:
        return <VibrantStoreTemplate {...props} />;
      case TemplateName.ORGANIC_NATURAL:
        return <OrganicNaturalTemplate {...props} />;
      case TemplateName.TECH_STORE:
        return <TechStoreTemplate {...props} />;
      default:
        return <div>Plantilla desconocida seleccionada.</div>;
    }
  };

  return <>{renderTemplate()}</>;
};

export default StorefrontPage;
