import { create } from 'zustand';
import { api, setAuthToken, unwrap } from '@/lib/api';
import type { LoginResponse, User } from '@/lib/types';

const TOKEN_KEY = 'aboni_token';

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
  setUser: (user: User) => void;
  isAdmin: () => boolean;
  hasPermission: (key: string) => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  hydrated: false,

  login: async (email, password) => {
    const data = await unwrap(api.post<import('@/lib/types').ApiResponse<LoginResponse>>('/auth/login', { email, password }));
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setAuthToken(data.accessToken);
    set({ token: data.accessToken, user: data.user });
  },

  register: async (name, email, password) => {
    const data = await unwrap(
      api.post<import('@/lib/types').ApiResponse<LoginResponse>>('/auth/register', { name, email, password }),
    );
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setAuthToken(data.accessToken);
    set({ token: data.accessToken, user: data.user });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    set({ token: null, user: null });
  },

  hydrate: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ hydrated: true, token: null, user: null });
      return;
    }
    setAuthToken(token);
    try {
      const user = await unwrap(api.get<import('@/lib/types').ApiResponse<User>>('/auth/me'));
      set({ token, user, hydrated: true });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
      set({ token: null, user: null, hydrated: true });
    }
  },

  setUser: (user) => set({ user }),

  isAdmin: () => {
    const role = get().user?.role;
    return role === 'admin' || role === 'super_admin';
  },

  hasPermission: (key) => {
    const user = get().user;
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (user.role !== 'admin') return false;
    return Boolean(user.permissions?.[key as keyof typeof user.permissions]);
  },
}));

// Initialize token on load
const stored = localStorage.getItem(TOKEN_KEY);
if (stored) setAuthToken(stored);
