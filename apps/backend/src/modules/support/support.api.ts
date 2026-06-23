import { PrismaClient } from '@prisma/client';
import { Router, Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /api/v1/support
 * Create support ticket (public endpoint)
 */
router.post(
    '/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, category, message } = req.body;

            // Basic validation (important even for MVP)
            if (!name || !email || !category || !message) {
                res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                });
                return;
            }

            const ticket = await prisma.supportTicket.create({
                data: {
                    name,
                    email,
                    category,
                    message
                }
            });

            res.status(201).json({
                success: true,
                message: 'Support ticket submitted successfully',
                data: ticket
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;