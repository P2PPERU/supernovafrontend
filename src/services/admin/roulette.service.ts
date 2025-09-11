// src/services/admin/roulette.service.ts
import { api } from '@/lib/axios';

interface RouletteStats {
  todaySpins: number;
  todayRevenue: number;
  activeUsers: number;
  pendingValidations: number;
  conversionRate: number;
  topPrize: string;
  totalPrizes: number;
  biggestWin: number;
  hourlyActivity: Array<{
    hour: number;
    spins: number;
    revenue: number;
  }>;
  prizeDistribution: Array<{
    type: string;
    count: number;
    totalValue: number;
  }>;
  topWinners: Array<{
    userId: string;
    username: string;
    totalWins: number;
    biggestWin: number;
    totalSpins?: number;
    wins?: number;
  }>;
}

interface ValidationUser {
  id: string;
  username: string;
  email: string;
  demoCompleted: boolean;
  demoCompletedAt: string;
  isValidated: boolean;
  totalSpins: number;
  profile?: {
    firstName?: string;
    lastName?: string;
  };
}

interface ConversionAnalysis {
  conversionRate: number;
  avgSpinsBeforeConversion: number;
  avgRevenuePerUser: number;
  userSegments: Array<{
    segment: string;
    count: number;
    conversionRate: number;
  }>;
}

export const rouletteService = {
  // Obtener estadísticas de ruleta
  getStats: async (): Promise<{ success: boolean; stats: RouletteStats }> => {
    try {
      const response = await api.get('/roulette/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching roulette stats:', error);
      // Retornar valores por defecto
      return {
        success: false,
        stats: {
          todaySpins: 0,
          todayRevenue: 0,
          activeUsers: 0,
          pendingValidations: 0,
          conversionRate: 0,
          topPrize: 'N/A',
          totalPrizes: 0,
          biggestWin: 0,
          hourlyActivity: [],
          prizeDistribution: [],
          topWinners: []
        }
      };
    }
  },

  // Obtener usuarios pendientes de validación
  getPendingValidations: async (): Promise<{ 
    success: boolean; 
    users: ValidationUser[];
    total: number;
  }> => {
    try {
      const response = await api.get('/roulette/pending-validations');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending validations:', error);
      return {
        success: false,
        users: [],
        total: 0
      };
    }
  },

  // Validar usuario para giro real
  validateUser: async (userId: string, notes?: string): Promise<{ 
    success: boolean; 
    message: string;
  }> => {
    try {
      const response = await api.put(`/roulette/validate/${userId}`, { notes });
      return response.data;
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
    }
  },

  // Validación en lote
  validateBatch: async (userIds: string[]): Promise<{ 
    success: boolean; 
    validated: number;
    failed: number;
  }> => {
    try {
      const response = await api.post('/roulette/validate-batch', { userIds });
      return response.data;
    } catch (error) {
      console.error('Error in batch validation:', error);
      throw error;
    }
  },

  // Obtener configuración de premios
  getPrizeConfig: async (): Promise<{ success: boolean; prizes: any[] }> => {
    try {
      const response = await api.get('/roulette/prizes');
      return response.data;
    } catch (error) {
      console.error('Error fetching prize config:', error);
      return {
        success: false,
        prizes: []
      };
    }
  },

  // Obtener historial de giros
  getSpinHistory: async (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{ success: boolean; spins: any[] }> => {
    try {
      const response = await api.get('/roulette/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching spin history:', error);
      return {
        success: false,
        spins: []
      };
    }
  },

  // Obtener análisis de conversión
  getConversionAnalysis: async (period: 'day' | 'week' | 'month' = 'week'): Promise<{
    success: boolean;
    data: ConversionAnalysis;
  }> => {
    try {
      const response = await api.get('/roulette/analytics/conversion', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversion analysis:', error);
      return {
        success: false,
        data: {
          conversionRate: 0,
          avgSpinsBeforeConversion: 0,
          avgRevenuePerUser: 0,
          userSegments: []
        }
      };
    }
  },

  // Exportar estadísticas
  exportStats: async (format: 'csv' | 'excel' = 'csv'): Promise<Blob> => {
    try {
      const response = await api.get('/roulette/stats/export', {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting stats:', error);
      throw error;
    }
  }
};