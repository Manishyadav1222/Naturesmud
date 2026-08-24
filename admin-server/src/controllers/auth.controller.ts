import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async sendVerificationOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email || (req.user as any)?.email;
      const result = await authService.sendVerificationOtp(email);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async verifyEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email || (req.user as any)?.email;
      const { otpCode } = req.body;
      const result = await authService.verifyEmailOtp(email, otpCode);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otpCode, newPassword } = req.body;
      const result = await authService.resetPassword(email, otpCode, newPassword);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async socialLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.socialLogin(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch {
          // Token may already be revoked or expired - logout is best-effort.
        }
      }
      res.status(200).json({
        success: true,
        data: { success: true },
      });
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const result = await authService.logoutAll(req.user.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async setupTwoFactor(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const result = await authService.setupTwoFactor(req.user.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyTwoFactor(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const result = await authService.verifyTwoFactor(req.user.id, req.body.otpCode);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async disableTwoFactor(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const result = await authService.disableTwoFactor(req.user.id, req.body.otpCode);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}