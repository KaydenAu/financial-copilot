import { CustomUser, UserProfile } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

// Configuration variables
dotenv.config();
const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;

type TokenUserCredentials = Pick<CustomUser, 'id' | 'email' | 'userName'>;
type TokenProfilePreferences = Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      userName: string;
    }
  }
}

// Shared Token Factory
export const generateAuthToken = (
  user: TokenUserCredentials, 
  profile: TokenProfilePreferences | null, 
  rememberMe: boolean = false
): string => {
    // If rememberMe is true, token lasts 30 days. Otherwise, falls back to your .env setting.
    const expiresIn = rememberMe ? '30d' : jwtExpiresIn;

    const payload = {
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName,
        }, 
        profile: profile ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          preferredCurrency: profile.preferredCurrency,
          timezone: profile.timezone,
          dateFormat: profile.dateFormat,
          numberFormat: profile.numberFormat
        } : null,
    };
    
    return jwt.sign(
        payload, 
        jwtSecret, 
        { expiresIn: expiresIn } as SignOptions,
    );
}

// Shared Shield Middleware: Guards protected profile and workspace routes
export const authenticateToken = (
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ 
            success: false, 
            message: 'Access denied. Token missing.' 
        });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ 
            success: false, 
            message: 'Access denied. Malformed token structure.' 
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        req.user = decoded.user; // Securely attach standard payload details to request stream
        next();
    } catch (error) {
        res.status(403).json({ 
            success: false, 
            message: 'Session expired or token signature manipulation detected.' 
        });
    }
};

  
