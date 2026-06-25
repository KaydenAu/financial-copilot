import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../utils/auth.utils';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticateToken);

// POST /api/v1/support/ticket
router.post(
    '/ticket',
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized.'
                });
                return;
            }

            const { subject, message } = req.body;

            if (!subject?.trim() || !message?.trim()) {
                res.status(400).json({
                    success: false,
                    message: 'Subject and message are required.'
                });
                return;
            }

            const ticket = await prisma.supportTicket.create({
                data: {
                    subject: subject.trim(),
                    message: message.trim(),
                    userId
                }
            });

            res.status(201).json({
                success: true,
                message: 'Support ticket created successfully.',
                data: {
                    id: ticket.id,
                    status: ticket.status,
                    createdAt: ticket.createdAt
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;