import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authenticateUser, sendAdminPasswordReset } from '../services/api';
import Logo from '../components/Logo';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ResetPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await sendAdminPasswordReset(email);
            setMessage('Si existe una cuenta con este email, se ha enviado un enlace para restablecer la contraseña.');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Restablecer Contraseña</h2>
                <p className="text-gray-600 mb-6">Ingresa tu email y te enviaremos un enlace para que puedas volver a acceder a tu cuenta.</p>
                <form onSubmit={handleResetRequest}>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu-usuario@labs51.pe"
                        required
                        className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                    {message && <p className="text-sm text-green-600 mt-4">{message}</p>}
                    {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-3 px-4 border border-transparent rounded-lg shadow-lg text-md font-medium text-white bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Enviar Enlace'}
                    </button>
                </form>
            </div>
        </div>
    );
};


const LoginPage: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'ROOT') {
                navigate('/root', { replace: true });
            } else if (user.role === 'ADMIN' && user.storeId) {
                navigate(`/admin/${user.storeId}`, { replace: true });
            }
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!isSupabaseConfigured) {
             setError('La aplicación no está configurada para conectar con un backend. Verifique la consola para más detalles.');
             setLoading(false);
             return;
        }

        try {
            const authenticatedUser = await authenticateUser(email, password);

            if (authenticatedUser) {
                login(authenticatedUser); // Context will handle navigation via useEffect
            } else {
                setError('Credenciales inválidas. Por favor, intente de nuevo.');
                setLoading(false);
            }
        } catch (err) {
            setError('Ocurrió un error al iniciar sesión. Por favor, intente más tarde.');
            setLoading(false);
        }
    };

    return (
        <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
             {!isSupabaseConfigured && (
                <div className="absolute top-0 left-0 right-0 p-3 bg-yellow-400 border-b border-yellow-500 text-yellow-900 text-center text-sm z-10">
                    <strong>Advertencia de Configuración:</strong> La aplicación está usando credenciales de Supabase de ejemplo. La conexión al backend no funcionará.
                </div>
            )}
            <div className="flex w-full max-w-5xl h-[650px] rounded-2xl shadow-2xl overflow-hidden bg-white">
                {/* Left Panel: Login Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-gray-800">Bienvenido de Vuelta</h1>
                    <p className="text-gray-600 mt-2 mb-8">Ingresa a tu Centro de Operaciones</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu-usuario@labs51.pe"
                                required
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>
                        
                        <div className="text-right">
                             <button type="button" onClick={() => setShowResetModal(true)} className="text-sm font-medium text-purple-600 hover:text-purple-700">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-md font-medium text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(to right, #8B5CF6, #4FB6E9)'}}
                            >
                                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Panel: Marketing */}
                <div 
                    className="hidden lg:flex w-1/2 p-12 flex-col justify-center items-center text-white"
                    style={{ background: '#21243d' }}
                >
                    <Logo className="w-32 h-32 mb-8" />
                    <div className="flex items-center justify-center">
                        <h1 className="text-7xl font-bold tracking-wider">
                            <span className="text-white">LABS</span>
                            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">51</span>
                        </h1>
                    </div>

                    <p className="text-xl text-gray-300 mt-10 text-center max-w-md">
                        La plataforma todo-en-uno para lanzar, gestionar y hacer crecer tu negocio.
                    </p>
                </div>
            </div>
        </div>
        {showResetModal && <ResetPasswordModal onClose={() => setShowResetModal(false)} />}
        </>
    );
};

export default LoginPage;