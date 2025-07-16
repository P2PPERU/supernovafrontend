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
  byRole: Array<{ role: string; count: number }>;
  recentUsers: User[];
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: string;
  parentAgentId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  balance?: number;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  role?: string;
  newPassword?: string;
}

interface BalanceOperation {
  balance: number;
  operation: 'set' | 'add' | 'subtract';
}

export const adminUsersService = {
  // Obtener lista de usuarios
  getUsers: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  // Obtener estadísticas
  getStats: async (): Promise<{ success: boolean; stats: UserStats }> => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id: string): Promise<{ success: boolean; user: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Crear usuario
  createUser: async (data: CreateUserData): Promise<{ success: boolean; user: User }> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Actualizar estado
  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.put(`/users/${id}/status`, { isActive });
    return response.data;
  },

  // Actualizar rol
  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  // Actualizar balance
  updateUserBalance: async (id: string, data: BalanceOperation) => {
    const response = await api.put(`/users/${id}/balance`, data);
    return response.data;
  },

  // Restablecer contraseña
  resetUserPassword: async (id: string, newPassword: string) => {
    const response = await api.put(`/users/${id}/password`, { newPassword });
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};