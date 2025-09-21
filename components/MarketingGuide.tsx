import React, { useState } from 'react';
import { getMarketingAdvice } from '../services/geminiService';
import LoaderIcon from './icons/LoaderIcon';

const commonQuestions = [
    "How to price my handmade art?",
    "Best way to photograph my sculptures for Instagram?",
    "How to write an engaging 'About Me' page for my website?",
    "What are the best hashtags for a painter on social media?",
    "How to collaborate with other artists or brands?",
];

const MarketingGuide: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e?: React.FormEvent, question?: string) => {
        if(e) e.preventDefault();
        const currentQuery = question || query;
        if (!currentQuery) {
            setError('Please ask a question.');
            return;
        }
        setLoading(true);
        setError('');
        setAnswer('');
        try {
            const result = await getMarketingAdvice(currentQuery);
            setAnswer(result);
        } catch (err) {
            setError('Failed to get advice. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
        setQuery('');
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-100 text-gradient">Digital Guru</h2>
                <p className="text-gray-300 mt-2">Your personal AI guide to mastering digital marketing.</p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/80">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Common Questions</h3>
                <div className="flex flex-wrap gap-3">
                    {commonQuestions.map((q, i) => (
                        <button key={i} onClick={() => handleSubmit(undefined, q)} className="px-4 py-2 text-sm bg-amber-400/20 text-amber-300 rounded-full hover:bg-amber-400/30 transition-all transform hover:scale-105 font-medium">
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80">
                <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-300">
                        Ask a question
                    </label>
                    <input
                        type="text"
                        id="query"
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3"
                        placeholder="e.g., How do I create an Instagram Reel for my new painting?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-400/50 transition-transform transform hover:scale-105"
                >
                    {loading ? <LoaderIcon className="w-6 h-6" /> : 'Get Advice'}
                </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {loading && (
                 <div className="flex justify-center items-center p-6">
                    <LoaderIcon className="w-8 h-8 text-indigo-400" />
                 </div>
            )}
            
            {answer && (
                <div className="bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/80 prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-gray-100 text-gradient">Here's your advice:</h3>
                    <div className="mt-4 leading-relaxed whitespace-pre-wrap">{answer}</div>
                </div>
            )}
        </div>
    );
};

export default MarketingGuide;