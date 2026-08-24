import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

type RoleName = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'MARKETING' | 'WAREHOUSE' | 'SUPPORT' | 'CONTENT_MANAGER' | 'VIEWER';

const roleHierarchy: Record<RoleName, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  MANAGER: 80,
  MARKETING: 70,
  WAREHOUSE: 60,
  SUPPORT: 50,
  CONTENT_MANAGER: 40,
  VIEWER: 10,
};

export const requireRole = (...allowedRoles: RoleName[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const userRole = req.user.role as RoleName;

    if (!allowedRoles.includes(userRole) && userRole !== 'SUPER_ADMIN') {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }

    next();
  };
};

export const requirePermission = (permissionKey: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const hasPermission = req.user.permissions.includes(permissionKey);

    if (!hasPermission) {
      return next(new ApiError(403, `Missing required permission: ${permissionKey}`));
    }

    next();
  };
};

export const requireMinRole = (minRole: RoleName) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const userRole = req.user.role as RoleName;
    const minLevel = roleHierarchy[minRole];
    const userLevel = roleHierarchy[userRole] ?? 0;

    if (userLevel < minLevel) {
      return next(new ApiError(403, 'Insufficient role level for this action'));
    }

    next();
  };
};