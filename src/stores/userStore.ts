import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from './authStore';

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@pos.com', role: 'admin' },
  { id: '2', name: 'Kasir Demo', email: 'kasir@pos.com', role: 'cashier' },
  { id: '3', name: 'Budi Santoso', email: 'budi@pos.com', role: 'cashier' },
  { id: '4', name: 'Siti Rahayu', email: 'siti@pos.com', role: 'cashier' },
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: initialUsers,
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, { ...user, id: Date.now().toString() }],
        })),
      updateUser: (id, user) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...user } : u
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);
