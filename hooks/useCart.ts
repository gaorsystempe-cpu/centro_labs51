import { useState, useMemo } from 'react';
import type { Product, ProductVariant, CartItem } from '../types';

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === variant.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === variant.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            const newCartItem: CartItem = {
                id: variant.id,
                productId: product.id,
                name: product.name,
                attributes: variant.attributes,
                price: variant.price_override ?? product.selling_price,
                imageUrl: variant.image_url ?? (product.image_urls && product.image_urls[0]),
                quantity: quantity
            };
            return [...prevItems, newCartItem];
        });
    };

    const removeFromCart = (variantId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== variantId));
    };

    const updateQuantity = (variantId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(variantId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === variantId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };
    
    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const totalItems = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        totalItems
    };
};
