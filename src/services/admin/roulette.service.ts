import { api } from '@/lib/axios';

// Tipos para premios
export interface RoulettePrize {
  id: string;
  name: string;
  description?: string;
  prize_type: 'cash' | 'bonus' | 'points' | 'spin' | 'special';
  prize_behavior: 'instant_cash' | 'bonus' | 'manual' | 'custom';
  prize_value: number;
  probability: number;
  color: string;
  position: number;
  isActive: boolean;
  icon?: string;
  min_value?: number;
  max_value?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrizeData {
  name: string;
  description?: string;
  prize_type: string;
  prize_behavior: string;
  prize_value: number;
  probability: number;
  color: string;
  position?: number;
  icon?: string;
  min_value?: number;
  max_value?: number;
}

export interface UpdatePrizeData extends Partial<CreatePrizeData> {
  isActive?: boolean;
}

// Tipos para validaciones
export interface PendingValidation {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
  demoPrize: RoulettePrize;
  spinDate: string;
  daysWaiting: number;
}

export interface ValidationData {
  action: 'approve' | 'reject';
  notes?: string;
}

// Tipos para estadísticas
export interface RouletteStats {
  overview: {
    totalSpins: number;
    totalRealSpins: number;
    totalDemoSpins: number;
    totalBonusSpins: number;
    totalValueAwarded: number;
    averagePrizeValue: number;
    conversionRate: number;
  };
  spinsByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  spinsByPeriod: Array<{
    date: string;
    total: number;
    demo: number;
    real: number;
    bonus: number;
  }>;
  topPrizes: Array<{
    prize: RoulettePrize;
    count: number;
    totalValue: number;
  }>;
  topUsers: Array<{
    user: {
      id: string;
      username: string;
      email: string;
    };
    totalSpins: number;
    totalWon: number;
  }>;
  prizeDistribution: Array<{
    prize: RoulettePrize;
    count: number;
    percentage: number;
  }>;
}

export const adminRouletteService = {
  // === PREMIOS ===
  // Obtener todos los premios
  getPrizes: async (filters?: { isActive?: boolean }) => {
    const response = await api.get('/roulette/prizes', { params: filters });
    return response.data;
  },

  // Obtener premio por ID
  getPrizeById: async (id: string) => {
    const response = await api.get(`/roulette/prizes/${id}`);
    return response.data;
  },

  // Crear premio
  createPrize: async (data: CreatePrizeData) => {
    const response = await api.post('/roulette/prizes', data);
    return response.data;
  },

  // Actualizar premio
  updatePrize: async (id: string, data: UpdatePrizeData) => {
    const response = await api.put(`/roulette/prizes/${id}`, data);
    return response.data;
  },

  // Eliminar premio
  deletePrize: async (id: string) => {
    const response = await api.delete(`/roulette/prizes/${id}`);
    return response.data;
  },

  // Ajustar probabilidades automáticamente
  adjustProbabilities: async (prizes: Array<{ id: string; probability: number }>) => {
    const response = await api.post('/roulette/prizes/adjust-probabilities', { prizes });
    return response.data;
  },

  // === VALIDACIONES ===
  // Obtener validaciones pendientes
  getPendingValidations: async (filters?: { page?: number; limit?: number }) => {
    const response = await api.get('/roulette/pending-validations', { params: filters });
    return response.data;
  },

  // Validar usuario individual
  validateUser: async (userId: string, data: ValidationData) => {
    const response = await api.post(`/roulette/validate/${userId}`, data);
    return response.data;
  },

  // Validar en lote
  validateBatch: async (userIds: string[], action: 'approve' | 'reject', notes?: string) => {
    const response = await api.post('/roulette/validate-batch', {
      userIds,
      action,
      notes,
    });
    return response.data;
  },

  // Obtener historial de validaciones
  getValidationHistory: async (filters?: { 
    page?: number; 
    limit?: number;
    action?: 'approve' | 'reject';
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/roulette/validation-history', { params: filters });
    return response.data;
  },

  // === ESTADÍSTICAS ===
  // Obtener estadísticas generales
  getStats: async (filters?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => {
    const response = await api.get('/roulette/stats', { params: filters });
    return response.data;
  },

  // Obtener códigos de ruleta
  getCodes: async (filters?: { 
    page?: number; 
    limit?: number;
    status?: 'active' | 'used' | 'expired';
    search?: string;
  }) => {
    const response = await api.get('/roulette/codes', { params: filters });
    return response.data;
  },

  // Crear código
  createCode: async (data: {
    code: string;
    maxUses?: number;
    expiresAt?: string;
  }) => {
    const response = await api.post('/roulette/codes', data);
    return response.data;
  },
};