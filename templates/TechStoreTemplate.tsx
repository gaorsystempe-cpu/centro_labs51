import React, { useState } from 'react';
import type { Store, Product } from '../types';
import TemplateWrapper from './TemplateWrapper';
import { useCart } from '../hooks/useCart';
import CheckoutModal from '../components/storefront/CheckoutModal';

interface TemplateProps {
  store: Store;
  products: Product[];
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
          <div key={product.id} className="border rounded-lg overflow-hidden group flex flex-col" style={{borderColor: '#333', backgroundColor: '#1a1a1a'}}>
            <div className="overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold h-12" style={{color: store.theme.textColor}}>{product.name}</h3>
              <p className="mt-4 text-2xl font-bold" style={{color: store.theme.primaryColor}}>{formatCurrency(product.price)}</p>
            </div>
            <div className="p-4 mt-auto">
                 <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-2 rounded-md font-bold text-center transition-colors" 
                    style={{backgroundColor: store.theme.primaryColor, color: '#121212'}}>
                    Añadir al Carrito
                 </button>
            </div>
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

export default TechStoreTemplate;