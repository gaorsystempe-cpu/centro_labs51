import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const OrderManager: React.FC = () => {
    const { orders, formatCurrency, loading } = useStore();
    
    const statusText: { [key: string]: string } = {
        pending: 'Pendiente',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado'
    };

    const renderContent = () => {
        if (loading) {
            return <div className="p-8 text-center text-gray-500">Cargando pedidos...</div>;
        }

        if (orders.length === 0) {
            return (
                <div className="text-center p-12 border-2 border-dashed rounded-lg m-4">
                    <ClipboardDocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron pedidos</h3>
                    <p className="mt-1 text-sm text-gray-500">Cuando se realice el primer pedido en tu tienda, aparecerá aquí.</p>
                </div>
            );
        }

        return (
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>{statusText[order.status]}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Ver Detalles</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestionar Pedidos</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default OrderManager;