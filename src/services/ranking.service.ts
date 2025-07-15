import { api } from '@/lib/axios';
import { Ranking, PaginatedResponse } from '@/types';

interface RankingFilters {
  type?: 'points' | 'hands_played' | 'tournaments' | 'rake';
  season?: string;
  period?: 'all_time' | 'monthly' | 'weekly' | 'daily';
  page?: number;
  limit?: number;
}

export const rankingService = {
  getRankings: async (filters: RankingFilters = {}): Promise<PaginatedResponse<Ranking>> => {
    const response = await api.get('/rankings', { params: filters });
    return response.data;
  },

  getPlayerRanking: async (playerId: string, type = 'all') => {
    const response = await api.get(`/rankings/player/${playerId}`, {
      params: { type },
    });
    return response.data;
  },
};