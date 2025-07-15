import { api } from '@/lib/axios';
import { Bonus } from '@/types';

export const bonusService = {
  getMyBonuses: async (): Promise<{ success: boolean; bonuses: Bonus[] }> => {
    const response = await api.get('/bonus/my-bonuses');
    return response.data;
  },

  claimBonus: async (bonusId: string) => {
    const response = await api.post(`/bonus/claim/${bonusId}`);
    return response.data;
  },
};