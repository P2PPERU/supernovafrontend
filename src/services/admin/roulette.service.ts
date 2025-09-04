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

export interface DashboardStats {
  totalUsers: number;
  monthlyRevenue: number;
  totalSpins: number;
  activeBonus: number;
  recentActivity: Array<{
    id: string;
    type: string;
    action: string;
    user?: string;
    amount?: number;
    count?: number;
    time: string;
  }>;
  monthlyRevenueData: Array<{
    month: string;
    total: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    users: number;
    spins: number;
  }>;
}

export interface RouletteCode {
  id: string;
  code: string;
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  createdBy: {
    id: string;
    username: string;
  };
  createdAt: string;
  status: 'active' | 'used' | 'expired';
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
  adjustProbabilities: async (probabilities: Array<{ prize_id: string; probability: number }>) => {
    const response = await api.put('/roulette/prizes/adjust-probabilities', { probabilities });
    return response.data;
  },

  // Reordenar premios
  reorderPrizes: async (prizes: Array<{ id: string; position: number }>) => {
    const response = await api.put('/roulette/prizes/reorder', { prizes });
    return response.data;
  },

  // Clonar premio
  clonePrize: async (id: string, position?: number) => {
    const response = await api.post(`/roulette/prizes/${id}/clone`, { position });
    return response.data;
  },

  // Actualización masiva de premios
  bulkUpdatePrizes: async (prizes: Partial<RoulettePrize>[]) => {
    const response = await api.put('/roulette/prizes/bulk-update', { prizes });
    return response.data;
  },

  // Toggle estado de múltiples premios
  toggleMultiplePrizes: async (prizeIds: string[], isActive: boolean) => {
    const response = await api.put('/roulette/prizes/toggle-status', { prizeIds, isActive });
    return response.data;
  },

  // Restablecer premios por defecto
  resetDefaultPrizes: async () => {
    const response = await api.post('/roulette/reset-defaults');
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

  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    const response = await api.get('/roulette/dashboard-stats');
    return response.data;
  },

  // === CÓDIGOS ===
  
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

  // Actualizar código
  updateCode: async (id: string, data: {
    maxUses?: number;
    expiresAt?: string;
  }) => {
    const response = await api.put(`/roulette/codes/${id}`, data);
    return response.data;
  },

  // Eliminar código
  deleteCode: async (id: string) => {
    const response = await api.delete(`/roulette/codes/${id}`);
    return response.data;
  },

  // === CONFIGURACIÓN ===
  
  // Exportar configuración
  exportConfig: async () => {
    const response = await api.get('/roulette/config/export');
    return response.data;
  },

  // Importar configuración
  importConfig: async (config: any, replaceExisting?: boolean) => {
    const response = await api.post('/roulette/config/import', { 
      config, 
      replaceExisting 
    });
    return response.data;
  },

  // Obtener vista previa
  getPreview: async () => {
    const response = await api.get('/roulette/preview');
    return response.data;
  },

  // === REPORTES ===
  
  // Generar reporte
  generateReport: async (filters: {
    startDate: string;
    endDate: string;
    type: 'summary' | 'detailed' | 'users' | 'prizes';
    format: 'json' | 'csv' | 'pdf';
  }) => {
    const response = await api.post('/roulette/reports/generate', filters);
    
    // Si el formato es CSV o PDF, manejar como blob
    if (filters.format === 'csv' || filters.format === 'pdf') {
      const blob = new Blob([response.data], { 
        type: filters.format === 'csv' ? 'text/csv' : 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roulette-report-${filters.type}-${new Date().toISOString().split('T')[0]}.${filters.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true };
    }
    
    return response.data;
  },

  // === UTILIDADES ===
  
  // Obtener resumen de actividad
  getActivitySummary: async (userId?: string) => {
    const response = await api.get('/roulette/activity-summary', {
      params: { userId }
    });
    return response.data;
  },

  // Obtener log de cambios
  getChangeLog: async (filters?: {
    page?: number;
    limit?: number;
    entity?: 'prize' | 'code' | 'validation';
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/roulette/changelog', { params: filters });
    return response.data;
  },

  // Buscar usuarios
  searchUsers: async (query: string) => {
    const response = await api.get('/roulette/search-users', {
      params: { q: query }
    });
    return response.data;
  },

  // Obtener análisis de premios
  getPrizeAnalytics: async (prizeId: string, filters?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get(`/roulette/prizes/${prizeId}/analytics`, { 
      params: filters 
    });
    return response.data;
  },

  // Simular giros
  simulateSpins: async (count: number, prizes?: RoulettePrize[]) => {
    const response = await api.post('/roulette/simulate', {
      count,
      prizes
    });
    return response.data;
  },

  // Obtener configuración del sistema
  getSystemConfig: async () => {
    const response = await api.get('/roulette/system-config');
    return response.data;
  },

  // Actualizar configuración del sistema
  updateSystemConfig: async (config: {
    maxDemoSpinsPerDay?: number;
    validationRequired?: boolean;
    autoApproveThreshold?: number;
    enableBonusSpins?: boolean;
    bonusSpinInterval?: number;
  }) => {
    const response = await api.put('/roulette/system-config', config);
    return response.data;
  },
};