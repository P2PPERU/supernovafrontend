import { api } from '@/lib/axios';
import { LoginRequest, AuthResponse, User } from '@/types';

// Tipo para afiliados
export interface Affiliate {
  id: string;
  username: string;
  profile_data?: {
    firstName?: string;
    lastName?: string;
  };
  affiliateProfile?: {
    id: string;
    affiliate_code: string;
    custom_url?: string;
  };
}

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
    // Limpiar datos antes de enviar
    const cleanData = {
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
      affiliateId: data.affiliateId && data.affiliateId !== 'none' ? data.affiliateId : undefined,
    };
    
    console.log('📝 Registering with:', { ...cleanData, password: '***' });
    
    const response = await api.post<AuthResponse>('/auth/register', cleanData);
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

  getAffiliates: async (): Promise<{
    success: boolean;
    affiliates: Affiliate[];
  }> => {
    try {
      const response = await api.get('/auth/affiliates');
      console.log('📋 Affiliates response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting affiliates:', error);
      return { success: true, affiliates: [] };
    }
  },
};