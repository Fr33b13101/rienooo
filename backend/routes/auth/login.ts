import { Router, Request, Response } from 'express';

const login = Router();

login.post('/login', async (req: Request, res: Response) => {
  try {
    // For now, return a placeholder response
    // You can implement actual Supabase auth logic here
    res.json({ 
      message: 'Login endpoint', 
      data: req.body 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { login };