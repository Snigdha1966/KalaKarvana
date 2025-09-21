
import React, { useState } from 'react';
import { getArtStyleAdvice } from '../services/geminiService';
import { ImageFile } from '../types';
import { FileInput } from './shared/FileInput';
import LoaderIcon from './icons/LoaderIcon';

const commonQuestions = [
    "What traditional Indian art form does this resemble?",
    "Suggest 3 ways to evolve this style.",
    "Describe the mood and tone of this artwork.",
    "What kind of audience would appreciate this art style?",
];

const ArtStyleAdvisor: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<ImageFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');

    const handleSubmit = async (e?: React.FormEvent, question?: string) => {
        if (e) e.preventDefault();
        const finalPrompt = question || prompt;
        
        if (!image) {
            setError('Please upload an image of your artwork.');
            return;
        }
        if (!finalPrompt) {
            setError('Please ask a question about your art style.');
            return;
        }

        setLoading(true);
        setError('');
        setAnswer('');
        setCurrentQuestion(finalPrompt);

        try {
            const systemPrompt = `You are an expert art critic and historian, specializing in both traditional Indian art forms and contemporary global styles. Analyze the provided image and the user's question. Give a thoughtful, constructive, and encouraging analysis. Here is the user's question: "${finalPrompt}"`;
            const result = await getArtStyleAdvice(systemPrompt, image);
            setAnswer(result);
        } catch (err) {
            setError('Failed to get advice. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
        setPrompt('');
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-100 text-gradient">Art Style Advisor</h2>
                <p className="text-gray-300 mt-2">Get constructive AI feedback on your unique artistic style.</p>
            </div>
            
            <div className="space-y-6 bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80">
                <FileInput onFileSelect={setImage} selectedFile={image} />
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-200 mb-3">Or, select a common question:</h3>
                    <div className="flex flex-wrap gap-3">
                        {commonQuestions.map((q, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleSubmit(undefined, q)}
                                disabled={!image || loading}
                                className="px-4 py-2 text-sm bg-amber-400/20 text-amber-300 rounded-full hover:bg-amber-400/30 transition-all transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                            Ask your own question
                        </label>
                        <input
                            type="text"
                            id="prompt"
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3"
                            placeholder="e.g., How can I blend this with modern abstract elements?"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !image || !prompt}
                        className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-400/50 transition-transform transform hover:scale-105"
                    >
                        {loading ? <LoaderIcon className="w-6 h-6" /> : 'Get Feedback'}
                    </button>
                </form>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {loading && (
                 <div className="flex justify-center items-center p-6">
                    <LoaderIcon className="w-8 h-8 text-indigo-400" />
                 </div>
            )}
            
            {answer && (
                <div className="bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/80 prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-100">Feedback on: <span className="text-gradient font-semibold italic">"{currentQuestion}"</span></h3>
                    <div className="mt-4 leading-relaxed whitespace-pre-wrap">{answer}</div>
                </div>
            )}
        </div>
    );
};

export default ArtStyleAdvisor;