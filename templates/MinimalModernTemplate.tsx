import React, { useState } from 'react';
import type { Store, ProductWithVariants } from '../types';
import TemplateWrapper from './TemplateWrapper';
import { useCart } from '../hooks/useCart';
import CheckoutModal from '../components/storefront/CheckoutModal';
import ProductCard from '../components/storefront/ProductCard';

interface TemplateProps {
  store: Store;
  products: ProductWithVariants[];
}

const MinimalModernTemplate: React.FC<TemplateProps> = ({ store, products }) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, totalItems } = useCart();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    if (store.currency === 'PEN') {
        return `S/ ${amount.toFixed(2)}`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  return (
    <TemplateWrapper store={store} cartItemCount={totalItems} onCartClick={() => setCheckoutOpen(true)}>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light tracking-tight" style={{color: store.theme.textColor}}>Colecciones Exquisitas</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500" style={{color: store.theme.secondaryColor}}>Piezas seleccionadas para el individuo moderno.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            storeTheme={store.theme}
            formatCurrency={formatCurrency}
            onAddToCart={addToCart}
          />
        ))}
      </div>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        store={store}
        formatCurrency={formatCurrency}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </TemplateWrapper>
  );
};

export default MinimalModernTemplate;
