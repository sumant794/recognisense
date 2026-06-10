import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    set({ user: null, token: null });
  },

  isAdmin: () => get().user?.role === 'admin',
}));