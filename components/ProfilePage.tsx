
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getSavedCreations } from '../services/storageService';
import { SavedCreation } from '../types';
import UserIcon from './icons/UserIcon';
import LogoutIcon from './icons/LogoutIcon';

interface ProfilePageProps {
    onNavigate: (tool: 'MY_COLLECTION') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
    const { currentArtisanId, logout } = useAuth();
    const [creations, setCreations] = useState<SavedCreation[]>([]);

    useEffect(() => {
        if (currentArtisanId) {
            setCreations(getSavedCreations(currentArtisanId));
        }
    }, [currentArtisanId]);

    if (!currentArtisanId) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-100">Please log in to view your profile.</h2>
            </div>
        );
    }
    
    const creationCounts = creations.reduce((acc, creation) => {
        acc[creation.type] = (acc[creation.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80">
                <div className="p-4 bg-indigo-500/20 rounded-full">
                    <UserIcon className="w-16 h-16 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-gray-100 text-center md:text-left">{currentArtisanId}</h2>
                    <p className="text-gray-400 text-center md:text-left">Artisan Profile</p>
                </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80">
                <h3 className="text-2xl font-bold text-gray-100 mb-6 text-gradient">My Collection Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="bg-slate-800/80 p-6 rounded-lg">
                        <p className="text-4xl font-bold text-indigo-400">{creationCounts.caption || 0}</p>
                        <p className="text-gray-300 mt-1">Saved Captions</p>
                    </div>
                     <div className="bg-slate-800/80 p-6 rounded-lg">
                        <p className="text-4xl font-bold text-purple-400">{creationCounts.image || 0}</p>
                        <p className="text-gray-300 mt-1">Saved Images</p>
                    </div>
                     <div className="bg-slate-800/80 p-6 rounded-lg">
                        <p className="text-4xl font-bold text-teal-400">{creationCounts.video || 0}</p>
                        <p className="text-gray-300 mt-1">Saved Videos</p>
                    </div>
                </div>
                <div className="mt-8 text-center">
                     <button
                        onClick={() => onNavigate('MY_COLLECTION')}
                        className="inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                    >
                        View Full Collection
                    </button>
                </div>
            </div>
             <div className="text-center pt-4">
                 <button
                    onClick={logout}
                    className="inline-flex items-center gap-3 py-2 px-5 rounded-lg text-lg font-medium text-red-400 hover:bg-red-800/50 transition-colors"
                >
                    <LogoutIcon />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;