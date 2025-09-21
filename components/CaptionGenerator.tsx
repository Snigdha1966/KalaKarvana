import React, { useState } from 'react';
import { generateCaption } from '../services/geminiService';
import { ImageFile, SavedCaptionContent } from '../types';
import { FileInput } from './shared/FileInput';
import LoaderIcon from './icons/LoaderIcon';
import { saveCreation } from '../services/storageService';
import { useAuth } from './AuthContext';

interface Caption extends SavedCaptionContent {}

const CaptionGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<ImageFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [captions, setCaptions] = useState<Caption[]>([]);
    const [error, setError] = useState('');
    const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});
    const { currentArtisanId, openLoginModal } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            setError('Please describe your artwork.');
            return;
        }
        setLoading(true);
        setError('');
        setCaptions([]);
        setSavedStatus({});
        try {
            const fullPrompt = `Generate 3 creative social media captions for the following artwork description. The tone should be inspiring and aimed at art lovers. Describe the art, its story, and the materials used. Include a title, a caption, and relevant hashtags for each. Here's the description: ${prompt}`;
            const result = await generateCaption(fullPrompt, image || undefined);
            const parsedResult = JSON.parse(result);
            setCaptions(parsedResult.captions || []);
        } catch (err) {
            setError('Failed to generate captions. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCaption = (caption: Caption, index: number) => {
        if (!currentArtisanId) {
            openLoginModal();
            return;
        }
        saveCreation(currentArtisanId, {
            type: 'caption',
            content: caption,
        });
        setSavedStatus(prev => ({ ...prev, [index]: true }));
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-100 text-gradient">Caption Crafter</h2>
                <p className="text-gray-300 mt-2">Let AI help you write the perfect caption for your masterpiece.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80">
                <FileInput onFileSelect={setImage} selectedFile={image} />
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                        Describe your art
                    </label>
                    <textarea
                        id="prompt"
                        rows={8}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3"
                        placeholder="e.g., A hand-thrown ceramic vase, inspired by the monsoon clouds over Kerala. Glazed in shades of grey and blue..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-400/50 transition-transform transform hover:scale-105"
                >
                    {loading ? <LoaderIcon className="w-6 h-6" /> : 'Craft Captions'}
                </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {captions.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-center text-gray-100">Your AI-Generated Captions</h3>
                    {captions.map((cap, index) => (
                        <div key={index} className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-indigo-400 relative transition-all duration-300 hover:shadow-2xl hover:border-purple-400">
                            <h4 className="text-xl font-semibold text-gray-50">{cap.title}</h4>
                            <p className="mt-2 text-gray-300 whitespace-pre-wrap">{cap.caption}</p>
                            <p className="mt-4 text-sm text-indigo-400 font-medium">{cap.hashtags}</p>
                             <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => handleSaveCaption(cap, index)}
                                    disabled={savedStatus[index]}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-green-500 disabled:cursor-not-allowed transition-colors"
                                >
                                    {savedStatus[index] ? 'Saved!' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ))}
                     {!currentArtisanId && (
                        <p className="text-center text-amber-400 bg-amber-900/30 p-3 rounded-lg">
                            Create an account or log in to save your favorite captions to your personal collection.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CaptionGenerator;