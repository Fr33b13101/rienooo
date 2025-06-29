import { Router, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';

const me = Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

me.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
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

    res.json({
      success: true,
      data: {
        id: userData.user.id,
        email: userData.user.email!,
        createdAt: userData.user.created_at,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export { me };