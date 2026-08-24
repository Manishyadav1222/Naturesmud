import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac';

const router = Router();
const controller = new UsersController();

// All user management routes require authentication and ADMIN/SUPER_ADMIN role
router.use(authenticate);
router.use(requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/', (req, res, next) => controller.listUsers(req, res).catch(next));
router.post('/', (req, res, next) => controller.createUser(req, res).catch(next));
router.get('/:id', (req, res, next) => controller.getUser(req, res).catch(next));
router.put('/:id', (req, res, next) => controller.updateUser(req, res).catch(next));
router.delete('/:id', (req, res, next) => controller.deleteUser(req, res).catch(next));
router.post('/:id/toggle-status', (req, res, next) => controller.toggleStatus(req, res).catch(next));
router.post('/:id/resend-verification', (req, res, next) => controller.resendVerification(req, res).catch(next));

export default router;
