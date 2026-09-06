import axios from 'axios';
import type { ApiEnvelope, ApiHealth, AuthSession } from '@bchealth/types';

const ACCESS_TOKEN_KEY = 'bchealth.accessToken';
const REFRESH_TOKEN_KEY = 'bchealth.refreshToken';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) throw error;

    originalRequest._retry = true;
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw error;

    try {
      const session = await refreshSession(refreshToken);
      setSession(session);
      originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearSession();
      throw refreshError;
    }
  },
);

export async function getHealth() {
  const response = await api.get<ApiEnvelope<ApiHealth>>('/health');
  return response.data.data ?? response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post<AuthSession>('/auth/login', { email, password });
  setSession(response.data);
  return response.data;
}

export async function refreshSession(refreshToken: string) {
  const response = await axios.post<AuthSession>(
    `${api.defaults.baseURL}/auth/refresh`,
    { refreshToken },
    { withCredentials: true },
  );
  return response.data;
}

export async function logout() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await api.post('/auth/logout', { refreshToken }).catch(() => undefined);
  }
  clearSession();
}

export async function getCurrentUser() {
  const response = await api.get<AuthSession['user']>('/auth/me');
  return response.data;
}

export function setSession(session: AuthSession) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem('bchealth.user', JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('bchealth.user');
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
