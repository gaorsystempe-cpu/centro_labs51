import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const ProductManager: React.FC = () => {
    const { products, formatCurrency } = useStore();

    const renderAttributes = (attributes: Record<string, string> | null) => {
        if (!attributes) return <span className="text-gray-500">N/A</span>;
        return Object.entries(attributes).map(([key, value]) => (
            <span key={key} className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-2 mb-1">
                {key}: {value}
            </span>
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Gestionar Productos</h1>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Añadir Producto
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variante (Atributos)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length > 0 ? (
                                products.map(product => (
                                    product.product_variants.length > 0 ? product.product_variants.map((variant, index) => (
                                        <tr key={variant.id}>
                                            {/* El nombre del producto solo se muestra en la primera fila de sus variantes */}
                                            {index === 0 && (
                                                <td className="px-6 py-4 whitespace-nowrap" rowSpan={product.product_variants.length}>
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-md object-cover" src={variant.image_url || (product.image_urls && product.image_urls[0]) || 'https://via.placeholder.com/150'} alt={product.name} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                            <div className="text-xs text-gray-500">{product.categories?.name || 'Sin categoría'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderAttributes(variant.attributes)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{variant.sku || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(variant.price_override ?? product.selling_price)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{variant.stock}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</a>
                                                <a href="#" className="text-red-600 hover:text-red-900">Eliminar</a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-md object-cover" src={(product.image_urls && product.image_urls[0]) || 'https://via.placeholder.com/150'} alt={product.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                         <div className="text-xs text-gray-500">{product.categories?.name || 'Sin categoría'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic" colSpan={4}>Este producto no tiene variantes definidas.</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Gestionar</a>
                                            </td>
                                        </tr>
                                    )
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
                                            <p className="mt-1 text-sm text-gray-500">Empieza añadiendo tu primer producto a la tienda.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;