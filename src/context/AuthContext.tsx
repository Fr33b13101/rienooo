import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { apiClient } from '../lib/api';

interface AuthContextType {
  user: User | null;
  checkingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  checkingAuth: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const response = await apiClient.getCurrentUser();
        
        if (response.success && response.data && mounted) {
          setUser({
            id: response.data.id,
            email: response.data.email,
            createdAt: response.data.createdAt,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      
      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }
      
      if (response.data?.user) {
        setUser({
          id: response.data.user.id,
          email: response.data.user.email,
          createdAt: response.data.user.createdAt,
        });
        addToast('success', 'Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Please check your email and confirm your account');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please try again later');
      } else {
        throw new Error(error.message || 'Login failed. Please try again');
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      // For now, show a message that Google login is not implemented
      addToast('info', 'Google login will be implemented soon');
      throw new Error('Google login not yet implemented');
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error('Google login failed. Please try again');
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await apiClient.signup({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Signup failed');
      }
      
      if (response.data?.user) {
        setUser({
          id: response.data.user.id,
          email: response.data.user.email,
          createdAt: response.data.user.createdAt,
        });
        addToast('success', 'Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error types
      if (error.message?.includes('User already registered')) {
        throw new Error('An account with this email already exists');
      } else if (error.message?.includes('Password should be at least')) {
        throw new Error('Password must be at least 6 characters long');
      } else if (error.message?.includes('Invalid email')) {
        throw new Error('Please enter a valid email address');
      } else {
        throw new Error(error.message || 'Account creation failed. Please try again');
      }
    }
  };

  const logout = async () => {
    try {
      const response = await apiClient.logout();
      
      if (!response.success) {
        console.warn('Logout request failed, but clearing local state');
      }
      
      setUser(null);
      addToast('success', 'Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      addToast('success', 'Logged out successfully');
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        checkingAuth,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};