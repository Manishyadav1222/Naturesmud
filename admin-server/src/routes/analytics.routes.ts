import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

router.use(authenticate);

// GET /api/admin/analytics
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const period = (req.query.period as string) || '12M';
    const data = await laravelDb.getAnalyticsStats(period);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
