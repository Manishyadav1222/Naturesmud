// Mock prisma before importing jwt module
const mockPrisma = {
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};

jest.mock('../../src/config/database', () => ({
  prisma: mockPrisma,
}));

// Mock environment
jest.mock('../../src/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-that-is-at-least-32-characters-long',
    JWT_REFRESH_SECRET: 'test-refresh-secret-key-that-is-at-least-32-characters-long',
    JWT_ACCESS_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
  },
}));

import jwt from 'jsonwebtoken';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} from '../../src/utils/jwt';
import { ApiError } from '../../src/utils/ApiError';

describe('JWT Utilities', () => {
  const userId = 'test-user-id-123';
  const role = 'ADMIN';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = signAccessToken(userId, role);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should create token with correct payload', () => {
      const token = signAccessToken(userId, role);
      const decoded = jwt.decode(token) as any;

      expect(decoded.sub).toBe(userId);
      expect(decoded.role).toBe(role);
      expect(decoded.type).toBe('access');
    });

    it('should create different tokens for different users', () => {
      const token1 = signAccessToken('user-1', role);
      const token2 = signAccessToken('user-2', role);

      expect(token1).not.toBe(token2);
    });
  });

  describe('signRefreshToken', () => {
    it('should generate a refresh token and store in database', async () => {
      const mockToken = 'mock-refresh-token';
      const mockJti = 'mock-jti-uuid';
      const mockExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Mock crypto.randomUUID
      const originalRandomUUID = crypto.randomUUID;
      crypto.randomUUID = jest.fn().mockReturnValue(mockJti);

      mockPrisma.refreshToken.create.mockResolvedValue({
        userId,
        token: mockJti,
        expiresAt: mockExpiresAt,
      });

      const result = await signRefreshToken(userId);

      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mockPrisma.refreshToken.create).toHaveBeenCalledWith({
        data: {
          userId,
          token: mockJti,
          expiresAt: expect.any(Date),
        },
      });

      crypto.randomUUID = originalRandomUUID;
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = signAccessToken(userId, role);
      const payload = verifyAccessToken(token);

      expect(payload.sub).toBe(userId);
      expect(payload.role).toBe(role);
      expect(payload.type).toBe('access');
    });

    it('should throw ApiError for invalid token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow(ApiError);
      expect(() => verifyAccessToken('invalid-token')).toThrow('Invalid or expired access token');
    });

    it('should throw ApiError for expired token', () => {
      const expiredToken = jwt.sign(
        { sub: userId, role, type: 'access' },
        'test-secret-key-that-is-at-least-32-characters-long',
        { expiresIn: '-1h' }
      );

      expect(() => verifyAccessToken(expiredToken)).toThrow(ApiError);
    });

    it('should throw ApiError for token with wrong secret', () => {
      const token = jwt.sign(
        { sub: userId, role, type: 'access' },
        'wrong-secret',
        { expiresIn: '15m' }
      );

      expect(() => verifyAccessToken(token)).toThrow(ApiError);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', async () => {
      const mockJti = 'valid-jti';
      const token = jwt.sign(
        { sub: userId, type: 'refresh', jti: mockJti },
        'test-refresh-secret-key-that-is-at-least-32-characters-long',
        { expiresIn: '7d' }
      );

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        token: mockJti,
        revokedAt: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      const payload = await verifyRefreshToken(token);

      expect(payload.sub).toBe(userId);
      expect(payload.type).toBe('refresh');
      expect(payload.jti).toBe(mockJti);
      expect(mockPrisma.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token: mockJti },
      });
    });

    it('should throw for revoked token', async () => {
      const mockJti = 'revoked-jti';
      const token = jwt.sign(
        { sub: userId, type: 'refresh', jti: mockJti },
        'test-refresh-secret-key-that-is-at-least-32-characters-long',
        { expiresIn: '7d' }
      );

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        token: mockJti,
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await expect(verifyRefreshToken(token)).rejects.toThrow(ApiError);
      await expect(verifyRefreshToken(token)).rejects.toThrow('Invalid or expired refresh token');
    });

    it('should throw for expired token in database', async () => {
      const mockJti = 'expired-jti';
      const token = jwt.sign(
        { sub: userId, type: 'refresh', jti: mockJti },
        'test-refresh-secret-key-that-is-at-least-32-characters-long',
        { expiresIn: '7d' }
      );

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        token: mockJti,
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(verifyRefreshToken(token)).rejects.toThrow(ApiError);
    });

    it('should throw for non-existent token in database', async () => {
      const mockJti = 'non-existent-jti';
      const token = jwt.sign(
        { sub: userId, type: 'refresh', jti: mockJti },
        'test-refresh-secret-key-that-is-at-least-32-characters-long',
        { expiresIn: '7d' }
      );

      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(verifyRefreshToken(token)).rejects.toThrow(ApiError);
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke a refresh token', async () => {
      const mockJti = 'jti-to-revoke';

      mockPrisma.refreshToken.update.mockResolvedValue({
        token: mockJti,
        revokedAt: new Date(),
      });

      await revokeRefreshToken(mockJti);

      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
        where: { token: mockJti },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe('revokeAllUserRefreshTokens', () => {
    it('should revoke all refresh tokens for a user', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await revokeAllUserRefreshTokens(userId);

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId, revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});