import { api } from '@/lib/axios';

interface RankingFilters {
  type?: string;
  season?: string;
  period?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeHidden?: boolean;
}

interface PlayerRankingData {
  type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  points?: number;
  handsPlayed?: number;
  tournamentsPlayed?: number;
  totalRake?: number;
  wins?: number;
  losses?: number;
  season: string;
  period?: string;
  isVisible?: boolean;
  // Para jugadores externos
  externalPlayerName?: string;
  externalPlayerEmail?: string;
}

export const rankingsService = {
  // PÚBLICAS
  
  // Obtener rankings públicos
  getRankings: async (filters: RankingFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.season) params.append('season', filters.season);
    if (filters.period) params.append('period', filters.period);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/rankings?${params.toString()}`);
    return response.data;
  },

  // Obtener perfil de jugador específico
  getPlayerRanking: async (playerId: string) => {
    const response = await api.get(`/rankings/player/${playerId}`);
    return response.data;
  },

  // ADMIN
  
  // Obtener todos los rankings (incluidos ocultos)
  getAllRankings: async (filters: RankingFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.season) params.append('season', filters.season);
    if (filters.period) params.append('period', filters.period);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    // Admin puede ver rankings ocultos
    params.append('includeHidden', 'true');

    const response = await api.get(`/rankings/all?${params.toString()}`);
    return response.data;
  },

  // Crear o actualizar ranking de jugador
  updatePlayerRanking: async (playerId: string, data: PlayerRankingData) => {
    const response = await api.put(`/rankings/player/${playerId}`, data);
    return response.data;
  },

  // Importar rankings desde Excel
  importRankings: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/rankings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Cambiar visibilidad de ranking
  toggleVisibility: async (rankingId: string, isVisible: boolean) => {
    const response = await api.put(`/rankings/${rankingId}/visibility`, {
      isVisible,
    });
    return response.data;
  },

  // Eliminar ranking
  deleteRanking: async (rankingId: string) => {
    const response = await api.delete(`/rankings/${rankingId}`);
    return response.data;
  },

  // Obtener estadísticas de rankings
  getRankingStats: async (params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/rankings/stats?${queryParams}`);
    return response.data;
  },

  // Recalcular posiciones
  recalculatePositions: async (data: {
    type?: string;
    season?: string;
    period?: string;
  }) => {
    const response = await api.post('/rankings/recalculate', data);
    return response.data;
  },

  // Buscar jugadores (registrados y externos)
  searchPlayers: async (query: string) => {
    const response = await api.get(`/rankings/search/players?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Descargar plantilla Excel
  downloadTemplate: async (): Promise<Blob> => {
    const response = await api.get('/rankings/template', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obtener historial de un jugador
  getPlayerHistory: async (playerId: string, params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/rankings/player/${playerId}/history?${queryParams}`);
    return response.data;
  },

  // Obtener top jugadores por categoría
  getTopPlayers: async (params: {
    type?: string;
    season?: string;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await api.get(`/rankings/top?${queryParams}`);
    return response.data;
  },

  // Exportar rankings
  exportRankings: async (filters: RankingFilters & { format?: 'csv' | 'excel' } = {}) => {
    const params = new URLSearchParams(filters as any);
    const response = await api.get(`/rankings/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};