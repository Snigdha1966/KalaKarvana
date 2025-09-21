
import React from 'react';
import { TOOLS } from '../constants';
import { Tool } from '../types';

interface HomePageProps {
    onNavigate: (tool: Tool) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    // Separate tools for different sections on the home page for better layout
    const featureTools = TOOLS.filter(t => t.id !== Tool.MY_COLLECTION && t.id !== Tool.VIRTUAL_STORE);
    const showcaseTools = TOOLS.filter(t => t.id === Tool.VIRTUAL_STORE);

    return (
        <div className="p-4 md:p-12 space-y-16 text-center animate-fadeIn">
            <header className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-100">
                    Welcome to <span className="text-gradient">KalaKarvan</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
                    Your AI co-pilot for artistic excellence. We provide a suite of intelligent tools designed to empower Indian artisans, helping you create, market, and showcase your craft in the digital age.
                </p>
            </header>

            <main>
                <h2 className="text-4xl font-bold text-gray-100 mb-10">Explore Your Creative Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featureTools.map((tool) => (
                        <div key={tool.id} className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80 text-left flex flex-col items-start transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/20 hover:border-indigo-500">
                            <div className="text-indigo-400 mb-4">
                                {React.cloneElement(tool.icon, { className: "w-10 h-10" })}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-100">{tool.name}</h3>
                            <p className="mt-2 text-gray-400 flex-grow">{tool.description}</p>
                            <button 
                                onClick={() => onNavigate(tool.id)}
                                className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </main>
             <section>
                <h2 className="text-4xl font-bold text-gray-100 mb-10 mt-16">Showcase Your Art</h2>
                 <div className="grid grid-cols-1 gap-8">
                    {showcaseTools.map((tool) => (
                         <div key={tool.id} className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/80 text-left flex flex-col md:flex-row items-start md:items-center transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 hover:border-purple-500">
                           <div className="text-purple-400 mb-4 md:mb-0 md:mr-8">
                                {React.cloneElement(tool.icon, { className: "w-12 h-12" })}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-100">{tool.name}</h3>
                                <p className="mt-2 text-gray-400">{tool.description}</p>
                            </div>
                            <button 
                                onClick={() => onNavigate(tool.id)}
                                className="mt-6 md:mt-0 md:ml-6 flex-shrink-0 bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Visit Gallery
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;