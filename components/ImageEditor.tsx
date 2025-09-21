import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { ImageFile } from '../types';
import { FileInput } from './shared/FileInput';
import LoaderIcon from './icons/LoaderIcon';
import { saveCreation } from '../services/storageService';
import { useAuth } from './AuthContext';

const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<ImageFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [editedText, setEditedText] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const { currentArtisanId, openLoginModal } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || !image) {
            setError('Please upload an image and provide an editing instruction.');
            return;
        }
        setLoading(true);
        setError('');
        setEditedImage(null);
        setEditedText(null);
        setIsSaved(false);
        try {
            const result = await editImage(prompt, image);
            const imagePart = result.candidates?.[0]?.content.parts.find(p => p.inlineData);
            const textPart = result.candidates?.[0]?.content.parts.find(p => p.text);
            
            if (imagePart?.inlineData) {
                const base64 = imagePart.inlineData.data;
                const mimeType = imagePart.inlineData.mimeType;
                setEditedImage(`data:${mimeType};base64,${base64}`);
            }
            if(textPart?.text) {
                setEditedText(textPart.text);
            }

            if (!imagePart) {
                setError("The AI couldn't generate an image. It might have described why in the text response.");
            }

        } catch (err) {
            setError('Failed to edit the image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSaveImage = () => {
        if (!editedImage || !image || !prompt) return;
        if (!currentArtisanId) {
            openLoginModal();
            return;
        }
        saveCreation(currentArtisanId, {
            type: 'image',
            content: {
                prompt,
                originalImageBase64: image.base64,
                originalImageMimeType: image.mimeType,
                editedImageBase64Url: editedImage,
            }
        });
        setIsSaved(true);
    };

    const handleDownloadImage = () => {
        if (!editedImage) return;
        const link = document.createElement('a');
        link.href = editedImage;
        link.download = `kalakarvan-edited-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-100 text-gradient">Image Alchemist</h2>
                <p className="text-gray-300 mt-2">Transform your photos with the magic of AI.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80">
                <FileInput onFileSelect={setImage} selectedFile={image} />
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                        How should I edit this image?
                    </label>
                    <textarea
                        id="prompt"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3"
                        placeholder="e.g., Add a rustic wooden frame, make the background a blurred artist studio..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !image}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-400/50 transition-transform transform hover:scale-105"
                >
                    {loading ? <LoaderIcon className="w-6 h-6" /> : 'Transform Image'}
                </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {(editedImage || editedText) && (
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {image && (
                         <div className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-700/80">
                            <h3 className="text-xl font-bold text-center text-gray-100 mb-4">Original</h3>
                            <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Original" className="rounded-lg shadow-md w-full"/>
                         </div>
                    )}
                    <div className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-700/80 space-y-4">
                        <h3 className="text-xl font-bold text-center text-gray-100 mb-4">AI Edited Version</h3>
                        {editedImage && <img src={editedImage} alt="Edited" className="rounded-lg shadow-md w-full"/>}
                        {editedText && <p className="mt-4 bg-gray-800 p-4 rounded-md text-gray-300">{editedText}</p>}
                        {editedImage && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                                <button onClick={handleDownloadImage} className="inline-flex w-full sm:w-auto items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                    Download Image
                                </button>
                                <button 
                                    onClick={handleSaveImage}
                                    disabled={isSaved}
                                    className="inline-flex w-full sm:w-auto items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-200 bg-indigo-500/30 hover:bg-indigo-500/40 disabled:bg-green-500/30 disabled:text-green-300 disabled:cursor-not-allowed"
                                >
                                    {isSaved ? 'Saved to Collection' : 'Save to Collection'}
                                </button>
                            </div>
                        )}
                         {!currentArtisanId && editedImage && (
                            <p className="text-center text-sm text-amber-400 pt-2">
                                Log in or create an ID to save your edited image.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageEditor;