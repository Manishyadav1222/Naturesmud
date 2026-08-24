import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../src/middlewares/auth';
import { ApiError } from '../../src/utils/ApiError';
import { verifyAccessToken } from '../../src/utils/jwt';

// Mock dependencies
jest.mock('../../src/utils/jwt');
jest.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

import { prisma } from '../../src/config/database';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  describe('authenticate', () => {
    it('should call next with 401 when no authorization header', async () => {
      mockRequest.headers = {};

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should call next with 401 when authorization header is not Bearer', async () => {
      mockRequest.headers = { authorization: 'Basic abc123' };

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should call next with 401 when token verification fails', async () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new ApiError(401, 'Invalid or expired access token');
      });

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(verifyAccessToken).toHaveBeenCalledWith('invalid-token');
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    });

    it('should call next with 401 when user not found in database', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (verifyAccessToken as jest.Mock).mockReturnValue({ sub: 'user-123', role: 'ADMIN', type: 'access' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        include: expect.any(Object),
      });
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('User not found or deactivated');
    });

    it('should call next with 401 when user is inactive', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (verifyAccessToken as jest.Mock).mockReturnValue({ sub: 'user-123', role: 'ADMIN', type: 'access' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        isActive: false,
        deletedAt: null,
        role: { name: 'ADMIN', permissions: [] },
      });

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should call next with 401 when user is deleted', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (verifyAccessToken as jest.Mock).mockReturnValue({ sub: 'user-123', role: 'ADMIN', type: 'access' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        isActive: true,
        deletedAt: new Date(),
        role: { name: 'ADMIN', permissions: [] },
      });

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should attach user to request and call next on success', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (verifyAccessToken as jest.Mock).mockReturnValue({ sub: 'user-123', role: 'ADMIN', type: 'access' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
        name: 'Test Admin',
        isActive: true,
        deletedAt: null,
        role: {
          name: 'ADMIN',
          permissions: [
            { key: 'orders.view' },
            { key: 'orders.create' },
          ],
        },
      });

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect((mockRequest as any).user).toEqual({
        id: 'user-123',
        role: 'ADMIN',
        email: 'admin@test.com',
        name: 'Test Admin',
        permissions: ['orders.view', 'orders.create'],
      });
    });

    it('should handle user without role gracefully', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (verifyAccessToken as jest.Mock).mockReturnValue({ sub: 'user-123', role: 'VIEWER', type: 'access' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'viewer@test.com',
        name: 'Test Viewer',
        isActive: true,
        deletedAt: null,
        role: null,
      });

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect((mockRequest as any).user).toEqual({
        id: 'user-123',
        role: 'VIEWER',
        email: 'viewer@test.com',
        name: 'Test Viewer',
        permissions: [],
      });
    });
  });
});