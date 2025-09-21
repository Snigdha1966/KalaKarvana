import React from 'react';

const products = [
    { id: 1, name: 'Hand-painted "Pichwai" Cow', artist: 'Rina Devi', price: '₹7,500', image: 'https://picsum.photos/seed/pichwai/600/800' },
    { id: 2, name: 'Terracotta Warrior Horse', artist: 'Sanjay Kumar', price: '₹4,200', image: 'https://picsum.photos/seed/terracotta/600/800' },
    { id: 3, name: 'Blue Pottery Vase', artist: 'Amina Khatun', price: '₹3,800', image: 'https://picsum.photos/seed/pottery/600/800' },
    { id: 4, name: 'Madhubani Fish Tapestry', artist: 'Mithilesh Jha', price: '₹9,000', image: 'https://picsum.photos/seed/madhubani/600/800' },
    { id: 5, name: 'Bronze Nataraja Statue', artist: 'K. Subramanian', price: '₹15,000', image: 'https://picsum.photos/seed/bronze/600/800' },
    { id: 6, name: 'Pattachitra Scroll Painting', artist: 'Gouranga Das', price: '₹6,500', image: 'https://picsum.photos/seed/pattachitra/600/800' },
    { id: 7, name: 'Kalamkari Fabric Art', artist: 'Padma Reddy', price: '₹5,100', image: 'https://picsum.photos/seed/kalamkari/600/800' },
    { id: 8, name: 'Warli Village Life', artist: 'Jivya Soma Mashe', price: '₹8,200', image: 'https://picsum.photos/seed/warli/600/800' },
];

const VirtualStore: React.FC = () => {
    return (
        <div className="p-4 md:p-8">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-gray-100 text-gradient">The Artisan's Gallery</h2>
                <p className="text-gray-300 mt-4 max-w-2xl mx-auto">A curated collection of timeless Indian artistry. Explore, admire, and support the incredible talent of our nation's artisans.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="group relative bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <h3 className="text-lg font-bold">{product.name}</h3>
                            <p className="text-sm opacity-90">by {product.artist}</p>
                            <p className="mt-2 text-xl font-semibold">{product.price}</p>
                        </div>
                         <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            View Details
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VirtualStore;