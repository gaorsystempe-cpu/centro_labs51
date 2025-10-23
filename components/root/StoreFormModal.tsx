import React, { useState, useEffect } from 'react';
import type { Store } from '../../types';
import { TemplateName } from '../../types';
import { createStore, updateStore } from '../../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface StoreFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    storeToEdit: Store | null;
}

const StoreFormModal: React.FC<StoreFormModalProps> = ({ isOpen, onClose, onSave, storeToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        owner: '',
        status: 'active' as 'active' | 'suspended',
        plan: 'basic' as 'basic' | 'premium',
        template: TemplateName.MINIMAL_MODERN,
        currency: 'PEN' as 'PEN' | 'USD',
        whatsappNumber: '',
        paymentInfo: {
            yape: { holder: '', number: '' },
            plin: { holder: '', number: '' },
        },
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (storeToEdit) {
            setFormData({
                name: storeToEdit.name,
                owner: storeToEdit.owner,
                status: storeToEdit.status,
                plan: storeToEdit.plan,
                template: storeToEdit.template,
                currency: storeToEdit.currency,
                whatsappNumber: storeToEdit.whatsappNumber,
                paymentInfo: { ...storeToEdit.paymentInfo },
            });
        } else {
            // Reset to default for new store
            setFormData({
                name: '',
                owner: '',
                status: 'active',
                plan: 'basic',
                template: TemplateName.MINIMAL_MODERN,
                currency: 'PEN',
                whatsappNumber: '',
                paymentInfo: { yape: { holder: '', number: '' }, plin: { holder: '', number: '' } },
            });
        }
    }, [storeToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>, method: 'yape' | 'plin', field: 'holder' | 'number') => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            paymentInfo: {
                ...prev.paymentInfo,
                [method]: {
                    ...prev.paymentInfo[method],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (storeToEdit) {
                await updateStore(storeToEdit.id, formData);
            } else {
                await createStore(formData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to save store", error);
            alert("Error al guardar la tienda.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {storeToEdit ? 'Editar Tienda' : 'Crear Nueva Tienda'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="h-7 w-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre de la Tienda</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 input-class" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Propietario</label>
                            <input type="text" name="owner" value={formData.owner} onChange={handleChange} className="mt-1 input-class" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 input-class">
                                <option value="active">Activa</option>
                                <option value="suspended">Suspendida</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Plan</label>
                            <select name="plan" value={formData.plan} onChange={handleChange} className="mt-1 input-class">
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Plantilla</label>
                            <select name="template" value={formData.template} onChange={handleChange} className="mt-1 input-class">
                                {Object.values(TemplateName).map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Moneda</label>
                            <select name="currency" value={formData.currency} onChange={handleChange} className="mt-1 input-class">
                                <option value="PEN">Soles (S/)</option>
                                <option value="USD">Dólares ($)</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="mt-1 input-class" placeholder="51987654321" required />
                        </div>
                    </div>
                    
                    <div className="border-t pt-6">
                         <h3 className="text-lg font-medium text-gray-800 mb-4">Información de Pago</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-4 p-4 border rounded-md">
                                <p className="font-bold text-lg" style={{color: '#9d194a'}}>YAPE</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Titular</label>
                                    <input type="text" value={formData.paymentInfo.yape.holder} onChange={e => handlePaymentChange(e, 'yape', 'holder')} className="mt-1 input-class" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">Número</label>
                                    <input type="text" value={formData.paymentInfo.yape.number} onChange={e => handlePaymentChange(e, 'yape', 'number')} className="mt-1 input-class" />
                                </div>
                             </div>
                             <div className="space-y-4 p-4 border rounded-md">
                                <p className="font-bold text-lg" style={{color: '#0070f3'}}>PLIN</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Titular</label>
                                    <input type="text" value={formData.paymentInfo.plin.holder} onChange={e => handlePaymentChange(e, 'plin', 'holder')} className="mt-1 input-class" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">Número</label>
                                    <input type="text" value={formData.paymentInfo.plin.number} onChange={e => handlePaymentChange(e, 'plin', 'number')} className="mt-1 input-class" />
                                </div>
                             </div>
                         </div>
                    </div>

                </form>

                <div className="p-5 border-t mt-auto flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="store-form"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
            <style jsx>{`
                .input-class {
                    display: block;
                    width: 100%;
                    border-radius: 0.375rem;
                    border: 1px solid #d1d5db;
                    padding: 0.5rem 0.75rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .input-class:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px #a5b4fc;
                }
            `}</style>
        </div>
    );
};

export default StoreFormModal;
