import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Public route to get approved reviews for a product (could be moved to main API, but here for completeness)
router.get('/public/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, status: 'APPROVED' },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where: { productId, status: 'APPROVED' } })
    ]);

    res.json({
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
});

// Create a review
router.post('/public', async (req, res, next) => {
  try {
    const { productId, rating, title, content, images, userId } = req.body;
    
    if (!productId || !rating || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating: Number(rating),
        title,
        content,
        images,
        userId,
        status: 'PENDING'
      }
    });

    res.status(201).json({ data: review });
  } catch (err) {
    next(err);
  }
});

// Admin routes
router.use(authenticate);

// List reviews (admin)
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, productId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (status) where.status = status;
    if (productId) where.productId = productId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where })
    ]);

    res.json({
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
});

// Update review status / reply
router.patch('/:id', requireMinRole('CONTENT_MANAGER'), async (req, res, next) => {
  try {
    const { status, isFeatured, reply } = req.body;
    const data: any = {};
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (reply !== undefined) {
      data.reply = reply;
      data.repliedAt = new Date();
    }

    const review = await prisma.review.update({
      where: { id: req.params.id as string },
      data
    });

    res.json({ data: review });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Review not found' });
    }
    next(err);
  }
});

// Delete review
router.delete('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    await prisma.review.delete({
      where: { id: req.params.id as string }
    });
    res.json({ data: { success: true } });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Review not found' });
    }
    next(err);
  }
});

export default router;
