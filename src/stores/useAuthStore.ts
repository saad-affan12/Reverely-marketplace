import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { mockUsers } from '../mock/seedData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  switchDemoRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Default to Customer Saad for easy instant testing
      user: mockUsers[0],
      isAuthenticated: true,

      login: async (email: string, role?: UserRole) => {
        const found = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role)
        );
        if (found) {
          set({ user: found, isAuthenticated: true });
          return true;
        }
        // Fallback for demo emails
        let demoUser = mockUsers[0];
        if (email.includes('vendor')) demoUser = mockUsers[1];
        if (email.includes('admin')) demoUser = mockUsers[3];
        set({ user: demoUser, isAuthenticated: true });
        return true;
      },

      switchDemoRole: (role: UserRole) => {
        const targetUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
        set({ user: targetUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'reversely_auth_store',
    }
  )
);
