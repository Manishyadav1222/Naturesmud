import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

export class RolesController {
  /**
   * List all roles with their permissions and user counts
   */
  async listRoles(_req: Request, res: Response) {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: {
            users: {
              where: { deletedAt: null },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const permissions = await prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });

    return res.json({
      success: true,
      data: {
        roles: roles.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          userCount: r._count.users,
          permissions: r.permissions.map((p: { key: string }) => p.key),
          permissionDetails: r.permissions,
        })),
        availablePermissions: permissions,
      },
    });
  }

  /**
   * Update permissions assigned to a role
   */
  async updateRolePermissions(req: Request, res: Response) {
    const id = req.params.id as string;
    const { permissionKeys, description } = req.body;

    const role = await prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    if (role.name === 'SUPER_ADMIN') {
      throw new ApiError(400, 'Super Admin permissions cannot be modified (always has full access)');
    }

    const updateData: any = {};
    if (description !== undefined) {
      updateData.description = typeof description === 'string' ? description : null;
    }

    if (Array.isArray(permissionKeys)) {
      const perms = await prisma.permission.findMany({
        where: { key: { in: permissionKeys } },
      });

      updateData.permissions = {
        set: perms.map((p) => ({ id: p.id })),
      };
    }

    const updated = await prisma.role.update({
      where: { id },
      data: updateData,
      include: {
        permissions: true,
        _count: {
          select: { users: { where: { deletedAt: null } } },
        },
      },
    });

    const currentUserId = (req as any).user?.id as string | undefined;
    if (currentUserId) {
      await prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'UPDATE_ROLE_PERMISSIONS',
          entityType: 'ROLE',
          entityId: id,
          meta: { roleName: role.name, permissionKeys },
        },
      });
    }

    return res.json({
      success: true,
      message: 'Role permissions updated successfully',
      data: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        userCount: updated._count.users,
        permissions: updated.permissions.map((p: { key: string }) => p.key),
      },
    });
  }
}
