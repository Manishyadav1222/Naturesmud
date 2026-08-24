// ============================================================
// Admin API client - typed fetch with JWT + refresh
// ============================================================

import { getAdminApiBase } from './utils';
import type { ApiResponse, LoginResponse, RefreshResponse } from './types';

const ACCESS_TOKEN_KEY = 'nm_admin_access_token';
const REFRESH_TOKEN_KEY = 'nm_admin_refresh_token';

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export const tokenStore = {
  getAccessToken: () => (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null),
  getRefreshToken: () => (typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null),
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearTokens: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

async function refreshTokens(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  const base = getAdminApiBase();
  try {
    const res = await fetch(`${base}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      tokenStore.clearTokens();
      refreshQueue.forEach((cb) => cb(null));
      refreshQueue = [];
      return null;
    }

    const data = (await res.json()) as ApiResponse<RefreshResponse>;
    tokenStore.setTokens(data.data.accessToken, data.data.refreshToken);

    const newToken = data.data.accessToken;
    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];
    return newToken;
  } catch {
    tokenStore.clearTokens();
    refreshQueue.forEach((cb) => cb(null));
    refreshQueue = [];
    return null;
  } finally {
    isRefreshing = false;
  }
}

export class ApiClientError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  auth?: boolean;
  formData?: FormData;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    params,
    headers = {},
    auth = true,
    formData,
  } = options;

  const base = getAdminApiBase();
  let url = `${base}${path}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const requestHeaders: Record<string, string> = { ...headers };
  if (!formData) requestHeaders['Content-Type'] = 'application/json';
  if (auth) {
    const token = tokenStore.getAccessToken();
    if (token) requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const makeRequest = async (): Promise<Response> => {
    try {
      return await fetch(url, {
        method,
        headers: requestHeaders,
        body: formData ?? (body ? JSON.stringify(body) : undefined),
      });
    } catch (err) {
      throw new ApiClientError(
        0,
        err instanceof Error ? err.message : 'Unable to connect to server (Network Error)',
        err
      );
    }
  };

  let response = await makeRequest();

  // Handle 401 by refreshing token once
  if (response.status === 401 && auth) {
    const newToken = await refreshTokens();
    if (newToken) {
      requestHeaders['Authorization'] = `Bearer ${newToken}`;
      response = await makeRequest();
    }
  }

  if (!response.ok) {
    let errorData: unknown;
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const json = await response.json();
      errorData = json;
      if (json && typeof json === 'object' && 'message' in json) {
        errorMessage = String((json as { message: unknown }).message);
      }
    } catch {
      // Not JSON
    }
    throw new ApiClientError(response.status, errorMessage, errorData);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

// ---------- Convenience methods ----------
export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),

  upload: <T>(path: string, formData: FormData, options?: Omit<RequestOptions, 'method' | 'body' | 'formData'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', formData }),
};

// ---------- Auth-specific helpers ----------
export async function loginRequest(
  email: string,
  password: string,
  otpCode?: string,
  twoFactorToken?: string
): Promise<LoginResponse> {
  let res: Response;
  const base = getAdminApiBase();
  try {
    res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, otpCode, twoFactorToken }),
    });
  } catch (err) {
    throw new ApiClientError(
      0,
      `Unable to connect to the admin server. Please ensure the admin backend is running on ${base}`,
      err
    );
  }

  const data = (await res.json()) as ApiResponse<LoginResponse> & { message?: string };

  if (!res.ok) {
    throw new ApiClientError(res.status, data.message || 'Login failed', data);
  }

  if (!data.data.requires2FA && !data.data.requiresOtp) {
    tokenStore.setTokens(data.data.accessToken, data.data.refreshToken);
  }

  return data.data;
}

export async function verifyOtpRequest(otpCode: string, otpToken: string): Promise<LoginResponse> {
  let res: Response;
  const base = getAdminApiBase();
  try {
    res = await fetch(`${base}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otpCode, otpToken }),
    });
  } catch (err) {
    throw new ApiClientError(
      0,
      `Unable to connect to the admin server. Please ensure the admin backend is running on ${base}`,
      err
    );
  }

  const data = (await res.json()) as ApiResponse<LoginResponse> & { message?: string };

  if (!res.ok) {
    throw new ApiClientError(res.status, data.message || 'OTP verification failed', data);
  }

  tokenStore.setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data;
}

export async function setup2FARequest() {
  return api.post<{ qrCode: string; secret: string }>('/auth/2fa/setup');
}

export async function verify2FARequest(code: string) {
  return api.post<{ enabled: boolean }>('/auth/2fa/verify', { code });
}

export async function logoutRequest() {
  try {
    const refreshToken = tokenStore.getRefreshToken();
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (err) {
    console.warn('Logout API error:', err);
  } finally {
    tokenStore.clearTokens();
  }
}