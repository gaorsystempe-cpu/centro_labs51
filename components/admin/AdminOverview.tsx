import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { ShoppingBagIcon, BanknotesIcon, ShoppingCartIcon, UsersIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const AdminOverview: React.FC = () => {
  const { orders, products, formatCurrency } = useStore();
  
  const totalRevenue = orders.reduce((acc, order) => acc + (order.status === 'delivered' ? order.total : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  
  const uniqueCustomers = new Set(orders.map(o => o.customerName)).size;
  
  const statusText: { [key: string]: string } = {
      pending: 'Pendiente',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
  };

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Resumen del Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Ingresos Totales" value={formatCurrency(totalRevenue)} icon={<BanknotesIcon className="h-6 w-6"/>} />
            <StatCard title="Pedidos Totales" value={totalOrders} icon={<ShoppingCartIcon className="h-6 w-6"/>} />
            <StatCard title="Productos Totales" value={totalProducts} icon={<ShoppingBagIcon className="h-6 w-6"/>} />
            <StatCard title="Clientes Únicos" value={uniqueCustomers} icon={<UsersIcon className="h-6 w-6"/>} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pedidos Recientes</h2>
            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>{statusText[order.status]}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                    <ClipboardDocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos recientes</h3>
                    <p className="mt-1 text-sm text-gray-500">Los últimos 5 pedidos aparecerán aquí.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AdminOverview;