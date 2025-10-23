import React, { useState } from 'react';
import type { Store, Product } from '../types';
import TemplateWrapper from './TemplateWrapper';
import { useCart } from '../hooks/useCart';
import CheckoutModal from '../components/storefront/CheckoutModal';

interface TemplateProps {
  store: Store;
  products: Product[];
}

const VibrantStoreTemplate: React.FC<TemplateProps> = ({ store, products }) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, totalItems } = useCart();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const heroProduct = products[0];

  const formatCurrency = (amount: number) => {
    if (store.currency === 'PEN') {
        return `S/ ${amount.toFixed(2)}`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  return (
    <TemplateWrapper store={store} cartItemCount={totalItems} onCartClick={() => setCheckoutOpen(true)}>
      {heroProduct && (
         <div className="rounded-lg p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8" style={{backgroundColor: store.theme.primaryColor, color: 'white'}}>
            <div className="md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Producto Destacado</h2>
                <h3 className="text-2xl font-bold">{heroProduct.name}</h3>
                <p className="mt-2 text-lg opacity-90">{heroProduct.description}</p>
                <button 
                  onClick={() => addToCart(heroProduct)}
                  className="mt-6 px-6 py-3 rounded-md font-bold transition-transform transform hover:scale-105" 
                  style={{backgroundColor: store.theme.secondaryColor, color: store.theme.primaryColor}}>
                    Comprar Ahora
                </button>
            </div>
             <div className="md:w-1/2">
                 <img src={heroProduct.imageUrl} alt={heroProduct.name} className="w-full h-auto rounded-lg shadow-2xl"/>
             </div>
        </div>
      )}
      <h3 className="text-3xl font-bold text-center mb-8" style={{color: store.theme.textColor}}>Todos los Productos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform">
            <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h4 className="text-lg font-bold text-gray-800 truncate">{product.name}</h4>
              <p className="mt-2 text-xl font-black" style={{color: store.theme.primaryColor}}>{formatCurrency(product.price)}</p>
            </div>
             <div className="p-4 bg-gray-50">
                 <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-2 rounded-md font-semibold text-white" 
                    style={{backgroundColor: store.theme.primaryColor}}>
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

export default VibrantStoreTemplate;