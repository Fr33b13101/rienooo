import { Router, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';

const me = Router();

// Check if demo mode is enabled
const isDemoMode = process.env.DEMO_MODE === 'true';

// Initialize Supabase client (skip in demo mode)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!isDemoMode && (!supabaseUrl || !supabaseServiceKey)) {
  console.error('Missing required environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = (!isDemoMode && supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Demo user data
const demoUser = {
  id: 'demo_user_id',
  email: 'demo@rieno.app',
  createdAt: '2024-01-01T00:00:00.000Z'
};

me.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    if (isDemoMode) {
      // Demo mode - return demo user
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return res.json({
        success: true,
        data: demoUser,
      });
    }

    // Production mode - use Supabase
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error: Supabase not configured' 
      });
    }

    // Get user data from Supabase
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(req.user.userId);

    if (userError || !userData.user) {
      console.error('Error fetching user:', userError);
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    return res.json({
      success: true,
      data: {
        id: userData.user.id,
        email: userData.user.email!,
        createdAt: userData.user.created_at,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export { me };