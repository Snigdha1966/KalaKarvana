import React, { useState, useEffect } from 'react';
import { getSavedCreations, removeCreation } from '../services/storageService';
import { SavedCreation, SavedCaptionContent } from '../types';
import { useAuth } from './AuthContext';

const MyCollection: React.FC = () => {
    const [creations, setCreations] = useState<SavedCreation[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const { currentArtisanId } = useAuth();

    useEffect(() => {
        if (currentArtisanId) {
            setCreations(getSavedCreations(currentArtisanId));
        } else {
            setCreations([]);
        }
    }, [currentArtisanId]);

    const handleDelete = (id: string) => {
        if (!currentArtisanId) return;
        removeCreation(currentArtisanId, id);
        setCreations(creations.filter(c => c.id !== id));
    };

    const handleCopy = (captionContent: SavedCaptionContent, id: string) => {
        const textToCopy = `${captionContent.title}\n\n${captionContent.caption}\n\n${captionContent.hashtags}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownloadCaption = (captionContent: SavedCaptionContent) => {
        const textToCopy = `${captionContent.title}\n\n${captionContent.caption}\n\n${captionContent.hashtags}`;
        const blob = new Blob([textToCopy], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${captionContent.title.replace(/\s+/g, '_').toLowerCase() || 'caption'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const savedCaptions = creations.filter(c => c.type === 'caption');
    const savedVideos = creations.filter(c => c.type === 'video');
    const savedImages = creations.filter(c => c.type === 'image');

    if (creations.length === 0) {
        return (
            <div className="p-4 md:p-8 text-center h-full flex flex-col justify-center items-center">
                 <div className="bg-slate-900/70 backdrop-blur-sm p-12 rounded-2xl shadow-lg border border-gray-700/80">
                    <svg className="mx-auto h-16 w-16 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    <h2 className="mt-6 text-3xl font-bold text-gray-100">Your Collection is Empty</h2>
                    <p className="text-gray-300 mt-4 max-w-md">Start by generating captions or videos and save your favorites here!</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 md:p-8 space-y-12 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-100 text-gradient">My Collection</h2>
                <p className="text-gray-300 mt-2">Your saved creations, ready to use.</p>
            </div>

            {savedCaptions.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-100 mb-6">Saved Captions</h3>
                    <div className="space-y-6">
                        {savedCaptions.map((creation) => {
                             if (creation.type !== 'caption') return null;
                             return (
                                <div key={creation.id} className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-indigo-400 relative transition-all duration-300 hover:shadow-2xl hover:border-purple-400">
                                    <h4 className="text-xl font-semibold text-gray-50">{creation.content.title}</h4>
                                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">{creation.content.caption}</p>
                                    <p className="mt-4 text-sm text-indigo-400 font-medium">{creation.content.hashtags}</p>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => handleDownloadCaption(creation.content)} className="p-2 text-gray-400 hover:text-indigo-400 transition-colors" aria-label="Download caption">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        </button>
                                        <button onClick={() => handleCopy(creation.content, creation.id)} className="p-2 text-gray-400 hover:text-indigo-400 transition-colors" aria-label="Copy caption">
                                           {copiedId === creation.id ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                           ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                           )}
                                        </button>
                                        <button onClick={() => handleDelete(creation.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete caption">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                </section>
            )}

            {savedImages.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-100 mb-6">Saved Images</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {savedImages.map((creation) => {
                             if (creation.type !== 'image') return null;
                            return (
                                <div key={creation.id} className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg relative transition-all duration-300 hover:shadow-2xl border border-gray-700/80">
                                    <img src={creation.content.editedImageBase64Url} alt="Edited art" className="w-full rounded-lg mb-2"/>
                                    <p className="text-sm text-gray-400 italic">"{creation.content.prompt}"</p>
                                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                                        <a href={creation.content.editedImageBase64Url} download={`kalakarvan-edited-${creation.id}.png`} className="p-2 bg-black/40 rounded-full text-white hover:bg-indigo-600 transition-colors" aria-label="Download image">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        </a>
                                        <button onClick={() => handleDelete(creation.id)} className="p-2 bg-black/40 rounded-full text-white hover:bg-red-600 transition-colors" aria-label="Delete image">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {savedVideos.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-100 mb-6">Saved Videos</h3>
                    <div className="grid md:grid-cols-1 gap-8">
                        {savedVideos.map((creation) => {
                             if (creation.type !== 'video') return null;
                            return (
                                <div key={creation.id} className="bg-slate-90ü0/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg relative transition-all duration-300 hover:shadow-2xl border border-gray-700/80">
                                    <video controls src={creation.content.videoUrl} className="w-full rounded-lg mb-2"></video>
                                    <p className="text-sm text-gray-400 italic">"{creation.content.prompt}"</p>
                                    <p className="text-xs text-gray-500 mt-2">Note: Saved videos are only available for the current session.</p>
                                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                                        <a href={creation.content.videoUrl} download={`kalakarvan-video-${creation.id}.mp4`} className="p-2 bg-black/40 rounded-full text-white hover:bg-indigo-600 transition-colors" aria-label="Download video">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        </a>
                                        <button onClick={() => handleDelete(creation.id)} className="p-2 bg-black/40 rounded-full text-white hover:bg-red-600 transition-colors" aria-label="Delete video">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

        </div>
    );
};

export default MyCollection;