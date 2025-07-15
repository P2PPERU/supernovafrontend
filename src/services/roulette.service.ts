import { api } from '@/lib/axios';
import { RouletteSpinResult, SpinStatus } from '@/types';

export const rouletteService = {
  getMyStatus: async (): Promise<{ success: boolean; status: SpinStatus }> => {
    const response = await api.get('/roulette/my-status');
    return response.data;
  },

  spin: async (): Promise<{ success: boolean; spin: RouletteSpinResult }> => {
    const response = await api.post('/roulette/spin');
    return response.data;
  },

  validateCode: async (code: string) => {
    const response = await api.post('/roulette/validate-code', { code });
    return response.data;
  },

  getMyHistory: async (page = 1, limit = 10) => {
    const response = await api.get('/roulette/my-history', {
      params: { page, limit },
    });
    return response.data;
  },
};