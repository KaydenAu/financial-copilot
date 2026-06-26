import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration variables
dotenv.config();
const clientId = process.env.GOOGLE_CLIENT_ID as string;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

passport.use(
  new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback', // Must match your Google Cloud Console redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const userName = profile.displayName || profile.username || `user_${profile.id}`;

        // Ensure email exists before passing it to database queries
        if (!email) {
          return done(new Error('No email returned from Google provider'), undefined);
        }

        // Check if user already exists
        let user = await prisma.customUser.findUnique({ where: { email } });

        // If they don't exist, provision them atomically
        if (!user) {
          user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const newUser = await tx.customUser.create({
              data: {
                email,
                userName,
                passwordHash: null, // Expresses that this account was created via OAuth provider
              },
            });

            await tx.userProfile.create({
              data: {
                userId: newUser.id,
                preferredCurrency: 'MYR',
              },
            });

            return newUser;
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

export default passport;