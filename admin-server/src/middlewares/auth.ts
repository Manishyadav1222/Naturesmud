import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        name: string;
        permissions: string[];
      };
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new ApiError(401, 'User not found or deactivated');
    }

    req.user = {
      id: user.id,
      role: user.role?.name ?? 'VIEWER',
      email: user.email,
      name: user.name,
      permissions: user.role?.permissions.map((p) => p.key) ?? [],
    };

    next();
  } catch (error) {
    next(error);
  }
};