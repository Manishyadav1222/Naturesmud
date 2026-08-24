import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import ordersRoutes from './orders.routes';
import customersRoutes from './customers.routes';
import recipesRoutes from './recipes.routes';
import productsRoutes from './products.routes';
import categoriesRoutes from './categories.routes';
import brandsRoutes from './brands.routes';
import uploadRoutes from './upload.routes';
import blogRoutes from './blog.routes';
import reviewsRoutes from './reviews.routes';
import inventoryRoutes from './inventory.routes';
import suppliersRoutes from './suppliers.routes';
import marketingRoutes from './marketing.routes';
import mediaRoutes from './media.routes';
import analyticsRoutes from './analytics.routes';
import messagesRoutes from './messages.routes';
import usersRoutes from './users.routes';
import rolesRoutes from './roles.routes';

const router = Router();

router.use('/auth', authRoutes);

// Laravel & Admin DB routes - all require authentication
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/messages', messagesRoutes);
router.use('/orders', ordersRoutes);
router.use('/customers', customersRoutes);
router.use('/recipes', recipesRoutes);
router.use('/products', productsRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/marketing', marketingRoutes);
router.use('/media', mediaRoutes);
router.use('/categories', categoriesRoutes);
router.use('/brands', brandsRoutes);
router.use('/upload', uploadRoutes);
router.use('/blog', blogRoutes);
router.use('/reviews', reviewsRoutes);

export default router;