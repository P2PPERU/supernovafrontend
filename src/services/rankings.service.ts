// src/services/rankings.service.ts - Actualizado para grupos
import { api } from '@/lib/axios';

interface RankingGroupFilters {
  active?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

interface GroupRankingFilters {
  page?: number;
  limit?: number;
}

interface AdminGroupFilters {
  includeHidden?: boolean;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface CreateGroupData {
  name: string;
  description?: string;
  ranking_type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  start_date: string;
  end_date: string;
  is_active?: boolean;
  is_visible?: boolean;
  settings?: any;
}

interface UpdatePlayerData {
  points?: number;
  handsPlayed?: number;
  tournamentsPlayed?: number;
  totalRake?: number;
  wins?: number;
  losses?: number;
  isVisible?: boolean;
  externalPlayerName?: string;
  externalPlayerEmail?: string;
}

export const rankingsService = {
  // ===== PÚBLICAS - GRUPOS DE RANKINGS =====
  
  // Obtener grupos de rankings públicos
  getRankingGroups: async (filters: RankingGroupFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.active !== undefined) params.append('active', filters.active.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/ranking-groups?${params.toString()}`);
    return response.data;
  },

  // Obtener grupo específico con sus rankings
  getRankingGroup: async (groupId: string, filters: GroupRankingFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/ranking-groups/${groupId}?${params.toString()}`);
    return response.data;
  },

  // Obtener rankings de un grupo específico
  getGroupRankings: async (groupId: string, filters: GroupRankingFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/ranking-groups/${groupId}/rankings?${params.toString()}`);
    return response.data;
  },

  // Buscar jugador en grupo específico
  getPlayerInGroup: async (groupId: string, playerId: string) => {
    const response = await api.get(`/ranking-groups/${groupId}/rankings/player/${playerId}`);
    return response.data;
  },

  // ===== ADMIN - GESTIÓN DE GRUPOS =====
  
  // Obtener todos los grupos (admin)
  getAllGroups: async (filters: AdminGroupFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.includeHidden !== undefined) params.append('includeHidden', filters.includeHidden.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/ranking-groups/admin/all?${params.toString()}`);
    return response.data;
  },

  // Crear grupo de ranking
  createGroup: async (data: CreateGroupData) => {
    const response = await api.post('/ranking-groups', data);
    return response.data;
  },

  // Actualizar grupo
  updateGroup: async (groupId: string, data: Partial<CreateGroupData>) => {
    const response = await api.put(`/ranking-groups/${groupId}`, data);
    return response.data;
  },

  // Eliminar grupo
  deleteGroup: async (groupId: string) => {
    const response = await api.delete(`/ranking-groups/${groupId}`);
    return response.data;
  },

  // Forzar eliminación (con rankings)
  forceDeleteGroup: async (groupId: string) => {
    const response = await api.delete(`/ranking-groups/${groupId}/force-delete`);
    return response.data;
  },

  // Duplicar grupo
  duplicateGroup: async (groupId: string, data: {
    name?: string;
    start_date: string;
    end_date: string;
    copy_rankings?: boolean;
  }) => {
    const response = await api.post(`/ranking-groups/${groupId}/duplicate`, data);
    return response.data;
  },

  // ===== ADMIN - GESTIÓN DE RANKINGS DENTRO DE GRUPOS =====

  // Obtener todos los rankings de un grupo (admin)
  getAllGroupRankings: async (groupId: string, filters: GroupRankingFilters & { includeHidden?: boolean } = {}) => {
    const params = new URLSearchParams();
    
    if (filters.includeHidden !== undefined) params.append('includeHidden', filters.includeHidden.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/ranking-groups/${groupId}/rankings/all?${params.toString()}`);
    return response.data;
  },

  // Crear/actualizar ranking de jugador en grupo
  updatePlayerInGroup: async (groupId: string, playerId: string, data: UpdatePlayerData) => {
    const response = await api.put(`/ranking-groups/${groupId}/rankings/player/${playerId}`, data);
    return response.data;
  },

  // Importar rankings a un grupo desde Excel
  importToGroup: async (groupId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/ranking-groups/${groupId}/rankings/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Cambiar visibilidad de ranking en grupo
  toggleRankingVisibility: async (groupId: string, rankingId: string, isVisible: boolean) => {
    const response = await api.put(`/ranking-groups/${groupId}/rankings/${rankingId}/visibility`, {
      isVisible,
    });
    return response.data;
  },

  // Eliminar ranking de grupo
  deleteRankingFromGroup: async (groupId: string, rankingId: string) => {
    const response = await api.delete(`/ranking-groups/${groupId}/rankings/${rankingId}`);
    return response.data;
  },

  // Recalcular posiciones de grupo
  recalculateGroupPositions: async (groupId: string) => {
    const response = await api.post(`/ranking-groups/${groupId}/recalculate`);
    return response.data;
  },

  // Obtener estadísticas de grupo
  getGroupStats: async (groupId: string) => {
    const response = await api.get(`/ranking-groups/${groupId}/stats`);
    return response.data;
  },

  // ===== BÚSQUEDA Y UTILIDADES =====

  // Buscar jugadores (admin)
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

  // ===== LEGACY (COMPATIBILIDAD) =====

  // Obtener rankings legacy (redirige a grupos)
  getRankings: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/rankings?${params.toString()}`);
    return response.data;
  },

  // Buscar jugador en todos los grupos
  getPlayerRanking: async (playerId: string) => {
    const response = await api.get(`/rankings/player/${playerId}`);
    return response.data;
  },

  // Crear/actualizar ranking legacy
  updatePlayerRanking: async (playerId: string, data: any) => {
    const response = await api.put(`/rankings/player/${playerId}`, data);
    return response.data;
  },

  // Importar rankings legacy
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

  // Cambiar visibilidad legacy
  toggleVisibility: async (rankingId: string, isVisible: boolean) => {
    const response = await api.put(`/rankings/${rankingId}/visibility`, {
      isVisible,
    });
    return response.data;
  },

  // Eliminar ranking legacy
  deleteRanking: async (rankingId: string) => {
    const response = await api.delete(`/rankings/${rankingId}`);
    return response.data;
  },

  // Recalcular posiciones legacy
  recalculatePositions: async (data: {
    type?: string;
    season?: string;
    period?: string;
  }) => {
    const response = await api.post('/rankings/recalculate', data);
    return response.data;
  },

  // Obtener estadísticas legacy
  getRankingStats: async (params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/rankings/stats?${queryParams}`);
    return response.data;
  },
};