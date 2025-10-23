import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { TemplateName } from '../../types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const templatePreviews = {
  [TemplateName.MINIMAL_MODERN]: 'https://picsum.photos/seed/tprev1/400/300',
  [TemplateName.VIBRANT_STORE]: 'https://picsum.photos/seed/tprev2/400/300',
  [TemplateName.ORGANIC_NATURAL]: 'https://picsum.photos/seed/tprev3/400/300',
  [TemplateName.TECH_STORE]: 'https://picsum.photos/seed/tprev4/400/300',
};

const ColorPicker: React.FC<{ label: string; color: string; onChange: (color: string) => void; }> = ({ label, color, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex items-center space-x-2">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-10 border-gray-300 rounded-md"
                />
                <input 
                    type="text"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>
    );
};

const Customizer: React.FC = () => {
  const { store, updateTemplate, updateTheme, updateStoreName, updateCurrency } = useStore();
  
  if (!store) return null;

  const [storeName, setStoreName] = useState(store.name);
  
  const handleSave = () => {
    updateStoreName(storeName);
    // En una aplicación real, esto sería una llamada a la API
    alert("¡Cambios guardados!");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Detalles de la Tienda</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Nombre de la Tienda</label>
                    <input
                      type="text"
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Moneda</label>
                    <select
                        id="currency"
                        value={store.currency}
                        onChange={(e) => updateCurrency(e.target.value as 'PEN' | 'USD')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="PEN">Soles Peruanos (S/)</option>
                        <option value="USD">Dólares Americanos ($)</option>
                    </select>
                  </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Colores de Marca</h2>
                <div className="space-y-4">
                    <ColorPicker 
                        label="Color Primario"
                        color={store.theme.primaryColor}
                        onChange={(color) => updateTheme({ primaryColor: color })}
                    />
                     <ColorPicker 
                        label="Color Secundario"
                        color={store.theme.secondaryColor}
                        onChange={(color) => updateTheme({ secondaryColor: color })}
                    />
                    <ColorPicker 
                        label="Color de Fondo"
                        color={store.theme.backgroundColor}
                        onChange={(color) => updateTheme({ backgroundColor: color })}
                    />
                    <ColorPicker 
                        label="Color de Texto"
                        color={store.theme.textColor}
                        onChange={(color) => updateTheme({ textColor: color })}
                    />
                </div>
            </div>
             <button
                onClick={handleSave}
                className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
                Guardar Cambios
            </button>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-bold text-gray-800 mb-4">Seleccionar Plantilla</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.values(TemplateName).map(template => (
                        <div key={template} onClick={() => updateTemplate(template)} className="cursor-pointer group relative">
                            <img src={templatePreviews[template]} alt={template} className="rounded-lg w-full h-auto object-cover border-4 border-transparent group-hover:border-indigo-500 transition-all" />
                            {store.template === template && (
                                <div className="absolute inset-0 bg-indigo-700 bg-opacity-75 flex items-center justify-center rounded-lg">
                                    <CheckCircleIcon className="h-12 w-12 text-white" />
                                </div>
                            )}
                            <p className="mt-2 text-center font-semibold text-gray-700">{template}</p>
                        </div>
                    ))}
                 </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Vista Previa</h2>
                    <p className="text-sm text-gray-500">Tus cambios se reflejan aquí instantáneamente.</p>
                </div>
                <div className="p-2 bg-gray-200">
                    <iframe 
                        src={`#/store/${store.id}`}
                        title="Live Store Preview"
                        className="w-full h-[600px] border-0 rounded-md"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Customizer;
