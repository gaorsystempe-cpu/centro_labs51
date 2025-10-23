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

const TechStoreTemplate: React.FC<TemplateProps> = ({ store, products }) => {
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
        <h2 className="text-4xl md:text-5xl font-bold tracking-wider uppercase" style={{color: store.theme.primaryColor}}>El Futuro es Ahora</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg" style={{color: store.theme.textColor}}>Tecnología y gadgets de vanguardia para potenciar tu vida.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            storeTheme={store.theme}
            formatCurrency={formatCurrency}
            onAddToCart={addToCart}
            cardStyle="tech"
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

export default TechStoreTemplate;
