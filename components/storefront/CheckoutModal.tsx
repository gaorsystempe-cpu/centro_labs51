import React from 'react';
import type { Store, CartItem } from '../../types';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    cartTotal: number;
    store: Store;
    formatCurrency: (amount: number) => string;
    updateQuantity: (productId: string, newQuantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen, onClose, cartItems, cartTotal, store, formatCurrency, updateQuantity, removeFromCart, clearCart
}) => {
    if (!isOpen) return null;

    const generateWhatsAppMessage = () => {
        let message = `¡Hola ${store.name}! ✨\n\nQuisiera confirmar mi pedido:\n\n`;
        cartItems.forEach(item => {
            message += `*${item.name}* (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`;
        });
        message += `\n*Total a Pagar:* ${formatCurrency(cartTotal)}\n\n`;
        message += "En breve realizaré el pago. ¡Gracias! 😊";
        return encodeURIComponent(message);
    };

    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${generateWhatsAppMessage()}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Tu Pedido</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="h-7 w-7" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {cartItems.length > 0 ? (
                        <>
                            {/* Order Summary */}
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                className="w-16 p-1 border rounded-md text-center"
                                                min="1"
                                            />
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Payment Instructions */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg mb-3">Instrucciones de Pago</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="border p-3 rounded-md">
                                        <p className="font-bold text-lg" style={{color: '#9d194a'}}>YAPE</p>
                                        <p><strong>Titular:</strong> {store.paymentInfo.yape.holder}</p>
                                        <p><strong>Número:</strong> {store.paymentInfo.yape.number}</p>
                                    </div>
                                    <div className="border p-3 rounded-md">
                                        <p className="font-bold text-lg" style={{color: '#0070f3'}}>PLIN</p>
                                        <p><strong>Titular:</strong> {store.paymentInfo.plin.holder}</p>
                                        <p><strong>Número:</strong> {store.paymentInfo.plin.number}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">Por favor, envía la constancia de pago al confirmar por WhatsApp.</p>
                            </div>

                        </>
                    ) : (
                        <p className="text-center text-gray-600 py-8">Tu carrito está vacío.</p>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-5 border-t mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-2xl font-bold" style={{ color: store.theme.primaryColor }}>{formatCurrency(cartTotal)}</span>
                        </div>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full block text-center py-3 px-4 rounded-lg font-bold text-white transition-transform transform hover:scale-105"
                            style={{ backgroundColor: '#25D366' }}
                            onClick={() => {
                                clearCart();
                                onClose();
                            }}
                        >
                            Confirmar por WhatsApp
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
