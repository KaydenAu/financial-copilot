import dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';

import passport from './google.passport';

const router = Router();

// Configuration variables
dotenv.config();
const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;
const frontendUrl = process.env.FRONTEND_URL as string;

// Keeps token distribution signatures aligned with native modules
const generateAuthToken = (userId: number, email: string, userName: string): string => {
  const payload = {
    id: userId, 
    email: email, 
    username: userName,
  };
  return jwt.sign(
    payload, 
    jwtSecret, 
    { expiresIn: jwtExpiresIn } as SignOptions,
  );
};

// Gateway entry point: GET api/v1/auth/google/login
router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback validation point: GET api/v1/auth/google/callback
router.get(
  '/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const user = req.user as any; 

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated.' });
    }

    const token = generateAuthToken(user.id, user.email, user.userName);

    // Handshakes tracking key to native Angular layout instance
    res.redirect(`${frontendUrl}/auth/oauth-callback?token=${token}`);
  }
);

export default router;