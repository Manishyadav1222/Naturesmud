import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { signAccessToken, signRefreshToken, verifyRefreshToken, revokeRefreshToken, revokeAllUserRefreshTokens } from '../utils/jwt';
import { sendOTP, sendPasswordResetEmail } from './email.service';

interface LoginInput {
  email: string;
  password: string;
  otpCode?: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roleId?: string;
}

interface SocialLoginInput {
  provider: 'google' | 'meta';
  email: string;
  name: string;
  avatar?: string;
}

export class AuthService {
  async login(input: LoginInput) {
    const { email, password, otpCode } = input;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      if (!otpCode) {
        return {
          requiresTwoFactor: true,
          message: 'Two-factor authentication code required',
        };
      }

      if (!user.twoFactorSecret) {
        throw new ApiError(401, '2FA is not properly configured');
      }

      const isValidOtp = authenticator.verify({
        token: otpCode,
        secret: user.twoFactorSecret,
      });

      if (!isValidOtp) {
        throw new ApiError(401, 'Invalid 2FA code');
      }
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = signAccessToken(user.id, user.role?.name ?? 'VIEWER');
    const { token: refreshToken, expiresAt } = await signRefreshToken(user.id);

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityType: 'AUTH',
        meta: { message: 'User logged in successfully' },
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role?.name ?? 'VIEWER',
        permissions: user.role?.permissions.map((p) => p.key) ?? [],
        isEmailVerified: !!user.emailVerifiedAt,
      },
    };
  }

  async register(input: RegisterInput) {
    const { name, email, password, phone, roleId } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && !existingUser.deletedAt) {
      throw new ApiError(400, 'User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const role = roleId
      ? await prisma.role.findUnique({ where: { id: roleId } })
      : await prisma.role.findUnique({ where: { name: 'VIEWER' } });

    if (!role) {
      throw new ApiError(400, 'Invalid role');
    }

    // Auto-generate 6-digit OTP for email verification
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        roleId: role.id,
        otpCode,
        otpExpiresAt,
      },
    });

    // Send verification OTP via Gmail
    await sendOTP(user.email, otpCode);

    const accessToken = signAccessToken(user.id, role.name);
    const { token: refreshToken, expiresAt } = await signRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role.name,
        permissions: [],
        isEmailVerified: false,
      },
    };
  }

  async sendVerificationOtp(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) {
      throw new ApiError(404, 'No account found with this email');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpiresAt },
    });

    await sendOTP(user.email, otpCode);

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}`,
    };
  }

  async verifyEmailOtp(email: string, otpCode: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) {
      throw new ApiError(404, 'User not found');
    }

    if (!user.otpCode || user.otpCode !== otpCode) {
      throw new ApiError(400, 'Invalid verification code');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new ApiError(400, 'Verification code has expired. Please request a new one.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully!',
    };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt || !user.isActive) {
      // Return true to avoid user enumeration
      return { success: true, message: 'If an account exists, a reset code was sent.' };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpiresAt },
    });

    await sendPasswordResetEmail(user.email, otpCode);

    return {
      success: true,
      message: `Password reset code sent to ${user.email}`,
    };
  }

  async resetPassword(email: string, otpCode: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) {
      throw new ApiError(404, 'User not found');
    }

    if (!user.otpCode || user.otpCode !== otpCode) {
      throw new ApiError(400, 'Invalid reset code');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new ApiError(400, 'Reset code has expired. Please request a new one.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    await revokeAllUserRefreshTokens(user.id);

    return {
      success: true,
      message: 'Password reset successfully. You can now log in.',
    };
  }

  /**
   * Google & Meta Social Authentication
   */
  async socialLogin(input: SocialLoginInput) {
    const { provider, email, name, avatar } = input;

    if (!email) {
      throw new ApiError(400, 'Email is required from social provider');
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        role: {
          include: { permissions: true },
        },
      },
    });

    if (user) {
      if (!user.isActive || user.deletedAt) {
        throw new ApiError(403, 'Your account has been deactivated');
      }

      // Auto-verify email if logged in via Google/Meta
      if (!user.emailVerifiedAt) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerifiedAt: new Date(),
            avatar: user.avatar || avatar,
            lastLoginAt: new Date(),
          },
          include: {
            role: {
              include: { permissions: true },
            },
          },
        });
      }
    } else {
      // Create new user authenticated via social provider
      const defaultRole = (await prisma.role.findUnique({ where: { name: 'CUSTOMER' } })) ||
        (await prisma.role.findUnique({ where: { name: 'VIEWER' } }));

      const randomPass = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12);

      user = await prisma.user.create({
        data: {
          name: name || `${provider === 'google' ? 'Google' : 'Meta'} User`,
          email: email.toLowerCase(),
          password: randomPass,
          avatar: avatar || null,
          roleId: defaultRole?.id,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(),
        },
        include: {
          role: {
            include: { permissions: true },
          },
        },
      });
    }

    const accessToken = signAccessToken(user.id, user.role?.name ?? 'VIEWER');
    const { token: refreshToken, expiresAt } = await signRefreshToken(user.id);

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: `${provider.toUpperCase()}_LOGIN`,
        entityType: 'AUTH',
        meta: { provider, email: user.email },
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role?.name ?? 'VIEWER',
        permissions: user.role?.permissions.map((p) => p.key) ?? [],
        isEmailVerified: true,
        provider,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = await verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new ApiError(401, 'User not found or deactivated');
    }

    const accessToken = signAccessToken(user.id, user.role?.name ?? 'VIEWER');
    return { accessToken };
  }

  async logout(refreshToken: string) {
    const payload = await verifyRefreshToken(refreshToken);
    await revokeRefreshToken(payload.jti);
    return { success: true };
  }

  async logoutAll(userId: string) {
    await revokeAllUserRefreshTokens(userId);
    return { success: true };
  }

  async setupTwoFactor(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'NatureMud Admin', secret);

    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return {
      secret,
      qrCodeUrl,
      message: 'Scan the QR code with your authenticator app',
    };
  }

  async verifyTwoFactor(userId: string, otpCode: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) {
      throw new ApiError(404, '2FA not set up');
    }

    const isValid = authenticator.verify({
      token: otpCode,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new ApiError(401, 'Invalid 2FA code');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });

    return {
      success: true,
      message: 'Two-factor authentication enabled',
    };
  }

  async disableTwoFactor(userId: string, otpCode: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) {
      throw new ApiError(404, '2FA not set up');
    }

    const isValid = authenticator.verify({
      token: otpCode,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new ApiError(401, 'Invalid 2FA code');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    return {
      success: true,
      message: 'Two-factor authentication disabled',
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await revokeAllUserRefreshTokens(userId);

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}