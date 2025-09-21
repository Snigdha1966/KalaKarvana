import { SavedCreation } from '../types';

const getStorageKey = (artisanId: string): string => `kalakarvan_collection_${artisanId}`;

export const getSavedCreations = (artisanId: string): SavedCreation[] => {
    if (!artisanId) return [];

    const key = getStorageKey(artisanId);
    try {
        const items = window.localStorage.getItem(key);
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return [];
    }
};

export const saveCreation = (artisanId: string, creation: Omit<SavedCreation, 'id' | 'createdAt'>) => {
    if (!artisanId) {
        console.warn("No Artisan ID provided. Cannot save creation.");
        return null;
    }

    const key = getStorageKey(artisanId);
    try {
        const creations = getSavedCreations(artisanId);
        const newCreation: SavedCreation = {
            ...creation,
            id: `creation_${Date.now()}`,
            createdAt: Date.now(),
        } as SavedCreation;
        creations.unshift(newCreation); // Add to the beginning
        window.localStorage.setItem(key, JSON.stringify(creations));
        return newCreation;
    } catch (error) {
        console.error("Error saving to localStorage", error);
        return null;
    }
};

export const removeCreation = (artisanId: string, creationId: string) => {
    if (!artisanId) return;
    
    const key = getStorageKey(artisanId);
    try {
        let creations = getSavedCreations(artisanId);
        creations = creations.filter(c => c.id !== creationId);
        window.localStorage.setItem(key, JSON.stringify(creations));
    } catch (error)
    {
        console.error("Error removing from localStorage", error);
    }
};