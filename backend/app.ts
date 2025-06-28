import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { signup } from './routes/auth/signup';
import { login } from "./routes/auth/login"
import { logout } from './routes/auth/logout';
import { profileRouter } from './routes/profile';
import { TransactionsRouter } from './routes/DebtAndCredit/transactionRouter'


dotenv.config();

const app = express();
const PORT =  5000

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', "http://localhost:5174", "http://localhost:5175",' https://inspiring-platypus-8b7479.netlify.app/'], // Adjust this to your client URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(cookieParser());
app.use(express.json());

// Auth Route
app.use("/auth", login)
app.use("/auth", signup)
app.use("/auth", logout)
app.use("/api", profileRouter);
app.use("/api", TransactionsRouter)



app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Rieno API");
})


app.get("/:param", (req: Request, res: Response) => {
  res.send(`You have accessed the parameter: ${req.params.param}`);
})

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
