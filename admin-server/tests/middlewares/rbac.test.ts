import { Request, Response, NextFunction } from 'express';
import { requireRole, requirePermission, requireMinRole } from '../../src/middlewares/rbac';
import { ApiError } from '../../src/utils/ApiError';

describe('RBAC Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      user: {
        id: 'user-123',
        role: 'ADMIN',
        email: 'admin@test.com',
        name: 'Test Admin',
        permissions: ['orders.view', 'orders.create', 'products.view'],
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  describe('requireRole', () => {
    it('should allow access when user has required role', () => {
      const middleware = requireRole('ADMIN');
      (mockRequest as any).user = { ...mockRequest.user, role: 'ADMIN' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access when user is SUPER_ADMIN regardless of required role', () => {
      const middleware = requireRole('WAREHOUSE');
      (mockRequest as any).user = { ...mockRequest.user, role: 'SUPER_ADMIN' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access when user lacks required role', () => {
      const middleware = requireRole('SUPER_ADMIN');
      (mockRequest as any).user = { ...mockRequest.user, role: 'ADMIN' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('You do not have permission to access this resource');
    });

    it('should deny access when no user attached', () => {
      const middleware = requireRole('ADMIN');
      (mockRequest as any).user = undefined;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should allow access when user has any of the allowed roles', () => {
      const middleware = requireRole('ADMIN', 'MANAGER');
      (mockRequest as any).user = { ...mockRequest.user, role: 'MANAGER' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('requirePermission', () => {
    it('should allow access when user has required permission', () => {
      const middleware = requirePermission('orders.view');

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access when user lacks required permission', () => {
      const middleware = requirePermission('orders.delete');

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Missing required permission: orders.delete');
    });

    it('should deny access when no user attached', () => {
      const middleware = requirePermission('orders.view');
      (mockRequest as any).user = undefined;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should deny access when user has no permissions', () => {
      const middleware = requirePermission('orders.view');
      (mockRequest as any).user = { ...mockRequest.user, permissions: [] };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe('requireMinRole', () => {
    it('should allow access when user role level meets minimum', () => {
      const middleware = requireMinRole('MANAGER'); // Level 80
      (mockRequest as any).user = { ...mockRequest.user, role: 'ADMIN' }; // Level 90

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access when user role equals minimum', () => {
      const middleware = requireMinRole('ADMIN'); // Level 90
      (mockRequest as any).user = { ...mockRequest.user, role: 'ADMIN' }; // Level 90

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access when user role level below minimum', () => {
      const middleware = requireMinRole('ADMIN'); // Level 90
      (mockRequest as any).user = { ...mockRequest.user, role: 'MANAGER' }; // Level 80

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Insufficient role level for this action');
    });

    it('should allow SUPER_ADMIN access to any level', () => {
      const middleware = requireMinRole('SUPER_ADMIN'); // Level 100
      (mockRequest as any).user = { ...mockRequest.user, role: 'SUPER_ADMIN' }; // Level 100

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access when no user attached', () => {
      const middleware = requireMinRole('ADMIN');
      (mockRequest as any).user = undefined;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should deny access for unknown role (level 0)', () => {
      const middleware = requireMinRole('VIEWER'); // Level 10
      (mockRequest as any).user = { ...mockRequest.user, role: 'UNKNOWN_ROLE' }; // Level 0

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
    });
  });
});