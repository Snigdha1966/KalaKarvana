import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import XIcon from './icons/XIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';
import Logo from './icons/Logo';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
    const [artisanId, setArtisanId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { login, signup } = useAuth();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const trimmedId = artisanId.trim();

        if (trimmedId.length < 3) {
            setError("Artisan ID must be at least 3 characters long.");
            return;
        }

        if (!password) {
            setError("Password cannot be empty.");
            return;
        }
        
        if (activeTab === 'signup' && password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        const response = activeTab === 'login' ? login(trimmedId, password) : signup(trimmedId, password);
        
        if (response.success) {
            setMessage(response.message);
            // The onClose will be called from the AuthContext after successful login
        } else {
            setError(response.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-slate-900 border border-gray-700 rounded-2xl shadow-xl p-8 w-full max-w-md m-4 relative transform transition-all">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close modal">
                    <XIcon />
                </button>
                
                <div className="mx-auto w-16 h-16 mb-4">
                    <Logo className="w-full h-full" />
                </div>

                <div className="flex border-b border-gray-700 mb-6">
                    <button 
                        onClick={() => setActiveTab('signup')}
                        className={`py-3 px-6 text-lg font-medium transition-colors ${activeTab === 'signup' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
                    >
                        Create Account
                    </button>
                    <button 
                        onClick={() => setActiveTab('login')}
                        className={`py-3 px-6 text-lg font-medium transition-colors ${activeTab === 'login' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
                    >
                        Login
                    </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-100 text-center mb-2">
                    {activeTab === 'signup' ? 'Join KalaKarvan' : 'Welcome Back'}
                </h2>
                <p className="text-gray-400 text-center mb-6">
                    {activeTab === 'signup' ? 'Create a unique ID to save your collections.' : 'Enter your Artisan ID to access your collection.'}
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="artisanId" className="block text-sm font-medium text-gray-300">
                            Artisan ID
                        </label>
                        <input
                            type="text"
                            id="artisanId"
                            value={artisanId}
                            onChange={(e) => setArtisanId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3"
                            placeholder="e.g., RinaDevi_Art"
                        />
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-gray-600 bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3 pr-10"
                                placeholder="************"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-400 text-sm text-center">{message}</p>}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                    >
                        {activeTab === 'signup' ? 'Create Account' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;