import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStores, deleteStore, sendAdminPasswordReset } from '../services/api';
import type { Store } from '../types';
import { useAuth } from '../contexts/AuthContext';
import StoreFormModal from '../components/root/StoreFormModal';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Panel ROOT</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Bienvenido, {user?.name}</span>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>
    );
}

const StoreCard: React.FC<{ store: Store; onEdit: () => void; onDelete: () => void; onResetPassword: () => void; }> = ({ store, onEdit, onDelete, onResetPassword }) => {
    const statusClasses = store.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{store.name}</h3>
                        <p className="text-sm text-gray-500">Dueño: {store.owner}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>
                        {store.status === 'active' ? 'Activa' : 'Suspendida'}
                    </span>
                </div>
                <div className="mt-4 border-t pt-4 space-y-2 text-sm text-gray-600">
                    <p><strong>Plan:</strong> <span className="capitalize">{store.plan}</span></p>
                    <p><strong>Plantilla:</strong> {store.template}</p>
                    <p><strong>Admin:</strong> <span className="font-mono text-xs">{store.adminEmail || 'No asignado'}</span></p>
                    <p><strong>Creada:</strong> {new Date(store.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                 <button onClick={onResetPassword} className="p-2 text-gray-500 hover:text-yellow-600" title="Restablecer Contraseña del Admin">
                    <KeyIcon className="h-5 w-5"/>
                 </button>
                 <button onClick={onEdit} className="p-2 text-gray-500 hover:text-indigo-600" title="Editar Tienda"><PencilIcon className="h-5 w-5"/></button>
                 <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600" title="Eliminar Tienda"><TrashIcon className="h-5 w-5"/></button>
                 <Link to={`/store/${store.id}`} target="_blank" className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
                    Ver
                </Link>
                <Link to={`/admin/${store.id}`} className="px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900">
                    Admin
                </Link>
            </div>
        </div>
    );
}

const RootDashboardPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const storesData = await getStores();
      setStores(storesData);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleOpenCreateModal = () => {
    setEditingStore(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (store: Store) => {
    setEditingStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const handleDeleteStore = async (storeId: string) => {
    if(window.confirm("¿Estás seguro de que quieres eliminar esta tienda? Esta acción no se puede deshacer.")) {
        await deleteStore(storeId);
        await fetchStores();
    }
  }

  const handleResetPassword = async (email: string | undefined) => {
    if (!email) {
        alert("Esta tienda no tiene un email de administrador asociado.");
        return;
    }
    if (window.confirm(`Se enviará un enlace para restablecer la contraseña a ${email}. ¿Continuar?`)) {
        try {
            await sendAdminPasswordReset(email);
            alert(`¡Correo enviado! El administrador recibirá un enlace para crear una nueva contraseña.`);
        } catch (error) {
            console.error("Password reset error:", error);
            alert((error as Error).message);
        }
    }
  };
  
  if (loading && stores.length === 0) {
      return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const activeStores = stores.filter(s => s.status === 'active').length;
  const suspendedStores = stores.length - activeStores;
  
  return (
    <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-500">Tiendas Totales</h2>
                    <p className="text-3xl font-bold text-gray-900">{stores.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-500">Tiendas Activas</h2>
                    <p className="text-3xl font-bold text-green-600">{activeStores}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-500">Tiendas Suspendidas</h2>
                    <p className="text-3xl font-bold text-red-600">{suspendedStores}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Todas las Tiendas</h2>
                <button 
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Crear Nueva Tienda
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map(store => (
                    <StoreCard 
                        key={store.id} 
                        store={store} 
                        onEdit={() => handleOpenEditModal(store)}
                        onDelete={() => handleDeleteStore(store.id)}
                        onResetPassword={() => handleResetPassword(store.adminEmail)}
                    />
                ))}
            </div>
        </main>
        
        {isModalOpen && (
            <StoreFormModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                onSave={fetchStores}
                storeToEdit={editingStore}
            />
        )}
    </div>
  );
};

export default RootDashboardPage;