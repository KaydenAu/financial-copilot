import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../utils/auth.utils';

const prisma = new PrismaClient();
const router = Router();
router.use(authenticateToken);

// POST /api/v1/support/ticket
router.post('/ticket', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ 
                success: false, 
                message: 'Unauthorized. Missing authentication context.' 
            });
            return;
        }

        const { subject, message } = req.body;
        if (!subject || !message) {
            res.status(400).json({ 
                success: false,
                message: 'Subject and message body segments are strictly required.' 
            });
            return ; 
        }

        const newTicket = await prisma.supportTicket.create({
            data: {
                subject,
                message,
                userId: userId
            }
        });

        res.status(201).json({ 
            success: true, 
            message: 'Support request transmitted securely.', 
            ticketId: newTicket.id 
        });
    } catch (error) {
    next(error);
  }
});

export default router;