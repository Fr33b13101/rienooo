import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getCurrentUser } from '../lib/supabase';
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

  // Initialize auth state and set up auth listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setCheckingAuth(false);
          }
          return;
        }

        if (session?.user && mounted) {
          const currentUser = await getCurrentUser();
          if (currentUser && mounted) {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              createdAt: currentUser.created_at,
            });
          }
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const currentUser = await getCurrentUser();
            if (currentUser && mounted) {
              setUser({
                id: currentUser.id,
                email: currentUser.email || '',
                createdAt: currentUser.created_at,
              });
              navigate('/dashboard');
            }
          } else if (event === 'SIGNED_OUT') {
            if (mounted) {
              setUser(null);
              navigate('/login');
            }
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          if (mounted) {
            addToast('error', 'Authentication error occurred');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, addToast]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          createdAt: data.user.created_at,
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
        throw new Error('Login failed. Please try again');
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error('Google login failed. Please try again');
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          createdAt: data.user.created_at,
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
        throw new Error('Account creation failed. Please try again');
      }
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
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