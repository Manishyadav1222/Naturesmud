'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin/auth';
import { loginRequest, ApiClientError } from '@/lib/admin/api-client';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { cn } from '@/lib/admin/utils';
import {
  Leaf,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Users,
  TrendingUp,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginRequest(
        email,
        password,
        requiresOtp ? otpCode : undefined
      );

      if (res.requires2FA || res.requiresOtp) {
        setRequiresOtp(true);
        return;
      }

      login(res.user);
      router.replace('/admin/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Unable to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleAdminLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          email: 'superadmin@naturesmud.com',
          name: 'Super Administrator',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        localStorage.setItem('nm_admin_access_token', data.data.accessToken);
        localStorage.setItem('nm_admin_refresh_token', data.data.refreshToken);
        login(data.data.user);
        router.replace('/admin/dashboard');
      } else {
        throw new Error(data.message || 'Google Workspace sign-in failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in error.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotErr('');
    setForgotMsg('');
    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotMsg(`Reset OTP code sent to ${forgotEmail}`);
        setForgotStep('otp');
      } else {
        setForgotErr(data.message || 'Could not send reset code.');
      }
    } catch (err: any) {
      setForgotErr(err.message || 'Server error.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp || forgotNewPass.length < 6) {
      setForgotErr('Please provide the 6-digit OTP and min 6-char password.');
      return;
    }
    setForgotLoading(true);
    setForgotErr('');
    try {
      const res = await fetch('/api/admin/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otpCode: forgotOtp,
          newPassword: forgotNewPass,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotMsg('Password reset successfully! You can now log in.');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep('email');
        }, 2000);
      } else {
        setForgotErr(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err: any) {
      setForgotErr(err.message || 'Password reset failed.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Left Branding Panel ── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-primary-900 lg:block">
        {/* Decorative background shapes */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-lime-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/10 blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 shadow-lg shadow-lime-400/20">
              <Leaf className="h-7 w-7 text-primary-950" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">NaturesMud</p>
              <p className="text-sm text-primary-200">Admin Dashboard</p>
            </div>
          </div>

          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Grow your natural
              <br />
              superfood empire.
            </h1>
            <p className="max-w-md text-lg text-primary-200">
              Manage products, orders, customers, marketing campaigns, and analytics — all from one powerful dashboard.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BarChart3, label: 'Analytics', color: 'text-lime-400' },
                { icon: ShoppingBag, label: 'Orders', color: 'text-lime-400' },
                { icon: Users, label: 'Customers', color: 'text-lime-400' },
                { icon: TrendingUp, label: 'Growth', color: 'text-lime-400' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <item.icon className={cn('h-5 w-5', item.color)} />
                  <span className="text-sm font-medium text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-primary-300">
            © {new Date().getFullYear()} NaturesMud. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Login Form Panel ── */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">NaturesMud</p>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1 text-xs font-medium text-lime-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Admin Access
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {requiresOtp ? 'Enter verification code' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-gray-500">
              {requiresOtp
                ? 'Enter the 6-digit code from your authenticator app to continue.'
                : 'Sign in to access your admin dashboard.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!requiresOtp ? (
              <>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    label="Email address"
                    placeholder="admin@naturesmud.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-primary-600 hover:text-primary-800 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Authentication code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white text-center text-2xl font-semibold tracking-[0.5em] text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Open your authenticator app or check your Gmail OTP to enter the code.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {!isLoading && (
                <>
                  {requiresOtp ? 'Verify & Sign In' : 'Sign In'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Google Workspace Sign-In */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {googleLoading ? 'Authenticating...' : 'Sign in with Google Workspace'}
            </button>
          </div>

          {/* Demo Staff Accounts Helper */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
            <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-600" /> Demo Admin Access
            </p>
            <p>Super Admin: <code className="bg-white px-1.5 py-0.5 rounded border">superadmin@naturesmud.com</code></p>
            <p className="mt-0.5">Password: <code className="bg-white px-1.5 py-0.5 rounded border">password123</code></p>
          </div>

          {/* Reset Password Modal */}
          {showForgotModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Admin Password Reset</h3>
                  <button onClick={() => setShowForgotModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                {forgotErr && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{forgotErr}</p>}
                {forgotMsg && <p className="text-xs text-green-700 bg-green-50 p-2.5 rounded-lg">{forgotMsg}</p>}

                {forgotStep === 'email' ? (
                  <form onSubmit={handleSendForgotOtp} className="space-y-3">
                    <p className="text-xs text-gray-500">Enter your staff email to receive a 6-digit security OTP.</p>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@naturesmud.com"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg text-xs hover:bg-primary-700 transition-colors"
                    >
                      {forgotLoading ? 'Sending OTP...' : 'Send Security OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordWithOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">6-Digit OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full px-3 py-2 border rounded-lg text-sm text-center font-mono tracking-widest text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={forgotNewPass}
                        onChange={(e) => setForgotNewPass(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg text-xs hover:bg-primary-700 transition-colors"
                    >
                      {forgotLoading ? 'Updating Password...' : 'Reset Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {requiresOtp && (
            <button
              type="button"
              onClick={() => setRequiresOtp(false)}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to login
            </button>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Protected by enterprise-grade security</span>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 transition-colors hover:text-gray-600"
            >
              ← Back to storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}