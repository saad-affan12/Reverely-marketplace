import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { authApi } from '../services/api/authApi';
import { mockUsers } from '../mock/seedData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (data: { name: string; email: string; password?: string; role: UserRole; companyName?: string }) => Promise<boolean>;
  switchDemoRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: mockUsers[0],
      isAuthenticated: true,
      token: null,

      login: async (email: string, role?: UserRole) => {
        try {
          const res = await authApi.login(email, role);
          if (res.data?.user) {
            set({
              user: res.data.user,
              token: res.data.token,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      register: async (data) => {
        try {
          const res = await authApi.register(data);
          if (res.data?.user) {
            set({
              user: res.data.user,
              token: res.data.token,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      switchDemoRole: async (role: UserRole) => {
        try {
          const res = await authApi.getDemoUser(role);
          if (res.data?.user) {
            set({
              user: res.data.user,
              token: res.data.token,
              isAuthenticated: true,
            });
          }
        } catch {
          const fallback = mockUsers.find((u) => u.role === role) || mockUsers[0];
          set({ user: fallback, isAuthenticated: true });
        }
      },

      logout: async () => {
        await authApi.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'reversely_auth_store',
    }
  )
);
