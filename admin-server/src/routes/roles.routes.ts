import { Router } from 'express';
import { RolesController } from '../controllers/roles.controller';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac';

const router = Router();
const controller = new RolesController();

router.use(authenticate);
router.use(requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/', (req, res, next) => controller.listRoles(req, res).catch(next));
router.put('/:id/permissions', (req, res, next) => controller.updateRolePermissions(req, res).catch(next));

export default router;
