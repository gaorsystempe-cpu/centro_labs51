import React from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { StoreProvider, useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, ShoppingBagIcon, ClipboardDocumentListIcon, PaintBrushIcon, EyeIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
    const { store } = useStore();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const navLinkClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors";
    const activeClass = "bg-indigo-100 text-indigo-700";
    const inactiveClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    
    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800 truncate">{store?.name}</h2>
                <p className="text-sm text-gray-500">Panel de Admin</p>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                <NavLink to="overview" className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><HomeIcon className="h-5 w-5 mr-3"/>Resumen</NavLink>
                <NavLink to="products" className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><ShoppingBagIcon className="h-5 w-5 mr-3"/>Productos</NavLink>
                <NavLink to="orders" className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><ClipboardDocumentListIcon className="h-5 w-5 mr-3"/>Pedidos</NavLink>
                <NavLink to="customize" className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><PaintBrushIcon className="h-5 w-5 mr-3"/>Personalizar</NavLink>
            </nav>
            <div className="px-4 py-4 border-t">
                 <a href={`#/store/${store?.id}`} target="_blank" rel="noopener noreferrer" className={`${navLinkClasses} ${inactiveClass}`}>
                    <EyeIcon className="h-5 w-5 mr-3" /> Ver Tienda
                </a>
                <button onClick={handleLogout} className={`w-full text-left mt-2 ${navLinkClasses} ${inactiveClass}`}>
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" /> Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

const AdminHeader: React.FC = () => {
    const { store } = useStore();
    const { user } = useAuth();
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-900">Bienvenido, {user?.name}</h1>
                <span className="px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full capitalize">Plan {store?.plan}</span>
            </div>
        </header>
    );
}

const AdminLayoutContent: React.FC = () => {
    const { loading, store } = useStore();
    const { storeId } = useParams<{ storeId: string }>();

    if (loading) {
        return <div className="flex-1 flex items-center justify-center">Cargando datos de la tienda...</div>;
    }

    if (!store) {
        return <div className="flex-1 flex items-center justify-center">Tienda no encontrada: {storeId}</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

const AdminLayout: React.FC = () => {
    return (
        <StoreProvider>
            <AdminLayoutContent />
        </StoreProvider>
    );
}

export default AdminLayout;
