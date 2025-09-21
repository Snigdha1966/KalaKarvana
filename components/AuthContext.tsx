import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

const ARTISANS_STORAGE_KEY = 'kalakarvan_artisans';
const CURRENT_ARTISAN_STORAGE_KEY = 'kalakarvan_current_artisan';

interface Artisan {
  id: string;
  password: string;
}

interface AuthContextType {
  currentArtisanId: string | null;
  isLoginModalOpen: boolean;
  signup: (id: string, password: string) => { success: boolean; message: string };
  login: (id: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentArtisanId, setCurrentArtisanId] = useState<string | null>(null);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Load artisans list and current session on initial load
    try {
        const storedArtisans = window.localStorage.getItem(ARTISANS_STORAGE_KEY);
        if (storedArtisans) {
            setArtisans(JSON.parse(storedArtisans));
        }
        const sessionArtisanId = window.localStorage.getItem(CURRENT_ARTISAN_STORAGE_KEY);
        if (sessionArtisanId) {
            setCurrentArtisanId(sessionArtisanId);
        }
    } catch (e) {
        console.error("Failed to parse auth data from localStorage", e);
    }
  }, []);
  
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const signup = (id: string, password: string): { success: boolean; message: string } => {
    const trimmedId = id.trim();

    if (trimmedId.length < 3) {
      return { success: false, message: "Artisan ID must be at least 3 characters long." };
    }
    if (password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters long." };
    }
    if (artisans.find(a => a.id.toLowerCase() === trimmedId.toLowerCase())) {
        return { success: false, message: "This Artisan ID is already taken." };
    }

    // Create the new artisan
    const newArtisan: Artisan = { id: trimmedId, password }; // In a real app, password should be hashed
    const newArtisans = [...artisans, newArtisan];
    setArtisans(newArtisans);
    window.localStorage.setItem(ARTISANS_STORAGE_KEY, JSON.stringify(newArtisans));

    // Now, log in the new user
    window.localStorage.setItem(CURRENT_ARTISAN_STORAGE_KEY, newArtisan.id);
    setCurrentArtisanId(newArtisan.id);
    closeLoginModal();
    return { success: true, message: "Account created and logged in!" };
  };

  const login = (id: string, password: string): { success: boolean; message: string } => {
    const trimmedId = id.trim();
    const artisan = artisans.find(a => a.id.toLowerCase() === trimmedId.toLowerCase());
    
    if (!artisan) {
        return { success: false, message: "Artisan ID not found." };
    }
    if (artisan.password !== password) { // In a real app, compare hashed passwords
        return { success: false, message: "Incorrect password." };
    }
    
    window.localStorage.setItem(CURRENT_ARTISAN_STORAGE_KEY, artisan.id);
    setCurrentArtisanId(artisan.id);
    closeLoginModal();
    return { success: true, message: "Login successful!" };
  };

  const logout = () => {
    window.localStorage.removeItem(CURRENT_ARTISAN_STORAGE_KEY);
    setCurrentArtisanId(null);
  };

  return (
    <AuthContext.Provider value={{ currentArtisanId, isLoginModalOpen, signup, login, logout, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};