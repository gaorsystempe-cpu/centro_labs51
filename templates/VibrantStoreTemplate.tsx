import React, { useState } from 'react';
import type { Store, ProductWithVariants, ProductVariant } from '../types';
import TemplateWrapper from './TemplateWrapper';
import { useCart } from '../hooks/useCart';
import CheckoutModal from '../components/storefront/CheckoutModal';
import ProductCard from '../components/storefront/ProductCard';

interface TemplateProps {
  store: Store;
  products: ProductWithVariants[];
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
  
  const handleHeroAddToCart = () => {
    if(heroProduct) {
        // Add the first variant by default for the hero product
        const defaultVariant = heroProduct.product_variants[0] || { stock: 0, attributes: {}, id: 'default' };
        if(defaultVariant.stock > 0){
             addToCart(heroProduct, defaultVariant as ProductVariant);
        } else {
            alert("Este producto está agotado.");
        }
    }
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
                  onClick={handleHeroAddToCart}
                  className="mt-6 px-6 py-3 rounded-md font-bold transition-transform transform hover:scale-105" 
                  style={{backgroundColor: store.theme.secondaryColor, color: store.theme.primaryColor}}>
                    Comprar Ahora
                </button>
            </div>
             <div className="md:w-1/2">
                 <img src={(heroProduct.image_urls && heroProduct.image_urls[0]) || 'https://via.placeholder.com/400'} alt={heroProduct.name} className="w-full h-auto rounded-lg shadow-2xl"/>
             </div>
        </div>
      )}
      <h3 className="text-3xl font-bold text-center mb-8" style={{color: store.theme.textColor}}>Todos los Productos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            storeTheme={store.theme}
            formatCurrency={formatCurrency}
            onAddToCart={addToCart}
            cardStyle="vibrant"
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

export default VibrantStoreTemplate;
