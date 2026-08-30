'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  LogOut,
  Package,
  Heart,
  MapPin,
  Settings,
  ChevronRight,
  Leaf,
  Star,
  Truck,
  ShieldCheck,
  Instagram,
  Search,
  Clock,
  CheckCircle2,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { products } from '@/lib/data/products';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { authApi, type AuthUser } from '@/lib/api';
import { ordersApi, type Order } from '@/lib/orders-api';
import { useOrderStore } from '@/lib/store/order-store';
import OrderCard from '@/components/OrderCard';

type LoginForm = { email: string; password: string };
type RegisterForm = { name: string; email: string; phone: string; password: string; confirmPassword: string };

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'profile'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  // Social Auth & Email Verification State
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyOtpCode, setVerifyOtpCode] = useState('');
  const [verifySending, setVerifySending] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('');
  const [verifyErr, setVerifyErr] = useState('');

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');

  const handleSocialLogin = async (provider: 'google' | 'meta') => {
    setSocialLoading(provider);
    setError('');
    try {
      // Direct call to admin-server social-login endpoint
      const mockSocialEmail = provider === 'google' ? 'google.customer@gmail.com' : 'meta.customer@facebook.com';
      const mockSocialName = provider === 'google' ? 'Google User' : 'Meta User';

      const res = await fetch('/api/admin/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: mockSocialEmail,
          name: mockSocialName,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const authData = json.data;
        localStorage.setItem('naturesmud_token', authData.accessToken);
        localStorage.setItem('naturesmud_user', JSON.stringify({
          id: authData.user.id,
          name: authData.user.name,
          email: authData.user.email,
          phone: authData.user.phone || '+977 9800000000',
          role: authData.user.role,
          isVerified: true,
        }));
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
        setUser({
          id: authData.user.id,
          name: authData.user.name,
          email: authData.user.email,
          phone: authData.user.phone || '+977 9800000000',
          role: authData.user.role,
        });
        loadOrders(true);
        setActiveTab('dashboard');
      } else {
        throw new Error(json.message || `Failed to sign in with ${provider}`);
      }
    } catch (err: any) {
      setError(err.message || `Social login with ${provider} failed.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSendVerificationOtp = async () => {
    if (!user?.email) return;
    setVerifySending(true);
    setVerifyErr('');
    setVerifyMsg('');
    try {
      const res = await fetch('/api/admin/auth/send-verification-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifyMsg(`A 6-digit verification code was sent to ${user.email}`);
        setShowVerifyModal(true);
      } else {
        setVerifyErr(data.message || 'Could not send verification code.');
      }
    } catch (err: any) {
      setVerifyErr(err.message || 'Could not connect to verification server.');
    } finally {
      setVerifySending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyOtpCode || verifyOtpCode.length !== 6) {
      setVerifyErr('Please enter the full 6-digit code.');
      return;
    }
    setVerifyLoading(true);
    setVerifyErr('');
    try {
      const res = await fetch('/api/admin/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, otpCode: verifyOtpCode }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifyMsg('Email verified successfully!');
        if (user) {
          const updated = { ...user, isVerified: true };
          setUser(updated);
          localStorage.setItem('naturesmud_user', JSON.stringify(updated));
        }
        setTimeout(() => setShowVerifyModal(false), 2000);
      } else {
        setVerifyErr(data.message || 'Invalid or expired code.');
      }
    } catch (err: any) {
      setVerifyErr(err.message || 'Verification failed.');
    } finally {
      setVerifyLoading(false);
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
        setForgotMsg(`Reset code sent to ${forgotEmail}`);
        setForgotStep('otp');
      } else {
        setForgotErr(data.message || 'Could not process request.');
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

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');
    const form = e.currentTarget;
    const name = (form.elements.namedItem('profile-name') as HTMLInputElement)?.value;
    const email = (form.elements.namedItem('profile-email') as HTMLInputElement)?.value;
    const phone = (form.elements.namedItem('profile-phone') as HTMLInputElement)?.value;

    try {
      const res = await (await import('@/lib/api')).api.put('/me', { name, email, phone });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('naturesmud_user', JSON.stringify(res.data.user));
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
      }
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 4000);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setOrdersLoading(true);
    setOrdersError('');
    try {
      const list = await ordersApi.getMyOrders();
      setOrders(list);
    } catch (err: any) {
      setOrdersError(err.response?.data?.message || 'Could not load your orders.');
      setOrders([]);
    } finally {
      if (!silent) setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('naturesmud_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('naturesmud_user');
      }
    }
    const token = localStorage.getItem('naturesmud_token');
    if (token) {
      loadOrders(true);
    }
    setLoading(false);
  }, [loadOrders]);

  const login = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });
  const register = useForm<RegisterForm>({ defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' } });

  const handleLogin = async (data: LoginForm) => {
    setError('');
    setSubmitting(true);
    try {
      const response = await authApi.login(data.email, data.password);
      localStorage.setItem('naturesmud_token', response.token);
      localStorage.setItem('naturesmud_user', JSON.stringify(response.user));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
      setUser(response.user);
      loadOrders(true);
      setActiveTab('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setError('');
    if (!data.name || !data.email || !data.phone || !data.password) {
      setError('All fields are required.');
      return;
    }
    if (data.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await authApi.register(
        data.name,
        data.email,
        data.phone,
        data.password,
        data.confirmPassword
      );
      localStorage.setItem('naturesmud_token', response.token);
      localStorage.setItem('naturesmud_user', JSON.stringify(response.user));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
      setUser(response.user);
      loadOrders(true);
      setActiveTab('dashboard');
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        const messages = Object.values(errors).flat();
        setError(String(messages[0]) || 'Registration failed.');
      } else {
        setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout - just clear local state
    }
    localStorage.removeItem('naturesmud_token');
    localStorage.removeItem('naturesmud_user');
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
    useOrderStore.getState().clearOrders();
    useCartStore.getState().clearCart();
    useWishlistStore.getState().clearWishlist();
    setUser(null);
    setMode('login');
  };

  const cartItems = useCartStore((s) => s.items);
  const wishlistData = useWishlistStore((s) => s.items);
  const wishlistProducts = products.filter((p) => wishlistData.includes(p.slug));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ===== AUTH SCREEN =====
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-[#F8F4EC] py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float-slower" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Auth card */}
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 rounded-3xl overflow-hidden shadow-2xl bg-white border border-primary/10">
            {/* Left: Form */}
            <div className="p-8 sm:p-12">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-6 h-6 text-primary" />
                <span className="font-heading font-bold text-xl text-primary">NaturesMud</span>
              </div>
              <h1 className="font-heading font-bold text-3xl text-dark mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                {mode === 'login'
                  ? 'Log in to track orders, manage wishlist, and checkout faster.'
                  : 'Join NaturesMud for exclusive offers and faster checkout.'}
              </p>

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-full p-1 mb-8">
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-primary text-white' : 'text-gray-600'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'register' ? 'bg-primary text-white' : 'text-gray-600'}`}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm" role="alert">
                  {error}
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={login.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        {...login.register('email')}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-dark mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="password"
                        type="password"
                        {...login.register('password')}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(login.getValues('email') || '');
                        setShowForgotModal(true);
                      }}
                      className="text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors"
                  >
                    Login
                  </button>
                </form>
              ) : (
                <form onSubmit={register.handleSubmit(handleRegister)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark mb-1.5">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="name"
                        type="text"
                        {...register.register('name')}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-dark mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="reg-email"
                        type="email"
                        {...register.register('email')}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-dark mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="phone"
                        type="tel"
                        {...register.register('phone')}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="reg-password" className="block text-sm font-medium text-dark mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="reg-password"
                          type="password"
                          {...register.register('password')}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="Min 6 chars"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-dark mb-1.5">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="confirm-password"
                          type="password"
                          {...register.register('confirmPassword')}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="Repeat password"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors"
                  >
                    Create Account
                  </button>
                </form>
              )}

              {/* Social Login Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-semibold">Or continue with</span>
                </div>
              </div>

              {/* Google & Meta Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  {socialLoading === 'google' ? 'Connecting...' : 'Google'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('meta')}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4 text-[#0668E1]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {socialLoading === 'meta' ? 'Connecting...' : 'Meta'}
                </button>
              </div>

              {/* Forgot Password Modal */}
              {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Reset Password via Gmail OTP</h3>
                      <button onClick={() => setShowForgotModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    {forgotErr && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{forgotErr}</p>}
                    {forgotMsg && <p className="text-xs text-green-700 bg-green-50 p-2.5 rounded-lg">{forgotMsg}</p>}

                    {forgotStep === 'email' ? (
                      <form onSubmit={handleSendForgotOtp} className="space-y-3">
                        <p className="text-xs text-gray-500">Enter your account email to receive a 6-digit verification code.</p>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                        <button
                          type="submit"
                          disabled={forgotLoading}
                          className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg text-xs"
                        >
                          {forgotLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleResetPasswordWithOtp} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">6-Digit Code</label>
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
                          className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg text-xs"
                        >
                          {forgotLoading ? 'Resetting...' : 'Set New Password'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 rounded-xl bg-[#F8F4EC] text-xs text-gray-600">
                <p className="font-semibold text-dark mb-1 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-gold" /> Demo credentials
                </p>
                <p>Email: <code className="bg-white px-1.5 py-0.5 rounded">customer@naturesmud.com</code></p>
                <p>Password: <code className="bg-white px-1.5 py-0.5 rounded">password</code></p>
                <p className="mt-1.5 text-gray-400">(Or continue instantly with Google / Meta above)</p>
              </div>
            </div>

            {/* Right: Brand panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary-dark text-white">
              <div>
                <h2 className="font-heading text-3xl font-bold leading-tight mb-4">
                  Nourish Your Body<br />with Nature's Best
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  Join thousands of Nepali families enjoying premium organic nuts, seeds, superfoods, and healthy snacks.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Truck, label: 'Free shipping over Rs. 10,000' },
                  { icon: ShieldCheck, label: '100% natural, no additives' },
                  { icon: Leaf, label: 'Sourced from Nepali farmers' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Settings },
    { id: 'orders' as const, label: 'My Orders', icon: Package },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart },
    { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { id: 'profile' as const, label: 'Profile', icon: UserIcon },
  ];

  const firstName = user.name?.split(' ')[0] || 'There';

  return (
    <div className="min-h-screen bg-[#F8F4EC]">
      {/* Dashboard header */}
      <div className="bg-gradient-to-r from-primary to-[#2d5429] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-white/70 text-sm mb-1">Welcome back,</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center font-heading font-bold text-2xl">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl">{user.name}</h1>
              <p className="text-white/70 text-sm">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <nav className="bg-white rounded-2xl p-3 shadow-sm space-y-1">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === id ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4" /> {label}
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="space-y-6">
            {activeTab === 'dashboard' && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Package, label: 'Orders', value: String(orders.length) },
                    { icon: Heart, label: 'Wishlist', value: String(wishlistData.length) },
                    { icon: MapPin, label: 'Addresses', value: '1' },
                    { icon: Leaf, label: 'Points', value: '120' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
                      <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </span>
                      <p className="font-heading font-bold text-2xl">{value}</p>
                      <p className="text-sm text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-lg mb-4">Quick Actions</h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Link href="/products" className="p-4 rounded-xl bg-[#F8F4EC] hover:bg-[#f0eadf] transition-colors">
                      <Search className="w-5 h-5 text-primary mb-2" />
                      <p className="font-semibold text-sm">Shop Products</p>
                      <p className="text-xs text-gray-500 mt-1">Browse 12+ organic products</p>
                    </Link>
                    <Link href="/recipes" className="p-4 rounded-xl bg-[#F8F4EC] hover:bg-[#f0eadf] transition-colors">
                      <Instagram className="w-5 h-5 text-primary mb-2" />
                      <p className="font-semibold text-sm">Try Recipes</p>
                      <p className="text-xs text-gray-500 mt-1">Healthy meal inspiration</p>
                    </Link>
                    <Link href="/track-order" className="p-4 rounded-xl bg-[#F8F4EC] hover:bg-[#f0eadf] transition-colors">
                      <Truck className="w-5 h-5 text-primary mb-2" />
                      <p className="font-semibold text-sm">Track Order</p>
                      <p className="text-xs text-gray-500 mt-1">Follow your delivery</p>
                    </Link>
                  </div>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-lg">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-primary hover:underline">View all</button>
                  </div>
                  {cartItems.length > 0 ? (
                    <div className="space-y-3">
                      {cartItems.slice(0, 2).map((item) => {
                        const product = products.find((p) => p.slug === item.productId);
                        if (!product) return null;
                        return (
                          <div key={item.productId} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F8F4EC]">
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{product.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-medium">In Cart</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No orders yet</p>
                      <Link href="/products" className="inline-block mt-3 text-sm text-primary font-semibold hover:underline">Start shopping</Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-lg">My Orders</h2>
                  {orders.length > 0 && (
                    <button onClick={() => loadOrders()} className="text-sm text-primary hover:underline flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                  )}
                </div>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-red-500 mb-2">{ordersError}</p>
                    <button onClick={() => loadOrders()} className="text-sm text-primary font-semibold hover:underline">
                      Try again
                    </button>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No orders yet. Add products to your cart and checkout to place an order.</p>
                    <Link href="/products" className="inline-block mt-3 text-sm text-primary font-semibold hover:underline">Start shopping</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading font-bold text-lg mb-4">My Wishlist</h2>
                {wishlistProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((product) => (
                      <Link key={product.slug} href={`/products/${product.slug}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F8F4EC]">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-sm text-primary font-semibold mt-1">Rs. {product.price.toLocaleString()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Your wishlist is empty.</p>
                    <Link href="/products" className="inline-block mt-3 text-sm text-primary font-semibold hover:underline">Browse products</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading font-bold text-lg mb-4">Saved Addresses</h2>
                <div className="p-5 rounded-xl border border-gray-100 bg-[#F8F4EC]">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-sm">Home</p>
                  </div>
                  <p className="text-sm text-gray-600">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                  <p className="text-sm text-gray-600">Kathmandu, Nepal</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-lg">Profile Details</h2>
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Gmail Verified
                    </span>
                  ) : (
                    <button
                      onClick={handleSendVerificationOtp}
                      disabled={verifySending}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {verifySending ? 'Sending Code...' : 'Verify with Gmail OTP'}
                    </button>
                  )}
                </div>

                {/* Email verification status banner if not verified */}
                {!user.isVerified && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                    <div>
                      <p className="font-bold text-sm text-amber-800 flex items-center gap-1.5 mb-1">
                        <Mail className="w-4 h-4 text-amber-600" /> Verify Your Email Address
                      </p>
                      <p className="text-amber-700">Verify your Gmail to enable instant order notifications, SMS delivery tracking, and loyalty points.</p>
                    </div>
                    <button
                      onClick={handleSendVerificationOtp}
                      disabled={verifySending}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0 transition-colors"
                    >
                      {verifySending ? 'Sending...' : 'Send Verification OTP'}
                    </button>
                  </div>
                )}

                {profileMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                    {profileError}
                  </div>
                )}
                <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-md">
                  <div>
                    <label htmlFor="profile-name" className="block text-sm font-medium text-dark mb-1.5">Full Name</label>
                    <input
                      id="profile-name"
                      name="profile-name"
                      defaultValue={user.name}
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-sm font-medium text-dark mb-1.5">Email</label>
                    <input
                      id="profile-email"
                      name="profile-email"
                      type="email"
                      defaultValue={user.email}
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-phone" className="block text-sm font-medium text-dark mb-1.5">Phone</label>
                    <input
                      id="profile-phone"
                      name="profile-phone"
                      defaultValue={user.phone || ''}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Gmail OTP Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Gmail OTP Verification
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <p className="text-xs text-gray-500">
              We sent a 6-digit verification code to <strong>{user?.email}</strong>. Enter it below to verify your account.
            </p>

            {verifyErr && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{verifyErr}</p>}
            {verifyMsg && <p className="text-xs text-green-700 bg-green-50 p-2.5 rounded-lg">{verifyMsg}</p>}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={verifyOtpCode}
                  onChange={(e) => setVerifyOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleSendVerificationOtp}
                  disabled={verifySending}
                  className="text-primary font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="px-5 py-2 bg-primary text-white font-semibold rounded-lg text-xs hover:bg-primary-dark transition-colors"
                >
                  {verifyLoading ? 'Verifying...' : 'Verify Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}