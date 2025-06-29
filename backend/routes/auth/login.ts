import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const login = Router();

// Check if demo mode is enabled
const isDemoMode = process.env.DEMO_MODE === 'true';

// Initialize Supabase client with error handling (skip in demo mode)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-key';

if (!isDemoMode && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing required environment variables: SUPABASE_URL and/or SUPABASE_ANON_KEY');
}

const supabase = (!isDemoMode && supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface LoginRequest {
  email: string;
  password: string;
}

// Demo user data
const demoUser = {
  id: 'demo_user_id',
  email: 'demo@rieno.app',
  created_at: '2024-01-01T00:00:00.000Z'
};

login.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    if (isDemoMode) {
      // Demo mode login - accept any credentials that include "demo"
      if (email.includes('demo') || email === 'demo@rieno.app') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate JWT token for demo user
        const token = jwt.sign(
          { 
            userId: demoUser.id, 
            email: demoUser.email 
          },
          jwtSecret,
          { expiresIn: '7d' }
        );

        // Set HTTP-only cookie
        res.cookie('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({
          success: true,
          data: {
            user: demoUser,
          },
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          error: 'Demo mode: Use demo@rieno.app or any email containing "demo"' 
        });
      }
    }

    // Production mode - use Supabase
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error: Supabase not configured' 
      });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      
      if (authError.message.includes('Invalid login credentials')) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    if (!authData.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication failed' 
      });
    }

    // Generate JWT token for session management
    const token = jwt.sign(
      { 
        userId: authData.user.id, 
        email: authData.user.email 
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          createdAt: authData.user.created_at,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export { login };