import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Sign in error:', error);
    
    // Handle network errors
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again');
    }
    
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    // Handle network errors
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again');
    }
    
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    
    // Handle network errors
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again');
    }
    
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Sign out error:', error);
    
    // Handle network errors
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again');
    }
    
    throw error;
  }
};