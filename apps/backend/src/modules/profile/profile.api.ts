import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, generateAuthToken } from '../../utils/auth.utils';

const prisma = new PrismaClient();
const router = Router();

// Mount protection middleware across all actions handled within this sub-router
router.use(authenticateToken);

// GET api/v1/profile/personal-info
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id; 
    const userWithProfile = await prisma.customUser.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!userWithProfile) {
      res.status(404).json({ 
        success: false, 
        message: 'User database row context unavailable.' 
      });
      return;
    }

    const payload = {
      user: {
        email: userWithProfile.email,
        userName: userWithProfile.userName,
      },
      profile: {
        firstName: userWithProfile.profile?.firstName,
        lastName: userWithProfile.profile?.lastName,
        preferredCurrency: userWithProfile.profile?.preferredCurrency,
        timezone: userWithProfile.profile?.timezone,
        dateFormat: userWithProfile.profile?.dateFormat,
        numberFormat: userWithProfile.profile?.numberFormat,
      }
    }

    res.status(200).json({ 
      success: true, 
      data: payload 
    });
  } catch (error) {
    next(error);
  }
});


// PATCH api/v1/profile/personal-info
// Selectively updates modified fields and provisions an upgraded token session.
router.patch('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { user, profile } = req.body;
    
    // Prisma updates only fields that are explicitly provided. 
    // If a property is undefined, Prisma leaves it untouched in the database.
    const updatedUser = await prisma.customUser.update({
      where: { id: userId },
      data: {
        email: user?.email, 
        userName: user?.userName,
        profile: {
          update: {
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            preferredCurrency: profile?.preferredCurrency,
            timezone: profile?.timezone,
            dateFormat: profile?.dateFormat,
            numberFormat: profile?.numberFormat
          }
        },
      },
      include: { profile: true }
    });

    // Generate a fresh token packed with the newly patched claims
    const freshToken = generateAuthToken(updatedUser, updatedUser.profile);

    res.status(200).json({
      success: true,
      message: 'Profile configurations securely merged.',
      user:{
        email: updatedUser.email,
        userName: updatedUser.userName,
      },
      profile: updatedUser.profile,
      token: freshToken
    });
  } catch (error) {
    next(error);
  }
});

// DELETE api/v1/profile/personal-info
// Verifies user authority and completely executes an atomic data purge across relations.
router.delete('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { password } = req.body;

    // Reject immediately if confirmation token / password field payload is missing
    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password confirmation is required to permanently wipe data.'
      });
      return;
    }

    // Fetch account reference including hashed authentication secret
    const targetUser = await prisma.customUser.findUnique({
      where: { id: userId }
    });

    if (!targetUser || !targetUser.passwordHash) {
      res.status(404).json({
        success: false,
        message: 'Active user context could not be resolved.'
      });
      return;
    }

    // Security Gate: Confirm password matches hash before touching production rows
    // Caught by frontend .subscribe error pipeline -> deleteError.set(err.message)
    const isPasswordValid = await bcrypt.compare(password, targetUser.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Wipe request unauthorized. The password provided is incorrect.'
      });
      return;
    }

    // Atomic Database Purge Execution
    // Delete parent identity. Prisma triggers the CASCADE rule, automatically dropping 
    // the related user_profiles and user_password_resets entries from your database footprint.
    await prisma.customUser.delete({
      where: { id: userId }
    });

    res.status(200).json({
      success: true,
      message: 'Your profile data and account records have been permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
