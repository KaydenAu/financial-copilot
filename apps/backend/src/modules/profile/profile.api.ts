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
    const userProfile = await prisma.customUser.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!userProfile) {
      res.status(404).json({ 
        success: false, 
        message: 'User database row context unavailable.' 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: userProfile 
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
    const { email, profile } = req.body;

    console.log('INSIDE THE PATCH');
    console.log("email is", email);
    console.log("profile is", profile);

    // Prisma updates only fields that are explicitly provided. 
    // If a property is undefined, Prisma leaves it untouched in the database.
    const updatedUser = await prisma.customUser.update({
      where: { id: userId },
      data: {
        email: email, // Updates if passed, ignored if undefined
        profile: {
          update: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            preferredCurrency: profile.preferredCurrency,
            timezone: profile.timezone,
            dateFormat: profile.dateFormat,
            numberFormat: profile.numberFormat
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
      token: freshToken
    });
  } catch (error) {
    next(error);
  }
});

export default router;
