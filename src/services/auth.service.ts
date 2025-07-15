import { api } from '@/lib/axios';
import { LoginRequest, AuthResponse, User } from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log('🔐 Attempting login with:', data.username);
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      console.log('✅ Login response:', response.data);
      
      // Verificar la estructura de la respuesta
      if (!response.data.token || !response.data.refreshToken) {
        console.error('❌ Invalid response structure:', response.data);
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getAffiliates: async () => {
    const response = await api.get('/auth/affiliates');
    return response.data;
  },
};