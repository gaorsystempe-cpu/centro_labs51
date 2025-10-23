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

const RLS_FIX_SQL = `-- 1. Elimina las políticas antiguas e incorrectas (si existen)
DROP POLICY IF EXISTS "Admins can manage their own store data" ON public.stores;
DROP POLICY IF EXISTS "Admins can manage their own products" ON public.products;

-- 2. Crea las políticas corregidas
-- El error 'column "user_id" does not exist' ocurre porque la columna en la tabla 'users' se llama 'id'.
CREATE POLICY "Admins can manage their own store data"
ON public.stores FOR ALL
USING (auth.uid() IN (SELECT id FROM public.users WHERE store_id = stores.id AND role = 'ADMIN'));

CREATE POLICY "Admins can manage their own products"
ON public.products FOR ALL
USING (auth.uid() IN (SELECT id FROM public.users WHERE store_id = products.store_id AND role = 'ADMIN'));
`;

const AdminLayoutContent: React.FC = () => {
    const { loading, store, error } = useStore();
    const { storeId } = useParams<{ storeId: string }>();

    if (loading) {
        return <div className="flex-1 flex items-center justify-center">Cargando datos de la tienda...</div>;
    }

    if (error) {
        const isRlsError = error.includes('column "user_id" does not exist');
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className={`border rounded relative max-w-2xl text-left ${isRlsError ? 'bg-red-100 border-red-400 text-red-700 p-6' : 'bg-red-100 border-red-400 text-red-700 px-4 py-3'}`} role="alert">
                    <strong className="font-bold">{isRlsError ? "¡Error de Configuración de Base de Datos Detectado!" : "¡Error de Conexión!"}</strong>
                    
                    {isRlsError ? (
                        <>
                            <p className="mt-2 text-sm">
                                Parece que hay un error común en las Políticas de Seguridad a Nivel de Fila (RLS) de Supabase.
                                El error <strong>"{error}"</strong> indica que una política está intentando usar una columna <code>user_id</code> que en realidad se llama <code>id</code> en la tabla <code>users</code>.
                            </p>
                            <p className="mt-3 text-sm font-bold">Para solucionarlo, por favor, ejecute el siguiente script SQL en su editor de Supabase:</p>
                            <pre className="mt-2 bg-gray-800 text-white p-3 rounded-md text-xs overflow-x-auto">
                                <code>{RLS_FIX_SQL}</code>
                            </pre>
                            <p className="mt-3 text-sm">Esto reemplazará las políticas incorrectas por las correctas y debería resolver el problema de inmediato.</p>
                        </>
                    ) : (
                        <>
                            <span className="block sm:inline ml-2">{error}</span>
                            <p className="mt-2 text-sm">Por favor, ejecute el script SQL completo en su editor de Supabase para crear todas las tablas necesarias.</p>
                        </>
                    )}
                </div>
            </div>
        );
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