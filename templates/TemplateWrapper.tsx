import React from 'react';
import type { Store } from '../types';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

interface TemplateWrapperProps {
  store: Store;
  children: React.ReactNode;
  cartItemCount: number;
  onCartClick: () => void;
}

const TemplateHeader: React.FC<{ store: Store }> = ({ store }) => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: store.theme.secondaryColor, backgroundColor: store.theme.backgroundColor, color: store.theme.textColor }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
            {store.logoUrl && <img src={store.logoUrl} alt={`${store.name} logo`} className="h-10 w-auto mr-4 object-contain" />}
            <h1 className="text-3xl font-bold" style={{ color: store.theme.primaryColor }}>{store.name}</h1>
        </div>
        <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:underline">Inicio</a>
            <a href="#" className="hover:underline">Tienda</a>
            <a href="#" className="hover:underline">Nosotros</a>
            <a href="#" className="hover:underline">Contacto</a>
        </nav>
      </div>
    </header>
  );
}

const TemplateFooter: React.FC<{ store: Store }> = ({ store }) => {
    return (
        <footer className="py-8 px-4 sm:px-6 lg:px-8 mt-16" style={{ backgroundColor: store.theme.primaryColor, color: store.theme.backgroundColor === '#121212' ? '#e0e0e0' : 'white' }}>
            <div className="max-w-7xl mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} {store.name}. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

const CartButton: React.FC<{ itemCount: number, onClick: () => void, primaryColor: string }> = ({ itemCount, onClick, primaryColor }) => (
    <button
        onClick={onClick}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-50"
        style={{ backgroundColor: primaryColor }}
    >
        <ShoppingCartIcon className="h-8 w-8 text-white" />
        {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {itemCount}
            </span>
        )}
    </button>
);


const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ store, children, cartItemCount, onCartClick }) => {
    return (
        <div style={{ fontFamily: store.theme.font, backgroundColor: store.theme.backgroundColor, color: store.theme.textColor }}>
            <TemplateHeader store={store} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </main>
            <TemplateFooter store={store} />
            <CartButton itemCount={cartItemCount} onClick={onCartClick} primaryColor={store.theme.primaryColor} />
        </div>
    );
}

export default TemplateWrapper;