import dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports
dotenv.config({ path: '../.env' });

import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { signup } from './routes/auth/signup';
import { login } from "./routes/auth/login"
import { logout } from './routes/auth/logout';
import { me } from './routes/auth/me';
import { profileRouter } from './routes/profile';
import { TransactionsRouter } from './routes/DebtAndCredit/transactionRouter'

const app = express();

// Check for required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please create a .env file in the root directory with the required variables.');
  console.error('See backend/.env.example for reference.');
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'https://inspiring-platypus-8b7479.netlify.app',
    /\.netlify\.app$/,
    /\.netlify\.live$/
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  const envStatus = missingEnvVars.length === 0 ? 'configured' : 'missing variables';
  res.json({ 
    message: "Welcome to Rieno API", 
    status: "running",
    environment: envStatus,
    missingVars: missingEnvVars.length > 0 ? missingEnvVars : undefined
  });
});

// Auth Routes
app.use("/auth", login)
app.use("/auth", signup)
app.use("/auth", logout)
app.use("/auth", me)
app.use("/api", profileRouter);
app.use("/api", TransactionsRouter)

app.get("/:param", (req: Request, res: Response) => {
  res.json({ message: `You have accessed the parameter: ${req.params.param}` });
})

// Export the app for serverless deployment
export default app;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (missingEnvVars.length > 0) {
      console.log('⚠️  Warning: Missing environment variables. Some features may not work.');
    } else {
      console.log('✅ All environment variables configured');
    }
  });
}