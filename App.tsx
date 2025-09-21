

import React, { useState, useEffect, useCallback } from 'react';
import { Tool } from './types';
import { TOOLS } from './constants';
import CaptionGenerator from './components/CaptionGenerator';
import ImageEditor from './components/ImageEditor';
import VideoGenerator from './components/VideoGenerator';
import MarketingGuide from './components/MarketingGuide';
import ArtStyleAdvisor from './components/ArtStyleAdvisor';
import VirtualStore from './components/VirtualStore';
import MyCollection from './components/MyCollection';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import { useAuth } from './components/AuthContext';
import UserIcon from './components/icons/UserIcon';
import LogoutIcon from './components/icons/LogoutIcon';
import HomeIcon from './components/icons/HomeIcon';
import LoginModal from './components/LoginModal';
import Logo from './components/icons/Logo';

// Helper to get tool from URL hash
const getToolFromHash = (): Tool => {
    const hash = window.location.hash.replace('#/', '');
    const toolKey = Object.keys(Tool).find(key => Tool[key as keyof typeof Tool].toLowerCase() === hash.toLowerCase());
    return toolKey ? Tool[toolKey as keyof typeof Tool] : Tool.HOME;
};

const App: React.FC = () => {
    const [activeTool, setActiveTool] = useState<Tool>(getToolFromHash());
    const { currentArtisanId, logout, openLoginModal, isLoginModalOpen, closeLoginModal } = useAuth();

    const handleHashChange = useCallback(() => {
        setActiveTool(getToolFromHash());
    }, []);

    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Set initial tool based on hash
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [handleHashChange]);
    
    // Redirect logic for protected routes
    useEffect(() => {
        if (!currentArtisanId && (activeTool === Tool.MY_COLLECTION || activeTool === Tool.PROFILE)) {
            window.location.hash = '#/home';
        }
    }, [currentArtisanId, activeTool]);
    
    const navigate = (tool: Tool) => {
        window.location.hash = `#/${tool.toLowerCase()}`;
    };

    const renderContent = () => {
        switch (activeTool) {
            case Tool.HOME:
                return <HomePage onNavigate={navigate} />;
            case Tool.PROFILE:
                return <ProfilePage onNavigate={() => navigate(Tool.MY_COLLECTION)} />;
            case Tool.CAPTION_GENERATOR:
                return <CaptionGenerator />;
            case Tool.IMAGE_EDITOR:
                return <ImageEditor />;
            case Tool.VIDEO_GENERATOR:
                return <VideoGenerator />;
            case Tool.MARKETING_GUIDE:
                return <MarketingGuide />;
            case Tool.ART_STYLE_ADVISOR:
                return <ArtStyleAdvisor />;
            case Tool.VIRTUAL_STORE:
                return <VirtualStore />;
            case Tool.MY_COLLECTION:
                 return currentArtisanId ? <MyCollection /> : <HomePage onNavigate={navigate} />;
            default:
                return <HomePage onNavigate={navigate} />;
        }
    };

    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-72 bg-slate-900/70 backdrop-blur-sm border-b md:border-r border-gray-700/80 md:shadow-lg flex flex-col">
                    <div className="p-6 border-b border-gray-700/80">
                         <button onClick={() => navigate(Tool.HOME)} className="w-full flex items-center justify-center md:justify-start gap-3">
                            <Logo className="w-10 h-10" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-100 text-gradient">KalaKarvan</h1>
                                <p className="text-xs text-gray-400">AI Co-pilot for Artisans</p>
                            </div>
                        </button>
                    </div>
                    <nav className="p-4 flex-1">
                        <ul>
                             <li>
                                <button
                                    onClick={() => navigate(Tool.HOME)}
                                    className={`w-full flex items-center p-3 my-1 rounded-lg text-left text-md font-medium transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                        activeTool === Tool.HOME
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                                >
                                    <span className={`mr-4 p-1 rounded-md ${activeTool === Tool.HOME ? '' : 'text-indigo-400'}`}><HomeIcon /></span>
                                    Home
                                </button>
                            </li>
                            {TOOLS.map((tool) => (
                                <li key={tool.id}>
                                    <button
                                        onClick={() => navigate(tool.id)}
                                        className={`w-full flex items-center p-3 my-1 rounded-lg text-left text-md font-medium transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                            activeTool === tool.id
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className={`mr-4 p-1 rounded-md ${activeTool === tool.id ? '' : 'text-indigo-400'}`}>{tool.icon}</span>
                                        {tool.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                     <div className="p-4 border-t border-gray-700/80">
                        {currentArtisanId ? (
                            <div>
                                <button onClick={() => navigate(Tool.PROFILE)} className="w-full flex items-center p-3 rounded-lg text-left text-md font-medium text-gray-300 hover:bg-gray-800 transition-colors">
                                    <span className="mr-4 text-green-400"><UserIcon /></span>
                                    <div>
                                        <p className="text-sm text-gray-400">Welcome,</p>
                                        <p className="font-bold text-gray-100 truncate">{currentArtisanId}</p>
                                    </div>
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center p-3 mt-2 rounded-lg text-left text-md font-medium text-gray-300 hover:bg-red-800/50 transition-colors"
                                >
                                    <span className="mr-4 text-red-400"><LogoutIcon /></span>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className="w-full flex items-center p-3 rounded-lg text-left text-md font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                            >
                                <span className="mr-4 text-green-400"><UserIcon /></span>
                                Login / Create Account
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
};

export default App;