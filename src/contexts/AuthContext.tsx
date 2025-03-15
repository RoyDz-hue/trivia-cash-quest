
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { createDeepInfraService, DeepInfraService } from '@/services/deepInfraService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Admin email for automatic recognition
const ADMIN_EMAIL = "cyntoremix@gmail.com";

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

  // Function to set user with proper admin status
  const setUserWithAdminStatus = (userData: any) => {
    if (!userData) {
      setUser(null);
      return;
    }
    
    const isAdminUser = userData.is_admin || userData.email === ADMIN_EMAIL;
    console.log('Setting user with profile:', userData);
    console.log('Admin status:', isAdminUser);
    
    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phone_number || '',
      isAdmin: isAdminUser
    });
  };

  useEffect(() => {
    // Check for active Supabase session on initial load
    const checkSession = async () => {
      setIsLoading(true);
      try {
        console.log('Checking session...');
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log('Session found:', session.user.email);
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            setIsLoading(false);
            return;
          }

          if (profile) {
            setUserWithAdminStatus(profile);
          }
        } else {
          console.log('No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          try {
            // Get user profile data
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile data:', profileError);
              setIsLoading(false);
              return;
            }

            if (profile) {
              setUserWithAdminStatus(profile);
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Attempting login with:', email);
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        throw error;
      }

      // If this point is reached, auth was successful
      toast.success('Login successful!');
      
      // Check if it's the admin email for immediate redirection
      const isAdminUser = email === ADMIN_EMAIL;
      
      // Fetch user profile
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setIsLoading(false);
          throw profileError;
        }
        
        if (profile) {
          console.log('Login successful for:', email, 'Admin status:', isAdminUser || profile.is_admin);
          const userData = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            phone_number: profile.phone_number || '',
            is_admin: isAdminUser || profile.is_admin || false
          };
          
          setUserWithAdminStatus(userData);
        }
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin'>, password: string) => {
    console.log('Attempting registration for:', userData.email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          data: {
            username: userData.username,
            phone_number: userData.phoneNumber
          }
        }
      });

      if (error) {
        throw error;
      }

      // If it's the admin email, manually set the admin flag
      const isAdminUser = userData.email === ADMIN_EMAIL;

      // Set user immediately if possible
      if (data.user) {
        setUser({
          id: data.user.id,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          isAdmin: isAdminUser
        });
      }
      
      console.log('Registration successful for:', userData.email);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Attempting logout');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
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
