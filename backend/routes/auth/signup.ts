import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const signup = Router();

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

signup.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName }: SignupRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for simplicity
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      
      if (authError.message.includes('already registered')) {
        return res.status(400).json({ 
          success: false, 
          error: 'An account with this email already exists' 
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    if (!authData.user) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create user' 
      });
    }

    // Create user profile in the users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        full_name: firstName && lastName ? `${firstName} ${lastName}` : null,
        display_name: firstName || null,
      }]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the signup if profile creation fails
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
    console.error('Signup error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export { signup };