import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { createDeepInfraService, DeepInfraService } from '@/services/deepInfraService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Omit<User, 'id' | 'isAdmin'>, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  deepInfraService: DeepInfraService | null;
  setDeepInfraApiKey: (apiKey: string) => void;
  deepInfraApiKey: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The DeepInfra API key
// Note: In a production environment, this should be stored in a secure backend service
const DEEPINFRA_API_KEY = "3ZJE3fsTlDv1pLKVtfdNQbRPvwhmfHfF";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deepInfraApiKey, setDeepInfraApiKey] = useState<string>(DEEPINFRA_API_KEY);
  const [deepInfraService, setDeepInfraService] = useState<DeepInfraService | null>(null);

  useEffect(() => {
    // Initialize DeepInfra service with API key
    if (deepInfraApiKey) {
      setDeepInfraService(createDeepInfraService(deepInfraApiKey));
    }
  }, [deepInfraApiKey]);

  useEffect(() => {
    // Check local storage for user data on initial load
    const storedUser = localStorage.getItem('triviaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock implementation that would be replaced with actual Supabase auth
    setIsLoading(true);
    try {
      // Mock login for demo purposes
      const mockUser = {
        id: '1',
        username: email.split('@')[0],
        email,
        phoneNumber: '+254700000000',
        isAdmin: email === 'cyntoremix@gmail.com' || email.includes('admin')
      };
      setUser(mockUser);
      localStorage.setItem('triviaUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin'>, password: string) => {
    // This is a mock implementation that would be replaced with actual Supabase auth
    setIsLoading(true);
    try {
      // Mock registration for demo purposes
      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        ...userData,
        isAdmin: userData.email === 'cyntoremix@gmail.com' || userData.email.includes('admin')
      };
      setUser(mockUser);
      localStorage.setItem('triviaUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('triviaUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      isAdmin: user?.isAdmin || false,
      deepInfraService,
      setDeepInfraApiKey: (apiKey: string) => setDeepInfraApiKey(apiKey),
      deepInfraApiKey
    }}>
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
