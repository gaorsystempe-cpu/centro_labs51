import React, { useState } from 'react';
import type { Store, Product } from '../types';
import TemplateWrapper from './TemplateWrapper';
import { useCart } from '../hooks/useCart';
import CheckoutModal from '../components/storefront/CheckoutModal';

interface TemplateProps {
  store: Store;
  products: Product[];
}

const OrganicNaturalTemplate: React.FC<TemplateProps> = ({ store, products }) => {
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
        <h2 className="text-4xl md:text-5xl font-bold" style={{color: store.theme.primaryColor}}>Disfruta lo Mejor de la Naturaleza</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg" style={{color: store.theme.textColor}}>Productos artesanales, sostenibles y saludables para un mejor tú y un mejor planeta.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden flex flex-col" style={{borderColor: store.theme.secondaryColor}}>
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold" style={{color: store.theme.textColor}}>{product.name}</h3>
              <p className="mt-2 text-gray-600 flex-grow" style={{color: store.theme.secondaryColor}}>{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-2xl font-bold" style={{color: store.theme.primaryColor}}>{formatCurrency(product.price)}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="px-5 py-2 rounded-md font-semibold text-white" 
                  style={{backgroundColor: store.theme.primaryColor}}>
                    Añadir al Carrito
                </button>
              </div>
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

export default OrganicNaturalTemplate;