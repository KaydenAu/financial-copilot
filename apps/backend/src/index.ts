import cors from "cors";
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";

import passport from "./modules/auth/integrations_google/google.passport"
import authRouter from "./modules/auth/auth.api"
import profileRouter from "./modules/profile/profile.api"
import supportRouter from "./modules/support/support.api"
import categoriesRouter from './modules/categories/categories.api';

dotenv.config();
const port = process.env.PORT;
const frontendUrl = process.env.FRONTEND_URL;

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Permits your Angular frontend application to safely stream network requests
const corsOptions = {
  origin: frontendUrl,
  method: 'GET, HEAD, POST, PATCH, PUT, DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions));

// Mounts the module.
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile/personal-info', profileRouter);
app.use(passport.initialize());
app.use('/api/v1/support', supportRouter);
app.use('/api/v1/categories', categoriesRouter);

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