import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { sendOTP, sendStaffWelcomeEmail } from '../services/email.service';
import { revokeAllUserRefreshTokens } from '../utils/jwt';

export class UsersController {
  /**
   * List all admin/staff users with filtering & pagination
   */
  async listUsers(req: Request, res: Response) {
    const page = typeof req.query.page === 'string' ? req.query.page : '1';
    const limit = typeof req.query.limit === 'string' ? req.query.limit : '20';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const role = typeof req.query.role === 'string' ? req.query.role : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (role && role !== 'ALL') {
      where.role = {
        name: role,
      };
    }

    if (status) {
      if (status === 'ACTIVE') where.isActive = true;
      if (status === 'INACTIVE') where.isActive = false;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          avatar: u.avatar,
          isActive: u.isActive,
          isTwoFactorEnabled: u.isTwoFactorEnabled,
          emailVerifiedAt: u.emailVerifiedAt,
          lastLoginAt: u.lastLoginAt,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          roleName: u.role?.name ?? 'VIEWER',
          permissions: u.role?.permissions.map((p: { key: string }) => p.key) ?? [],
          isVerified: !!u.emailVerifiedAt,
          status: !u.isActive ? 'INACTIVE' : 'ACTIVE',
        })),
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  }

  /**
   * Get single user by ID
   */
  async getUser(req: Request, res: Response) {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new ApiError(404, 'User not found');
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.isActive,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roleName: user.role?.name ?? 'VIEWER',
        permissions: user.role?.permissions.map((p: { key: string }) => p.key) ?? [],
        isVerified: !!user.emailVerifiedAt,
        status: !user.isActive ? 'INACTIVE' : 'ACTIVE',
      },
    });
  }

  /**
   * Create a new admin/staff user
   */
  async createUser(req: Request, res: Response) {
    const { name, email, phone, roleId, roleName, password, isActive = true, sendWelcomeEmail = true, isVerified = false } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && !existingUser.deletedAt) {
      throw new ApiError(400, 'A user already exists with this email address');
    }

    // Resolve Role
    let role = null;
    if (roleId) {
      role = await prisma.role.findUnique({ where: { id: roleId } });
    } else if (roleName) {
      role = await prisma.role.findUnique({ where: { name: roleName } });
    } else {
      role = await prisma.role.findUnique({ where: { name: 'VIEWER' } });
    }

    if (!role) {
      throw new ApiError(400, 'Invalid role specified');
    }

    const rawPassword = password || crypto.randomBytes(6).toString('hex') + 'A1!';
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        roleId: role.id,
        isActive: Boolean(isActive),
        emailVerifiedAt: isVerified ? new Date() : null,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    // Send Welcome Email if requested
    if (sendWelcomeEmail) {
      await sendStaffWelcomeEmail(user.email, user.name, role.name, rawPassword);
    }

    // Activity log
    const currentUserId = (req as any).user?.id as string | undefined;
    if (currentUserId) {
      await prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'CREATE_USER',
          entityType: 'USER',
          entityId: user.id,
          meta: { name: user.name, email: user.email, role: role.name },
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.isActive,
        roleName: user.role?.name ?? 'VIEWER',
        permissions: user.role?.permissions.map((p: { key: string }) => p.key) ?? [],
        tempPassword: password ? undefined : rawPassword,
      },
    });
  }

  /**
   * Update existing user
   */
  async updateUser(req: Request, res: Response) {
    const id = req.params.id as string;
    const { name, email, phone, roleId, roleName, isActive, isVerified, password } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new ApiError(404, 'User not found');
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (emailExists && emailExists.id !== id) {
        throw new ApiError(400, 'Email is already taken by another account');
      }
      updateData.email = email.toLowerCase();
    }

    if (isVerified !== undefined) {
      updateData.emailVerifiedAt = isVerified ? (user.emailVerifiedAt || new Date()) : null;
    }

    if (password && typeof password === 'string' && password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(password, 12);
      await revokeAllUserRefreshTokens(id);
    }

    if (roleId) {
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role) throw new ApiError(400, 'Role not found');
      updateData.roleId = role.id;
    } else if (roleName) {
      const role = await prisma.role.findUnique({ where: { name: roleName } });
      if (!role) throw new ApiError(400, 'Role not found');
      updateData.roleId = role.id;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const currentUserId = (req as any).user?.id as string | undefined;
    if (currentUserId) {
      await prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'UPDATE_USER',
          entityType: 'USER',
          entityId: id,
          meta: updateData,
        },
      });
    }

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        isActive: updatedUser.isActive,
        roleName: updatedUser.role?.name ?? 'VIEWER',
        permissions: updatedUser.role?.permissions.map((p: { key: string }) => p.key) ?? [],
        isVerified: !!updatedUser.emailVerifiedAt,
      },
    });
  }

  /**
   * Delete / Deactivate User
   */
  async deleteUser(req: Request, res: Response) {
    const id = req.params.id as string;
    const currentUserId = (req as any).user?.id as string | undefined;

    if (id === currentUserId) {
      throw new ApiError(400, 'You cannot delete your own account');
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user || user.deletedAt) {
      throw new ApiError(404, 'User not found');
    }

    if (user.role?.name === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: {
          role: { name: 'SUPER_ADMIN' },
          deletedAt: null,
          isActive: true,
        },
      });
      if (superAdminCount <= 1) {
        throw new ApiError(400, 'Cannot delete the only active Super Admin account');
      }
    }

    // Soft delete & revoke tokens
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    await revokeAllUserRefreshTokens(id);

    if (currentUserId) {
      await prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'DELETE_USER',
          entityType: 'USER',
          entityId: id,
          meta: { email: user.email, name: user.name },
        },
      });
    }

    return res.json({
      success: true,
      message: 'User deleted successfully',
    });
  }

  /**
   * Toggle Active / Inactive Status
   */
  async toggleStatus(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || user.deletedAt) {
      throw new ApiError(404, 'User not found');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    if (!updated.isActive) {
      await revokeAllUserRefreshTokens(id);
    }

    return res.json({
      success: true,
      message: `User is now ${updated.isActive ? 'Active' : 'Inactive'}`,
      data: { isActive: updated.isActive },
    });
  }

  /**
   * Send Gmail verification OTP to user
   */
  async resendVerification(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || user.deletedAt) {
      throw new ApiError(404, 'User not found');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id },
      data: { otpCode, otpExpiresAt },
    });

    await sendOTP(user.email, otpCode);

    return res.json({
      success: true,
      message: `Verification code sent to ${user.email}`,
    });
  }
}
