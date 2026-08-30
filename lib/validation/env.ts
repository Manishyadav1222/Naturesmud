import { z } from 'zod';

/**
 * Frontend Environment Variables Schema
 * Validates all required and optional environment variables at build/runtime
 */
export const frontendEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL'),
  NEXT_PUBLIC_ADMIN_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/, 'Invalid WhatsApp number').optional(),
  NEXT_PUBLIC_WHATSAPP_MESSAGE: z.string().min(1).optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_TIKTOK_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  INTERNAL_API_URL: z.string().url().optional(),
  INTERNAL_ADMIN_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_YANDEX_VERIFICATION: z.string().optional(),
});

/**
 * Backend Environment Variables Schema
 */
export const backendEnvSchema = z.object({
  APP_NAME: z.string().min(1).default("NaturesMud"),
  APP_ENV: z.enum(['local', 'staging', 'production']).default('local'),
  APP_KEY: z.string().min(32).optional(),
  APP_DEBUG: z.enum(['true', 'false']).default('true'),
  APP_TIMEZONE: z.string().default('Asia/Kathmandu'),
  APP_URL: z.string().url(),
  DB_CONNECTION: z.enum(['mysql', 'pgsql', 'sqlite', 'sqlsrv']).default('mysql'),
  DB_HOST: z.string().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_DATABASE: z.string().min(1),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().optional(),
  SESSION_DRIVER: z.enum(['database', 'redis', 'file', 'cookie']).default('database'),
  SESSION_LIFETIME: z.coerce.number().int().positive().default(120),
  CACHE_STORE: z.enum(['redis', 'database', 'file', 'array']).default('redis'),
  CACHE_PREFIX: z.string().optional(),
  REDIS_CLIENT: z.enum(['predis', 'phpredis']).default('predis'),
  REDIS_HOST: z.string().min(1).default('127.0.0.1'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  QUEUE_CONNECTION: z.enum(['redis', 'database', 'sync', 'sqs']).default('redis'),
  MAIL_MAILER: z.enum(['smtp', 'sendgrid', 'mailgun', 'postmark', 'log', 'array']).default('smtp'),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().int().positive().optional(),
  MAIL_USERNAME: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_ENCRYPTION: z.enum(['tls', 'ssl', 'none']).optional(),
  MAIL_FROM_ADDRESS: z.string().email(),
  MAIL_FROM_NAME: z.string().min(1),
  SANCTUM_STATEFUL_DOMAINS: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  MEILISEARCH_HOST: z.string().url().optional(),
  MEILISEARCH_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_SECURE: z.enum(['true', 'false']).default('true'),
  ESEWA_MERCHANT_ID: z.string().optional(),
  ESEWA_SECRET_KEY: z.string().optional(),
  KHALTI_SECRET_KEY: z.string().optional(),
  FONEPAY_MERCHANT_CODE: z.string().optional(),
  STRIPE_KEY: z.string().optional(),
  STRIPE_SECRET: z.string().optional(),
  TWILIO_SID: z.string().optional(),
  TWILIO_TOKEN: z.string().optional(),
  TWILIO_FROM: z.string().optional(),
  WHATSAPP_NUMBER: z.string().optional(),
  RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
  GA_MEASUREMENT_ID: z.string().optional(),
  META_PIXEL_ID: z.string().optional(),
  TIKTOK_PIXEL_ID: z.string().optional(),
  HORIZON_PREFIX: z.string().default('horizon:'),
});

/**
 * Admin Server Environment Variables Schema
 */
export const adminServerEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url(),
  LARAVEL_DB_HOST: z.string().min(1),
  LARAVEL_DB_PORT: z.coerce.number().int().positive().default(3306),
  LARAVEL_DB_USER: z.string().min(1),
  LARAVEL_DB_PASSWORD: z.string().optional(),
  LARAVEL_DB_DATABASE: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

/**
 * Validates environment variables against schema
 * @throws ZodError if validation fails
 */
export function validateEnv<T extends z.ZodTypeAny>(
  schema: T,
  env: Record<string, string | undefined> = process.env
): z.infer<T> {
  const result = schema.safeParse(env);
  
  if (!result.success) {
    const issues = result.error.issues || (result.error as any).errors || [];
    const errors = issues.map((e: any) => 
      `${e.path.join('.')}: ${e.message}`
    ).join('\n');
    
    const message = `Environment validation failed:\n${errors}`;
    
    if (typeof window === 'undefined') {
      // Server-side: throw to fail fast
      throw new Error(message);
    } else {
      // Client-side: warn but don't break
      console.error('⚠️ ' + message);
    }
  }
  
  return result.data as z.infer<T>;
}

/**
 * Get validated frontend env (client-safe)
 */
export function getFrontendEnv() {
  // Only expose NEXT_PUBLIC_* variables to client
  const clientEnv: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_') || key === 'INTERNAL_API_URL' || key === 'INTERNAL_ADMIN_API_URL') {
      clientEnv[key] = value;
    }
  }
  return validateEnv(frontendEnvSchema, clientEnv);
}

/**
 * Get validated backend env (server-only)
 */
export function getBackendEnv() {
  return validateEnv(backendEnvSchema, process.env);
}

/**
 * Get validated admin server env (server-only)
 */
export function getAdminServerEnv() {
  return validateEnv(adminServerEnvSchema, process.env);
}

// Type exports for TypeScript
export type FrontendEnv = z.infer<typeof frontendEnvSchema>;
export type BackendEnv = z.infer<typeof backendEnvSchema>;
export type AdminServerEnv = z.infer<typeof adminServerEnvSchema>;