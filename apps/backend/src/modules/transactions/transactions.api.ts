import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

// Get all transactions
router.get('/', async (_, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                subcategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                transactionDate: 'desc',
            },
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch transactions',
        });
    }
});

// Create transaction
router.post('/', async (req, res) => {
    try {
        const {
            categoryId,
            subcategoryId,
            transactionDate,
            account,
            currency,
            amount,
            description,
        } = req.body;

        if (
            !categoryId ||
            !transactionDate ||
            !account ||
            !currency ||
            amount === undefined
        ) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: Number(categoryId),
            },
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        if (category.parentId) {
            return res.status(400).json({
                message: 'Category must be a parent category',
            });
        }

        let subcategory = null;

        if (subcategoryId) {
            subcategory = await prisma.category.findUnique({
                where: {
                    id: Number(subcategoryId),
                },
            });

            if (!subcategory) {
                return res.status(404).json({
                    message: 'Subcategory not found',
                });
            }

            if (subcategory.parentId !== Number(categoryId)) {
                return res.status(400).json({
                    message:
                        'Selected subcategory does not belong to the selected category',
                });
            }
        }

        const transaction = await prisma.transaction.create({
            data: {
                categoryId: Number(categoryId),
                subcategoryId: subcategoryId
                    ? Number(subcategoryId)
                    : null,
                transactionDate: new Date(transactionDate),
                account,
                currency,
                amount,
                description,
            },
            include: {
                category: true,
                subcategory: true,
            },
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create transaction',
        });
    }
});

// Update transaction
router.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: 'Invalid transaction id',
            });
        }

        const existingTransaction = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!existingTransaction) {
            return res.status(404).json({
                message: 'Transaction not found',
            });
        }

        const {
            categoryId,
            subcategoryId,
            transactionDate,
            account,
            currency,
            amount,
            description,
        } = req.body;

        const category = await prisma.category.findUnique({
            where: {
                id: Number(categoryId),
            },
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        if (category.parentId) {
            return res.status(400).json({
                message: 'Category must be a parent category',
            });
        }

        let subcategory = null;

        if (subcategoryId) {
            subcategory = await prisma.category.findUnique({
                where: {
                    id: Number(subcategoryId),
                },
            });

            if (!subcategory) {
                return res.status(404).json({
                    message: 'Subcategory not found',
                });
            }

            if (subcategory.parentId !== Number(categoryId)) {
                return res.status(400).json({
                    message:
                        'Selected subcategory does not belong to the selected category',
                });
            }
        }

        const transaction = await prisma.transaction.update({
            where: {
                id,
            },
            data: {
                categoryId: Number(categoryId),
                subcategoryId: subcategoryId
                    ? Number(subcategoryId)
                    : null,
                transactionDate: new Date(transactionDate),
                account,
                currency,
                amount,
                description,
            },
            include: {
                category: true,
                subcategory: true,
            },
        });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update transaction',
        });
    }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: 'Invalid transaction id',
            });
        }

        const transaction =
            await prisma.transaction.findUnique({
                where: { id },
            });

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found',
            });
        }

        await prisma.transaction.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete transaction',
        });
    }
});

export default router;