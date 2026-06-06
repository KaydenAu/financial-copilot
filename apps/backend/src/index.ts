import cors from "cors";
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";

import authRouter from "./modules/auth/auth.api"
import passport from "./modules/auth/integrations_google/google.passport"

dotenv.config();
const port = process.env.PORT;
const frontendUrl = process.env.FRONTEND_URL;

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Permits your Angular frontend application to safely stream network requests
const corsOptions = {
  origin: frontendUrl,
  method: 'GET, HEAD, POST, PATCH, PUT, DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions));

// Mounts the authentication module.
app.use('/api/v1/auth', authRouter);
app.use(passport.initialize());

// Intercepts errors passed via next(error) from your async route handlers
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server exception caught:', error);
  
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    message: error.message || 'An unexpected internal server error occurred.',
  });
});

app.listen(port, () => {
  console.log(`[SERVER] Backend active and listening on port ${port}`);
});