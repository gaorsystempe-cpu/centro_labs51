import React, { useState } from 'react';
import type { Store, Product } from '../types';
import TemplateWrapper from './TemplateWrapper';
import { useCart } from '../hooks/useCart';
import CheckoutModal from '../components/storefront/CheckoutModal';

interface TemplateProps {
  store: Store;
  products: Product[];
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
          <div key={product.id} className="group relative text-center flex flex-col">
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" />
            </div>
            <div className="mt-4 flex-grow flex flex-col">
              <h3 className="text-lg font-medium" style={{color: store.theme.textColor}}>{product.name}</h3>
              <p className="mt-1 text-md" style={{color: store.theme.primaryColor}}>{formatCurrency(product.price)}</p>
            </div>
            <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors"
                style={{ backgroundColor: store.theme.primaryColor }}
            >
                Añadir
            </button>
          </div>
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