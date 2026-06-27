import { PrismaClient} from '@prisma/client';
import { Router, Request, Response } from 'express';
import { authenticateToken } from '../../utils/auth.utils';
import { ChatCompletionMessageParam, groqService } from './ai-panel.service';
import { getFinancialContextSummary } from './ai-transaction-context.api';

const prisma = new PrismaClient();
const router = Router();
router.use(authenticateToken);

// POST /api/v1/ai/prompt
// Handles incoming prompt submission, persisting states to the relational tracks.
router.post('/prompt', async (req: Request, res: Response): Promise<void>=> {
    try {
        const { sessionId, prompt } = req.body;
        const currentUserId = req.user!.id;

        if (!currentUserId || typeof sessionId !== 'string' || typeof prompt !== 'string') {
            res.status(400).json({ 
                success: false,
                error: 'Malformed payload: sessionId and prompt must be strings.' 
            });
            return;
        }

        // Compile real-time user database aggregates
        const liveFinancialSummary = await getFinancialContextSummary(currentUserId);

        // Verify or create the active session track baseline
        let session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        });

        if (session && session.userId !== currentUserId) {
            // Security Guardrail: Block access if the thread belongs to someone else
            res.status(403).json({ 
                success: false, 
                error: 'Unauthorized workspace access' 
            });
            return;
        }

        // Persist the incoming User Prompt message block
        if (!session) {
            session = await prisma.chatSession.create({
                data: { 
                    id: sessionId,
                    userId: currentUserId 
                },
            });
        }

        // Fetch recent conversation history to provide short-term memory context to the LLM
        const existingMessages = await prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            take: 8,
        });

        // Transform database structures directly to Groq type parameters
        const mappedHistory: ChatCompletionMessageParam[] = existingMessages.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        }));

        // Append the incoming user prompt to the contextual payload sequence
        mappedHistory.push({ role: 'user', content: prompt.trim() });

        await prisma.chatMessage.create({
            data: { sessionId, role: 'user', content: prompt.trim() },
        });

        // Execute live cloud inference call out to Groq's infrastructure API
        let aiGeneratedResponse = await groqService.generateChatResponse(
            mappedHistory, 
            liveFinancialSummary, // Data Grounding payload
            'MYR'
        );

        // Check if the AI has signaled a human-confirmed transaction commitment write
        const commitTag = '[COMMIT_TRANSACTION]';
        if (aiGeneratedResponse.includes(commitTag)) {
            try {
                const parts = aiGeneratedResponse.split(commitTag);

                // Extract array elements safely to intermediate variables
                const rawUiText = parts[0];
                const rawJsonPayload = parts[1];

                // TYPE GUARD: Explicitly satisfies 'noUncheckedIndexedAccess' compiler constraints
                if (rawUiText === undefined || rawJsonPayload === undefined) {
                    throw new Error('Malformed matching sequence boundaries.');
                }

                const cleanUiText = rawUiText.trim();
                let jsonPayloadString = rawJsonPayload.trim();
                
                if (jsonPayloadString.startsWith('```')) {
                        jsonPayloadString = jsonPayloadString
                            .replace(/\n?```$/, '')          
                            .trim();
                    }

                // Parse extracted structured variables from the LLM
                const txPayload = JSON.parse(jsonPayloadString);

                const targetCategory = await prisma.category.findFirst({
                        where: {
                            name: {
                                equals: txPayload.categoryOrSubcategory,
                                mode: process.env.DATABASE_URL?.startsWith('postgres') ? 'insensitive' : undefined
                            }
                        },
                    });

                let categoryId: number | null = null; 
                let subcategoryId: number | null = null;

                if (targetCategory) {
                    if (targetCategory.parentId) {
                        categoryId = targetCategory.parentId;
                        subcategoryId = targetCategory.id;
                    } else {
                        categoryId = targetCategory.id;
                    }
                } else {
                    const fallbackCategory = await prisma.category.findFirst();
                    if (!fallbackCategory) {
                        throw new Error('No categories found in the database. Run your seeds first.');
                    }
                    categoryId = fallbackCategory.id;
                }

                // 6. Execute the secure database insertion write block
                await prisma.transaction.create({
                    data: {
                        userId: currentUserId,
                        categoryId: categoryId,
                        subcategoryId: subcategoryId,
                        transactionDate: txPayload.date ? new Date(txPayload.date) : new Date(),
                        account: 'CIMB',
                        currency: 'MYR',
                        amount: txPayload.amount,
                        description: txPayload.description || 'Logged via Financial Copilot Workspace',
                    },
                    include: {
                        category: true,
                        subcategory: true,
                    },
                });

                console.log('✅ Transaction successfully saved to Prisma database!');

                // Strip the hidden technical tag so it looks clean in the database and frontend UI
                aiGeneratedResponse = cleanUiText;

            } catch (commitError) {
                console.error('Failed to parse or save verified database row:', commitError);
            }
        }

        // Save clean assistant markdown string row into tracking history records
        const savedAiMessage = await prisma.chatMessage.create({
            data: { sessionId, role: 'assistant', content: aiGeneratedResponse },
        });

        // Return response to UI stream
        res.status(200).json({
            sessionId,
            response: savedAiMessage.content,
            timestamp: savedAiMessage.createdAt,
        });
    } catch (error) {
        console.error('Failure in AI context user routing:', error);
        res.status(500).json({ error: 'Internal Server Fault' });
    }
});


// DELETE /api/v1/ai/session/:id
// Clear chat sessions cleanly with automatic cascading message wipe.
router.delete('/session/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const currentUserId = req.user!.id; 

        if (typeof id !== 'string') {
            res.status(400).json({ 
                success: false, 
                error: 'Invalid or missing session ID parameter.' 
            });
            return;
        }

        const session = await prisma.chatSession.findUnique({
            where: { id },
        });

        if (!session) {
            res.status(404).json({ 
                success: false,
                error: 'Chat session not found' 
            });
            return;
        }

        // MULTI-TENANT SECURITY GUARDRAIL: Block the deletion if it belongs to someone else
        if (session.userId !== currentUserId) {
            res.status(403).json({ 
                success: false, 
                error: 'Unauthorized workspace access: Cannot delete this resource' 
            });
            return;
        }

        await prisma.chatSession.delete({
            where: { id },
        });

        res.status(200).json({ 
            success: true, 
            message: 'Session and message history purged successfully.' 
        });
    } catch (error) {
        console.error('Purge transaction error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to purge requested session context' 
        });
    }
});

export default router;