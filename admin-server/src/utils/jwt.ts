import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';
import crypto from 'crypto';
import { ApiError } from './ApiError';

interface AccessTokenPayload {
  sub: string;
  role: string;
  type: 'access';
}

interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  jti: string;
}

export const signAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ sub: userId, role, type: 'access' } as AccessTokenPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const signRefreshToken = async (userId: string): Promise<{ token: string; expiresAt: Date }> => {
  const jti = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const token = jwt.sign({ sub: userId, type: 'refresh', jti } as RefreshTokenPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  await prisma.refreshToken.create({
    data: {
      userId,
      token: jti,
      expiresAt,
    },
  });

  return { token, expiresAt };
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired access token');
  }
};

export const verifyRefreshToken = async (token: string): Promise<RefreshTokenPayload> => {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: payload.jti },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

export const revokeRefreshToken = async (jti: string): Promise<void> => {
  await prisma.refreshToken.update({
    where: { token: jti },
    data: { revokedAt: new Date() },
  });
};

export const revokeAllUserRefreshTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};