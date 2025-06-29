import { Router, Request, Response } from 'express';

const profileRouter = Router();

profileRouter.get('/profile', async (req: Request, res: Response) => {
  try {
    // For now, return a placeholder response
    res.json({ 
      message: 'Profile endpoint'
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { profileRouter };