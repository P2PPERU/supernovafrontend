import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken) => {
        // Guardar en cookies
        Cookies.set('token', token, { expires: 7 }); // 7 días
        Cookies.set('refreshToken', refreshToken, { expires: 30 }); // 30 días
        
        // Guardar en localStorage también
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        // Limpiar cookies
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);