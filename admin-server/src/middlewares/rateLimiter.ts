import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const windowMs = Number(env.RATE_LIMIT_WINDOW) * 60 * 1000; // minutes to ms
const max = Number(env.RATE_LIMIT_MAX) || 100;

// Helper to create rate limiter with consistent config
const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
  keyPrefix?: string;
}) => rateLimit({
  windowMs: options.windowMs,
  max: options.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${options.keyPrefix || 'api'}:${req.ip}`,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: options.message,
      retryAfter: Math.ceil(options.windowMs / 1000),
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

export const apiRateLimiter = createRateLimiter({
  windowMs,
  max,
  message: 'Too many requests, please try again later.',
  keyPrefix: 'api',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts, please try again in 15 minutes.',
  keyPrefix: 'auth',
});

// Stricter rate limiter for sensitive operations
export const sensitiveRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many sensitive operations, please try again later.',
  keyPrefix: 'sensitive',
});