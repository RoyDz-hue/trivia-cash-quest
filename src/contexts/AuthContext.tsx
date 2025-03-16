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

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The DeepInfra API key
// Note: In a production environment, this should be stored in a secure backend service
const DEEPINFRA_API_KEY = "3ZJE3fsTlDv1pLKVtfdNQbRPvwhmfHfF";

// Admin email for automatic recognition
const ADMIN_EMAIL = "cyntoremix@gmail.com";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('AuthProvider initializing');
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
    
    // Fix: Check both conditions for admin status more reliably
    const isAdminUser = Boolean(userData.is_admin) || userData.email === ADMIN_EMAIL;
    console.log('Setting user with profile:', userData);
    console.log('Admin status:', isAdminUser);
    
    setUser({
      id: userData.id,
      username: userData.username || userData.email?.split('@')[0] || 'User',
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
          
          // FIX: Handle the case where profile fetch fails without breaking authentication
          try {
            // Get user profile data
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError) {
              console.error('Error fetching profile data:', profileError);
              // Even if profile fetch fails, still set the user with basic data
              if (session.user) {
                setUserWithAdminStatus({
                  id: session.user.id,
                  email: session.user.email,
                  is_admin: session.user.email === ADMIN_EMAIL
                });
              }
            } else if (profile) {
              setUserWithAdminStatus(profile);
            } else if (session.user) {
              // If profile not found but we have a user, create a minimal user object
              setUserWithAdminStatus({
                id: session.user.id,
                email: session.user.email,
                is_admin: session.user.email === ADMIN_EMAIL
              });
            }
          } catch (profileError) {
            console.error('Profile fetch error:', profileError);
            // Fallback: Create user with basic session data
            if (session.user) {
              setUserWithAdminStatus({
                id: session.user.id,
                email: session.user.email,
                is_admin: session.user.email === ADMIN_EMAIL
              });
            }
          }
        } else {
          console.log('No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
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
            // FIX: Handle the case where profile fetch fails without breaking authentication
            try {
              // Get user profile data
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profileError) {
                console.error('Error fetching profile data:', profileError);
                // Even if profile fetch fails, still set the user with basic data
                if (session.user) {
                  setUserWithAdminStatus({
                    id: session.user.id,
                    email: session.user.email,
                    is_admin: session.user.email === ADMIN_EMAIL
                  });
                }
              } else if (profile) {
                setUserWithAdminStatus(profile);
              } else if (session.user) {
                // If profile not found but we have a user, create a minimal user object
                setUserWithAdminStatus({
                  id: session.user.id,
                  email: session.user.email,
                  is_admin: session.user.email === ADMIN_EMAIL
                });
              }
            } catch (profileError) {
              console.error('Profile fetch error in auth change:', profileError);
              // Fallback: Create user with basic session data
              if (session.user) {
                setUserWithAdminStatus({
                  id: session.user.id,
                  email: session.user.email,
                  is_admin: session.user.email === ADMIN_EMAIL
                });
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            // Still set the user with basic data
            if (session.user) {
              setUserWithAdminStatus({
                id: session.user.id,
                email: session.user.email,
                is_admin: session.user.email === ADMIN_EMAIL
              });
            }
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
        throw error;
      }

      // If this point is reached, auth was successful
      console.log('Authentication successful, checking profile data...');
      
      // Check if it's the admin email for immediate admin status assignment
      const isAdminUser = email === ADMIN_EMAIL;
      
      // FIX: Handle the case where profile fetch fails without breaking authentication
      try {
        // Fetch user profile
        if (data.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Still set user with basic data
            const userData = {
              id: data.user.id,
              email: data.user.email,
              username: data.user.email?.split('@')[0] || 'User',
              is_admin: isAdminUser
            };
            
            setUserWithAdminStatus(userData);
          } else if (profile) {
            console.log('Login successful for:', email, 'Admin status:', isAdminUser || profile.is_admin);
            const userData = {
              id: profile.id,
              username: profile.username,
              email: profile.email,
              phone_number: profile.phone_number || '',
              is_admin: isAdminUser || profile.is_admin || false
            };
            
            setUserWithAdminStatus(userData);
          } else {
            // If profile not found, create a minimal user object
            const userData = {
              id: data.user.id,
              email: data.user.email,
              username: data.user.email?.split('@')[0] || 'User',
              is_admin: isAdminUser
            };
            
            setUserWithAdminStatus(userData);
            console.log('Login successful with minimal profile for:', email, 'Admin status:', isAdminUser);
          }
        }
      } catch (profileError) {
        console.error('Profile error during login:', profileError);
        // Fallback: Set user with basic auth data
        if (data.user) {
          setUserWithAdminStatus({
            id: data.user.id,
            email: data.user.email,
            is_admin: isAdminUser
          });
        }
      }
      
      toast.success('Login successful! Redirecting...');
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
      toast.success('Registration successful! You can now log in.');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
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
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const contextValue = {
    user, 
    isLoading, 
    login, 
    register, 
    logout,
    isAdmin: user?.isAdmin || false,
    deepInfraService,
    setDeepInfraApiKey: (apiKey: string) => setDeepInfraApiKey(apiKey),
    deepInfraApiKey
  };

  console.log('AuthProvider rendering with user:', user?.email, 'isAdmin:', user?.isAdmin);
  
  return (
    <AuthContext.Provider value={contextValue}>
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
