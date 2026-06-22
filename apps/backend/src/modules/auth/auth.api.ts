import bcrypt from 'bcrypt';
import { PrismaClient, Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { Router, Request, Response, NextFunction } from 'express';

import googleAuthRouter from './integrations_google/google.api';
import passport from './integrations_google/google.passport';
import { sendPasswordResetEmail } from './nodemailer.config';
import { generateAuthToken } from '../../utils/auth.utils';

const prisma = new PrismaClient();
const router = Router();

// Mount google passport middleware stack onto authentication endpoints
router.use(passport.initialize());
router.use('/google', googleAuthRouter);

// POST api/v1/auth/register
// Pipeline for user registration and transactional profile allocation
router.post('/register/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const data = {...req.body, ...req.query} ;
        const { userName, email, password, rememberMe } = data;
        if (!email || !userName || !password || !rememberMe) {
            res.status(400).json({ 
                success: false,
                message: 'Missing required registration properties.' 
            });
            return;
        }

        // Check for unique constraint collisions beforehand
        const existingUser = await prisma.customUser.findFirst({
            where: { OR: [{ email }, { userName }] }
        });
        
        if (existingUser) {
            res.status(400).json({ 
                success: false,
                message: 'Email address or username is already registered.' 
            });
            return;
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Enforce an atomic transaction: Create both security identity and personal workspace together
        const newCustomUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const user = await tx.customUser.create({
              data: {
                  email,
                  userName,
                  passwordHash,
                  // Defaults: isUser: true, isAdmin: false, isActive: true
              }
            });
            const profile = await tx.userProfile.create({
              data: {
                userId: user.id,
                // Defaults: preferredCurrency: "MYR", timezone: "Asia/Kuala_Lumpur",
                //           dateFormat: "DD/MM/YYYY", numberFormat: "comma-dot"
              }
            });
            return { ...user, profile };
        });

        const token = generateAuthToken(
          newCustomUser, 
          newCustomUser.profile,
          rememberMe === true || rememberMe === 'true'
        );

        res.status(201).json({ 
            success: true, 
            message: 'Account registered successfully.',  
            token 
        });
    } catch (error) {
        next(error);
    }    
});

// POST api/v1/auth/login
// Validates identity metrics and issues access keys
router.post('/login/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const data = {...req.body, ...req.query};
        const { email, password } = data;

        if (!email || !password) {
            res.status(400).json({ 
                success: false, 
                message: 'Email and password fields are required.' 
            });
            return;
        }

        const user = await prisma.customUser.findUnique({ 
          where: { email },
          include: { profile: true } 
        });

        if (!user) {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password'
            });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({ 
                success: false, 
                message: 'This account has been deactivated.' 
            });
            return;
        }

        // TYPE GUARD: Handles users who signed up via Google OAuth and don't have a password
        if (!user.passwordHash) {
            res.status(401).json({ 
                success: false, 
                message: 'This account uses Google Login. Please log in using Google.' 
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
            return;
        }

        const token = generateAuthToken(user, user.profile);
        res.status(200).json({ 
            success: true, 
            message: 'Login Successful', 
            token
        });
    } catch(error) {
        next(error);
    }
})


// POST api/v1/auth/forgot-password
// Stage 1 Recovery: Creates temporary tracking records and drops notification events
router.post('/forgot-password/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = {...req.body, ...req.query};
    const { email } = data;

    if (!email) {
      res.status(400).json({ 
        message: 'Target notification email address required.' 
      });
      return;
    }

    const user = await prisma.customUser.findUnique({ where: { email } });
    
    // Security Best Practice: Even if user does not exist, don't leak the account status.
    // Return 200 OK regardless to mitigate account enumeration vulnerabilities.
    if (!user) {
      res.status(200).json({ 
        message: 'If the account exists, a recovery link has been dispatched.' 
      });
      return;
    }

    const secureToken = randomBytes(32).toString('hex');
    const tokenLifespan = 1 * 60 * 60 * 1000; // 1 hour expiration window
    const expiresAt = new Date(Date.now() + tokenLifespan);

    console.log("You are here")
    // Upsert the reset token record (updates if one already exists for the user)
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: { token: secureToken, expiredAt: expiresAt },
      create: { userId: user.id, token: secureToken, expiredAt: expiresAt }
    });

    await sendPasswordResetEmail(email, secureToken);
    res.status(200).json({ 
      message: 'If the account exists, a recovery link has been dispatched.' 
    });
  } catch (error) {
    next(error);
  }
});


// POST api/v1/auth/reset-password
// Stage 2 Recovery: Verifies the provided cryptographic token, changes credentials and returns a session token
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = {...req.body, ...req.query};
    const { token, newPassword } = data;

    if (!token || !newPassword) {
      res.status(400).json({ 
        message: 'Token parameters and target password configurations required.' 
      });
      return;
    }

    // Locate token context structure
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: { include: { profile: true } } }
    });

    if (!resetRecord) {
      res.status(400).json({ 
        message: 'The recovery link is invalid or has expired.' 
      });
      return;
    }

    // Verify expiration constraints
    if (new Date() > resetRecord.expiredAt) {
      // Clear expired record from system memory proactively
      await prisma.passwordReset.delete({ where: { token } });
      res.status(400).json({ 
        message: 'The recovery link is invalid or has expired.' 
      });
      return;
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Atomic password update and verification token cleanup
    await prisma.$transaction([
      prisma.customUser.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newPasswordHash }
      }),
      prisma.passwordReset.delete({
        where: { token }
      })
    ]);

    // Matches your frontend's expectation ("Update Password & Log In") by returning a new JWT session
    const freshToken = generateAuthToken(resetRecord.user, resetRecord.user.profile);
    res.status(200).json({ 
      token: freshToken, 
      message: 'Password reset successfully. You are now logged in.' 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
