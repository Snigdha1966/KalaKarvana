import React, { useState, useEffect } from 'react';
import { generateVideo, checkVideoStatus } from '../services/geminiService';
import { ImageFile } from '../types';
import { FileInput } from './shared/FileInput';
import LoaderIcon from './icons/LoaderIcon';
import { saveCreation } from '../services/storageService';
import { useAuth } from './AuthContext';

const loadingMessages = [
    "Warming up the digital canvas...",
    "Mixing the colors of your story...",
    "This can take a few minutes. Great art needs patience!",
    "Rendering the first few frames...",
    "Adding cinematic touches...",
    "Almost there, finalizing your video story...",
];

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<ImageFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [isSaved, setIsSaved] = useState(false);
    const { currentArtisanId, openLoginModal } = useAuth();
    
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    return loadingMessages[(currentIndex + 1) % loadingMessages.length];
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    const pollOperation = async (operation: any) => {
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            try {
                operation = await checkVideoStatus(operation);
            } catch (err) {
                setError("Failed while checking video status. Please try again.");
                console.error(err);
                setLoading(false);
                return;
            }
        }

        if (operation.response?.generatedVideos?.[0]?.video?.uri) {
            const downloadLink = operation.response.generatedVideos[0].video.uri;
            const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        } else {
            setError("Video generation complete, but no video was returned.");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            setError('Please describe the story for your video.');
            return;
        }
        setLoading(true);
        setError('');
        setVideoUrl(null);
        setIsSaved(false);
        setLoadingMessage(loadingMessages[0]);
        try {
            const initialOperation = await generateVideo(prompt, image || undefined);
            await pollOperation(initialOperation);
        } catch (err) {
            setError('Failed to start video generation. Please try again.');
            console.error(err);
            setLoading(false);
        }
    };

    const handleSaveVideo = () => {
        if (videoUrl && prompt) {
            if (!currentArtisanId) {
                openLoginModal();
                return;
            }
            saveCreation(currentArtisanId, {
                type: 'video',
                content: { prompt, videoUrl }
            });
            setIsSaved(true);
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-100 text-gradient">Story Weaver</h2>
                <p className="text-gray-300 mt-2">Turn your artistic journey into a captivating video.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80">
                <FileInput onFileSelect={setImage} selectedFile={image} />
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                        Tell your story
                    </label>
                    <textarea
                        id="prompt"
                        rows={8}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3"
                        placeholder="e.g., The journey of creating my 'Madubani Peacock' painting, from the first sketch to the final intricate details..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-400/50 transition-transform transform hover:scale-105"
                >
                    {loading ? <><LoaderIcon className="w-6 h-6 mr-3" /> Weaving your story...</> : 'Generate Video'}
                </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {loading && (
                <div className="text-center p-6 bg-indigo-900/50 backdrop-blur-sm rounded-2xl shadow-md">
                    <p className="text-indigo-300 font-semibold">{loadingMessage}</p>
                </div>
            )}
            
            {videoUrl && (
                <div className="space-y-4 bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/80">
                    <h3 className="text-3xl font-bold text-center text-gray-100">Your Video is Ready!</h3>
                    <video controls src={videoUrl} className="w-full rounded-lg shadow-lg mt-4"></video>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                        <a href={videoUrl} download={`kalakarvan-video-${Date.now()}.mp4`} className="inline-flex w-full sm:w-auto items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Download Video
                        </a>
                        <button 
                            onClick={handleSaveVideo}
                            disabled={isSaved}
                            className="inline-flex w-full sm:w-auto items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-200 bg-indigo-500/30 hover:bg-indigo-500/40 disabled:bg-green-500/30 disabled:text-green-300 disabled:cursor-not-allowed"
                        >
                            {isSaved ? 'Saved to Collection' : 'Save to Collection'}
                        </button>
                    </div>
                     <p className="text-xs text-gray-500 text-center mt-2">Note: Saved videos are only available for the current session. Please download for permanent storage.</p>
                     {!currentArtisanId && (
                        <p className="text-center text-sm text-amber-400 pt-2">
                            Log in or create an ID to save your video to your personal collection.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoGenerator;