import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'cashier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Demo users
const demoUsers: Record<string, { password: string; user: User }> = {
  'admin@pos.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@pos.com',
      role: 'admin',
    },
  },
  'kasir@pos.com': {
    password: 'kasir123',
    user: {
      id: '2',
      name: 'Kasir Demo',
      email: 'kasir@pos.com',
      role: 'cashier',
    },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const demoUser = demoUsers[email];
        if (demoUser && demoUser.password === password) {
          set({ user: demoUser.user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
