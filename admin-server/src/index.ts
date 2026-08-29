import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { prisma } from './config/database';

const app = express();
const port = Number(env.PORT) || 4000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
}));

const corsOrigins = (env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost')
  .split(',')
  .map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Always allow any localhost or 127.0.0.1 port (3000, 3001, 4000, 4001, 8000, etc.)
      if (
        origin.startsWith('http://localhost') ||
        origin.startsWith('https://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.startsWith('https://127.0.0.1')
      ) {
        return callback(null, true);
      }

      // Allow naturesmud domain variations (.com and .shop)
      if (origin.includes('naturesmud.com') || origin.includes('naturesmud.shop')) {
        return callback(null, true);
      }

      // Check against explicit allowed origins list
      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        return callback(null, true);
      }

      console.warn(`CORS origin allowed in fallback mode: ${origin}`);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['X-Total-Count', 'Authorization'],
    maxAge: 86400, // 24 hours
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', apiRateLimiter);

// Static uploads serving
const uploadsDirs = [
  path.resolve(process.cwd(), 'public', 'uploads'),
  path.resolve(__dirname, '../public/uploads'),
  path.resolve(__dirname, '../../public/uploads'),
];
uploadsDirs.forEach((dir) => {
  app.use('/uploads', express.static(dir));
});

// Root and Admin status handlers with browser auto-redirect to Admin Panel
app.get(['/', '/api/admin'], (req, res) => {
  const acceptsHtml = req.accepts('html') && !req.xhr && !req.headers['accept']?.includes('application/json');
  if (acceptsHtml) {
    return res.redirect(302, 'https://naturesmud.shop/admin');
  }
  res.status(200).json({
    success: true,
    service: "Nature's Mud Admin API",
    status: 'online',
    adminPanelUrl: 'https://naturesmud.shop/admin',
    message: "Nature's Mud Admin API backend is running. Access the Admin Dashboard at https://naturesmud.shop/admin",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/admin', routes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NatureMud Admin API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`🚀 Admin API running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;