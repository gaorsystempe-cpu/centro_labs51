import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authenticateUser } from '../services/api';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await authenticateUser(email, password);

            if (user) {
                login(user);
                if (user.role === 'ROOT') {
                    navigate('/root');
                } else if (user.role === 'ADMIN' && user.storeId) {
                    navigate(`/admin/${user.storeId}`);
                } else {
                    setError('La cuenta de administrador no está asociada a ninguna tienda.');
                    setLoading(false);
                }
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
                             <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                                ¿Olvidaste tu contraseña?
                            </a>
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
    );
};

export default LoginPage;