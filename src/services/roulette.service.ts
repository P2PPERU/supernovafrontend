// services/roulette.service.ts
import { api } from '@/lib/axios';

// Tipos para las respuestas
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
  icon?: string;
  isActive: boolean;
  min_value?: number;
  max_value?: number;
}

export interface RouletteConfig {
  prizes: RoulettePrize[];
  stats: {
    totalPrizes: number;
    activePrizes: number;
    totalProbability: number;
    isValidConfiguration: boolean;
    totalSpinsToday: number;
    totalValueToday: number;
    highestPrizeToday: number;
    spins_today?: number;
    winners_today?: number;
    total_awarded_today?: number;
    biggest_prize_today?: number;

  };
}

export interface SpinStatus {
  has_demo_available: boolean;
  has_real_available: boolean;
  demo_spin_done: boolean;
  real_spin_done: boolean;
  is_validated: boolean;
  available_bonus_spins: number;
  available_demo_spins: number;
  total_spins: number;
  demo_prize?: {
    id: string;
    name: string;
    prize_value: number;
  };
}

export interface SpinResult {
  id: string;
  spin_type: 'demo' | 'welcome_real' | 'bonus' | 'code';
  is_real_prize: boolean;
  prize: RoulettePrize;
  prize_status: 'applied' | 'pending_validation' | 'demo';
  spin_date: string;
  message?: string;
}

export interface SpinHistory {
  spins: Array<{
    id: string;
    spin_type: string;
    is_real_prize: boolean;
    spin_date: string;
    prize_status: string;
    prize?: RoulettePrize;
  }>;
  total: number;
  totalPages: number;
  currentPage: number;
}

export const rouletteService = {
  // Obtener configuración de la ruleta (premios activos)
  getConfig: async (): Promise<{ success: boolean; config: RouletteConfig }> => {
    const response = await api.get('/roulette/config');
    return response.data;
  },

  // Obtener estado del usuario (giros disponibles, etc)
  getMyStatus: async (): Promise<{ success: boolean; status: SpinStatus }> => {
    const response = await api.get('/roulette/my-status');
    return response.data;
  },

  // Ejecutar un giro
  spin: async (): Promise<{ success: boolean; spin: SpinResult }> => {
    const response = await api.post('/roulette/spin');
    return response.data;
  },

  // Validar un código promocional
  validateCode: async (code: string): Promise<{ success: boolean; message: string; spinsAdded?: number }> => {
    const response = await api.post('/roulette/validate-code', { code });
    return response.data;
  },

  // Obtener historial de giros
  getMyHistory: async (page = 1, limit = 10): Promise<SpinHistory> => {
    const response = await api.get('/roulette/my-history', {
      params: { page, limit },
    });
    return response.data;
  },

  // Obtener vista previa de la ruleta (para testing)
  getPreview: async (): Promise<{ success: boolean; preview: any }> => {
    const response = await api.get('/roulette/preview');
    return response.data;
  },
};