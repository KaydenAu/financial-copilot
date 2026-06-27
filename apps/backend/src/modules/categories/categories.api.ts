import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../utils/auth.utils';

const prisma = new PrismaClient();
const router = Router();

function buildTree(categories: any[]) {
    const map = new Map();
    categories.forEach(category => {
        map.set(category.id, {
            ...category,
            children: [],
        });
    });

    const tree: any[] = [];
    categories.forEach(category => {
        const node = map.get(category.id);
        if (category.parentId) {
            map.get(category.parentId)?.children.push(node);
        } else {
            tree.push(node);
        }
    });
    return tree;
}

router.use(authenticateToken);

// Get all categories
router.get('/', async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const categories = await prisma.category.findMany({
            where: {
                userId,
            },
            orderBy: {
                name: 'asc',
            },
        });
        res.json(buildTree(categories));
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch categories',
        });
    }
});

// Get parent categories only
router.get('/parents', async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const parents = await prisma.category.findMany({
            where: {
                userId,
                parentId: null,
            },
            orderBy: {
                name: 'asc',
            },
        });
        res.json(parents);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch parent categories',
        });
    }
});

// Add category
router.post('/', async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const { name, description, parentId } = req.body;
        const trimmedName = name?.trim();
        if (!trimmedName) {
            return res.status(400).json({
                message: 'Category name is required',
            });
        }

        if (parentId) {
            const parentCategory = await prisma.category.findFirst({
                where: {
                    id: Number(parentId),
                    userId,
                },
            });
            if (!parentCategory) {
                return res.status(404).json({
                    message: 'Parent category not found',
                });
            }
        }

        const existingCategory = await prisma.category.findFirst({
            where: {
                userId,
                name: trimmedName,
                parentId: parentId ?? null,
            },
        });
        if (existingCategory) {
            return res.status(409).json({
                message:
                    'Category name already exists under the selected parent',
            });
        }

        const category = await prisma.category.create({
            data: {
                name: trimmedName,
                description,
                parentId,
                userId,
            },
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create category',
        });
    }
});

// Update category
router.patch('/:id', async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: 'Invalid category id',
            });
        }

        const { name, description, parentId } = req.body;
        const trimmedName = name?.trim();
        if (!trimmedName) {
            return res.status(400).json({
                message: 'Category name is required',
            });
        }

        const existingCategory = await prisma.category.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existingCategory) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        if (parentId === id) {
            return res.status(400).json({
                message: 'Category cannot be its own parent',
            });
        }

        if (parentId) {
            const parentCategory = await prisma.category.findFirst({
                where: {
                    id: Number(parentId),
                    userId,
                },
            });
            if (!parentCategory) {
                return res.status(404).json({
                    message: 'Parent category not found',
                });
            }
        }

        const duplicateCategory = await prisma.category.findFirst({
            where: {
                userId,
                id: {
                    not: id,
                },
                name: trimmedName,
                parentId: parentId ?? null,
            },
        });

        if (duplicateCategory) {
            return res.status(409).json({
                message:
                    'Category name already exists under the selected parent',
            });
        }

        const category = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name: trimmedName,
                description,
                parentId,
            },
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update category',
        });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: 'Invalid category id',
            });
        }

        const category = await prisma.category.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        await prisma.category.delete({
            where: {
                id,
            },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete category',
        });
    }
});

export default router;