import { api } from '@/lib/axios';
import { User, PaginatedResponse } from '@/types';

interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
  byRole: Array<{ role: string; count: number }>;
  recentUsers: User[];
  growthMetrics: {
    dailyGrowth: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  balance?: number;
  // Campos de afiliación
  affiliateId?: string;
  affiliateCode?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  role?: string;
  balance?: number;
  // Campos de afiliación para clientes
  affiliateId?: string;
  affiliateCode?: string;
}

interface BalanceOperation {
  balance: number;
  operation: 'set' | 'add' | 'subtract';
}

// Interfaces para afiliados
interface AffiliateProfile {
  id: string;
  user_id: string;
  affiliate_code: string;
  commission_rate: number;
  total_referrals: number;
  total_earnings: number;
  is_active: boolean;
  custom_url?: string;
  user: {
    id: string;
    username: string;
    email: string;
    profile_data: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
    created_at?: string;
  };
}

interface AvailableAffiliate {
  id: string;
  username: string;
  displayName?: string;
  affiliateCode: string;
  customUrl?: string;
  profile_data?: {
    firstName?: string;
    lastName?: string;
  };
  affiliateProfile?: {
    affiliate_code: string;
    custom_url?: string;
  };
}

interface AffiliationHistory {
  id: string;
  client_id: string;
  agent_id: string;
  affiliate_code_used?: string;
  bonus_applied: number;
  ip_address: string;
  created_at: string;
  client: {
    username: string;
    email: string;
  };
  agent: {
    username: string;
    email: string;
  };
}

export const adminUsersService = {
  // Usuarios básicos
  getUsers: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  getStats: async (): Promise<{ success: boolean; stats: UserStats }> => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  getUserById: async (id: string): Promise<{ success: boolean; user: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<{ success: boolean; user: User }> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<{ success: boolean; user: User }> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.put(`/users/${id}/status`, { isActive });
    return response.data;
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  updateUserBalance: async (id: string, data: BalanceOperation) => {
    const response = await api.put(`/users/${id}/balance`, data);
    return response.data;
  },

  resetUserPassword: async (id: string, newPassword: string) => {
    const response = await api.put(`/users/${id}/password`, { newPassword });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Funciones para afiliados
  getAffiliateProfiles: async (filters: UserFilters = {}): Promise<PaginatedResponse<AffiliateProfile>> => {
    const response = await api.get('/admin/affiliates', { params: filters });
    return response.data;
  },

  getAvailableAffiliates: async (): Promise<{ success: boolean; affiliates: AvailableAffiliate[] }> => {
    const response = await api.get('/auth/affiliates');
    return response.data;
  },

  updateAffiliateProfile: async (userId: string, data: {
    commission_rate?: number;
    is_active?: boolean;
    custom_url?: string;
  }) => {
    const response = await api.put(`/admin/affiliates/${userId}`, data);
    return response.data;
  },

  getAffiliationHistory: async (filters: {
    page?: number;
    limit?: number;
    agent_id?: string;
    client_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<PaginatedResponse<AffiliationHistory>> => {
    const response = await api.get('/admin/affiliations', { params: filters });
    return response.data;
  },

  getAgentClients: async (agentId: string, filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    const response = await api.get(`/admin/agents/${agentId}/clients`, { params: filters });
    return response.data;
  },

  transferClient: async (clientId: string, newAgentId: string) => {
    const response = await api.put(`/admin/users/${clientId}/transfer`, { newAgentId });
    return response.data;
  },

  // Estadísticas de afiliados
  getAffiliateStats: async (agentId?: string) => {
    const url = agentId ? `/admin/affiliates/${agentId}/stats` : '/admin/affiliates/stats';
    const response = await api.get(url);
    return response.data;
  },

  // Gestión de códigos de afiliado (para admin)
  getAffiliateCodes: async (affiliateId?: string) => {
    const url = affiliateId ? `/admin/affiliates/${affiliateId}/codes` : '/admin/affiliate-codes';
    const response = await api.get(url);
    return response.data;
  },

  createAffiliateCode: async (affiliateId: string, data: {
    description?: string;
    bonusAmount?: number;
    maxUses?: number;
    expiresIn?: number;
  }) => {
    const response = await api.post(`/admin/affiliates/${affiliateId}/codes`, data);
    return response.data;
  },

  updateAffiliateCode: async (codeId: string, data: {
    description?: string;
    isActive?: boolean;
  }) => {
    const response = await api.put(`/admin/affiliate-codes/${codeId}`, data);
    return response.data;
  },

  deleteAffiliateCode: async (codeId: string) => {
    const response = await api.delete(`/admin/affiliate-codes/${codeId}`);
    return response.data;
  },
};

export default adminUsersService;