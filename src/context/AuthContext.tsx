import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

interface AuthContextType {
  user: User | null;
  checkingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
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

  // Initialize auth state - check for existing demo user in localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('demo_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('demo_user');
      } finally {
        setCheckingAuth(false);
      }
    };

    // Simulate loading time
    const timer = setTimeout(initializeAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create demo user
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      
      setUser(demoUser);
      addToast('success', 'Demo login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Demo login error:', error);
      throw new Error('Demo login failed. Please try again');
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create demo user with Google email
      const demoUser: User = {
        id: 'demo-google-user-' + Date.now(),
        email: 'demo@google.com',
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      
      setUser(demoUser);
      addToast('success', 'Demo Google login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Demo Google login error:', error);
      throw new Error('Demo Google login failed. Please try again');
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create demo user
      const demoUser: User = {
        id: 'demo-signup-user-' + Date.now(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      
      setUser(demoUser);
      addToast('success', 'Demo account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Demo signup error:', error);
      throw new Error('Demo account creation failed. Please try again');
    }
  };

  const logout = async () => {
    try {
      // Remove from localStorage
      localStorage.removeItem('demo_user');
      
      setUser(null);
      addToast('success', 'Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      addToast('error', 'Logout failed. Please try again');
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