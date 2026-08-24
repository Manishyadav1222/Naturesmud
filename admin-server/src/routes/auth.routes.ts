import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { authRateLimiter, sensitiveRateLimiter } from '../middlewares/rateLimiter';

const router = Router();
const controller = new AuthController();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    otpCode: z.string().optional(),
  }),
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    roleId: z.string().uuid().optional(),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});

const passwordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

const otpSchema = z.object({
  body: z.object({
    otpCode: z.string().length(6, 'OTP code must be 6 digits'),
  }),
});

const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    otpCode: z.string().length(6, 'OTP code must be 6 digits'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otpCode: z.string().length(6, 'OTP code must be 6 digits'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

const socialLoginSchema = z.object({
  body: z.object({
    provider: z.enum(['google', 'meta']),
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    avatar: z.string().optional(),
  }),
});

router.post('/login', authRateLimiter, validate(loginSchema), controller.login);
router.post('/register', authRateLimiter, validate(registerSchema), controller.register);
router.post('/social-login', authRateLimiter, validate(socialLoginSchema), controller.socialLogin);
router.post('/refresh', validate(refreshSchema), controller.refreshToken);
router.post('/refresh-token', validate(refreshSchema), controller.refreshToken);
router.post('/logout', validate(logoutSchema), controller.logout);

// Email & Password recovery via Gmail OTP
router.post('/send-verification-otp', sensitiveRateLimiter, controller.sendVerificationOtp);
router.post('/verify-email-otp', sensitiveRateLimiter, validate(verifyEmailSchema), controller.verifyEmailOtp);
router.post('/forgot-password', sensitiveRateLimiter, validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', sensitiveRateLimiter, validate(resetPasswordSchema), controller.resetPassword);

router.use(authenticate);
router.post('/logout-all', controller.logoutAll);
router.get('/me', controller.me);
router.post('/2fa/setup', sensitiveRateLimiter, controller.setupTwoFactor);
router.post('/2fa/verify', sensitiveRateLimiter, validate(otpSchema), controller.verifyTwoFactor);
router.post('/2fa/disable', sensitiveRateLimiter, validate(otpSchema), controller.disableTwoFactor);
router.post('/change-password', sensitiveRateLimiter, validate(passwordSchema), controller.changePassword);

export default router;