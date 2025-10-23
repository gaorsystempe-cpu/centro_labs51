import React, { useState, useMemo, useEffect } from 'react';
import type { ProductWithVariants, ProductVariant, Theme } from '../../types';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
    product: ProductWithVariants;
    storeTheme: Theme;
    formatCurrency: (amount: number) => string;
    onAddToCart: (product: ProductWithVariants, variant: ProductVariant) => void;
    cardStyle?: 'default' | 'vibrant' | 'organic' | 'tech';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, storeTheme, formatCurrency, onAddToCart, cardStyle = 'default' }) => {
    const { product_variants: variants } = product;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Initialize selected variant
    useEffect(() => {
        if (variants && variants.length > 0) {
            setSelectedVariant(variants[0]);
        }
    }, [variants]);

    const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const variantId = e.target.value;
        const newVariant = variants.find(v => v.id === variantId) || null;
        setSelectedVariant(newVariant);
    };

    const displayPrice = useMemo(() => {
        if (!selectedVariant) return product.selling_price;
        return selectedVariant.price_override ?? product.selling_price;
    }, [selectedVariant, product.selling_price]);

    const displayImage = useMemo(() => {
        return selectedVariant?.image_url || (product.image_urls && product.image_urls[0]) || 'https://via.placeholder.com/400';
    }, [selectedVariant, product.image_urls]);

    const hasVariants = variants.length > 1;

    const handleAddToCartClick = () => {
        if (selectedVariant) {
            if (selectedVariant.stock > 0) {
                onAddToCart(product, selectedVariant);
            } else {
                alert("Esta variante está agotada.");
            }
        } else {
             alert("Por favor, selecciona una variante.");
        }
    }
    
    // --- RENDER LOGIC BASED ON STYLE ---

    if (cardStyle === 'vibrant') {
         return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform flex flex-col">
            <img src={displayImage} alt={product.name} className="w-full h-56 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
              <h4 className="text-lg font-bold text-gray-800 truncate flex-grow">{product.name}</h4>
               {hasVariants && (
                  <select onChange={handleVariantChange} value={selectedVariant?.id || ''} className="mt-2 w-full p-2 border rounded-md text-sm">
                      {variants.map(v => (
                          <option key={v.id} value={v.id}>{Object.values(v.attributes).join(' / ')}</option>
                      ))}
                  </select>
              )}
              <p className="mt-2 text-xl font-black" style={{color: storeTheme.primaryColor}}>{formatCurrency(displayPrice)}</p>
            </div>
             <div className="p-4 bg-gray-50 mt-auto">
                 <button 
                    onClick={handleAddToCartClick}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    className="w-full py-2 rounded-md font-semibold text-white disabled:bg-gray-400 disabled:cursor-not-allowed" 
                    style={{backgroundColor: storeTheme.primaryColor}}>
                      {selectedVariant?.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
                 </button>
             </div>
          </div>
        )
    }
    
    if (cardStyle === 'organic') {
        return (
            <div className="border rounded-lg overflow-hidden flex flex-col" style={{borderColor: storeTheme.secondaryColor}}>
                <img src={displayImage} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold" style={{color: storeTheme.textColor}}>{product.name}</h3>
                    {hasVariants && (
                      <select onChange={handleVariantChange} value={selectedVariant?.id || ''} className="mt-2 w-full p-2 border rounded-md text-sm">
                          {variants.map(v => (
                              <option key={v.id} value={v.id}>{Object.values(v.attributes).join(' / ')}</option>
                          ))}
                      </select>
                    )}
                    <p className="mt-2 text-gray-600 flex-grow" style={{color: storeTheme.secondaryColor}}>{product.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-2xl font-bold" style={{color: storeTheme.primaryColor}}>{formatCurrency(displayPrice)}</p>
                        <button 
                            onClick={handleAddToCartClick}
                            disabled={!selectedVariant || selectedVariant.stock === 0}
                            className="px-5 py-2 rounded-md font-semibold text-white disabled:bg-gray-400 disabled:cursor-not-allowed" 
                            style={{backgroundColor: storeTheme.primaryColor}}>
                            {selectedVariant?.stock === 0 ? 'Agotado' : 'Añadir'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (cardStyle === 'tech') {
        return (
            <div className="border rounded-lg overflow-hidden group flex flex-col" style={{borderColor: '#333', backgroundColor: '#1a1a1a'}}>
                <div className="overflow-hidden">
                    <img src={displayImage} alt={product.name} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold h-12" style={{color: storeTheme.textColor}}>{product.name}</h3>
                    {hasVariants && (
                        <select onChange={handleVariantChange} value={selectedVariant?.id || ''} className="mt-2 w-full p-2 border rounded-md text-sm bg-gray-700 text-white border-gray-600">
                            {variants.map(v => (
                                <option key={v.id} value={v.id}>{Object.values(v.attributes).join(' / ')}</option>
                            ))}
                        </select>
                    )}
                    <p className="mt-4 text-2xl font-bold" style={{color: storeTheme.primaryColor}}>{formatCurrency(displayPrice)}</p>
                </div>
                <div className="p-4 mt-auto">
                     <button 
                        onClick={handleAddToCartClick}
                        disabled={!selectedVariant || selectedVariant.stock === 0}
                        className="w-full py-2 rounded-md font-bold text-center transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed" 
                        style={{backgroundColor: storeTheme.primaryColor, color: '#121212'}}>
                        {selectedVariant?.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
                     </button>
                </div>
            </div>
        )
    }

    // Default card style
    return (
      <div className="group relative text-center flex flex-col">
        <div className="w-full bg-gray-200 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
          <img src={displayImage} alt={product.name} className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" />
        </div>
        <div className="mt-4 flex-grow flex flex-col">
          <h3 className="text-lg font-medium" style={{color: storeTheme.textColor}}>{product.name}</h3>
          {hasVariants && (
              <select onChange={handleVariantChange} value={selectedVariant?.id || ''} className="mt-2 w-full p-2 border rounded-md text-sm">
                  {variants.map(v => (
                      <option key={v.id} value={v.id}>{Object.values(v.attributes).join(' / ')}</option>
                  ))}
              </select>
          )}
          <p className="mt-1 text-md" style={{color: storeTheme.primaryColor}}>{formatCurrency(displayPrice)}</p>
        </div>
        <button
            onClick={handleAddToCartClick}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            style={{ backgroundColor: storeTheme.primaryColor }}
        >
            {selectedVariant?.stock === 0 ? 'Agotado' : 'Añadir'}
        </button>
      </div>
    )
};

export default ProductCard;
