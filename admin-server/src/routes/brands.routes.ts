import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';

const router = Router();

// All brand routes require authentication
router.use(authenticate);

// GET /api/admin/brands - List brands
// The Laravel DB has no brands table yet, so return an empty list so the UI still works.
router.get('/', requireMinRole('VIEWER'), (_req, res) => {
  res.json({ data: [] });
});

export default router;
