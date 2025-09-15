// src/hooks/useRankings.ts - Actualizado para grupos
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rankingsService } from '@/services/rankings.service';
import { toast } from 'sonner';

// ===== HOOKS PÚBLICOS - GRUPOS DE RANKINGS =====

// Hook para obtener grupos de rankings públicos
export const useRankingGroups = (filters = {}) => {
  return useQuery({
    queryKey: ['ranking-groups', filters],
    queryFn: () => rankingsService.getRankingGroups(filters),
    staleTime: 30000, // 30 segundos
  });
};

// Hook para obtener un grupo específico con sus rankings
export const useRankingGroup = (groupId: string, filters = {}) => {
  return useQuery({
    queryKey: ['ranking-groups', groupId, filters],
    queryFn: () => rankingsService.getRankingGroup(groupId, filters),
    enabled: !!groupId,
    staleTime: 30000,
  });
};

// Hook para obtener rankings de un grupo específico
export const useGroupRankings = (groupId: string, filters = {}) => {
  return useQuery({
    queryKey: ['ranking-groups', groupId, 'rankings', filters],
    queryFn: () => rankingsService.getGroupRankings(groupId, filters),
    enabled: !!groupId,
    staleTime: 30000,
  });
};

// Hook para buscar jugador en grupo específico
export const usePlayerInGroup = (groupId: string, playerId: string) => {
  return useQuery({
    queryKey: ['ranking-groups', groupId, 'player', playerId],
    queryFn: () => rankingsService.getPlayerInGroup(groupId, playerId),
    enabled: !!groupId && !!playerId,
    staleTime: 60000,
  });
};

// ===== HOOKS ADMIN - GESTIÓN DE GRUPOS =====

// Hook para obtener todos los grupos (admin)
export const useAdminGroups = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-ranking-groups', filters],
    queryFn: () => rankingsService.getAllGroups(filters),
  });
};

// Hook para crear grupo de ranking
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => rankingsService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups'] });
      toast.success('Grupo de ranking creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear grupo');
    },
  });
};

// Hook para actualizar grupo
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: any }) =>
      rankingsService.updateGroup(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups', variables.groupId] });
      toast.success('Grupo actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar grupo');
    },
  });
};

// Hook para eliminar grupo
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => rankingsService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups'] });
      toast.success('Grupo eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar grupo');
    },
  });
};

// Hook para forzar eliminación
export const useForceDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => rankingsService.forceDeleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups'] });
      toast.success('Grupo y rankings eliminados exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar grupo');
    },
  });
};

// Hook para duplicar grupo
export const useDuplicateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: any }) =>
      rankingsService.duplicateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups'] });
      toast.success('Grupo duplicado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al duplicar grupo');
    },
  });
};

// ===== HOOKS ADMIN - GESTIÓN DE RANKINGS DENTRO DE GRUPOS =====

// Hook para obtener todos los rankings de un grupo (admin)
export const useAdminGroupRankings = (groupId: string, filters = {}) => {
  return useQuery({
    queryKey: ['admin-ranking-groups', groupId, 'rankings', filters],
    queryFn: () => rankingsService.getAllGroupRankings(groupId, filters),
    enabled: !!groupId,
  });
};

// Hook para crear/actualizar ranking de jugador en grupo
export const useUpdatePlayerInGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, playerId, data }: { groupId: string; playerId: string; data: any }) =>
      rankingsService.updatePlayerInGroup(groupId, playerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups'] });
      toast.success('Ranking actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar ranking');
    },
  });
};

// Hook para importar rankings a un grupo
export const useImportToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, file }: { groupId: string; file: File }) =>
      rankingsService.importToGroup(groupId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups'] });
      
      const { created, updated, errors } = data.summary;
      
      if (errors > 0) {
        toast.warning(`Importación completada con errores: ${created} creados, ${updated} actualizados, ${errors} errores`);
      } else {
        toast.success(`Importación exitosa: ${created} creados, ${updated} actualizados`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al importar rankings');
    },
  });
};

// Hook para cambiar visibilidad de ranking en grupo
export const useToggleRankingInGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, rankingId, isVisible }: { groupId: string; rankingId: string; isVisible: boolean }) =>
      rankingsService.toggleRankingVisibility(groupId, rankingId, isVisible),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups', variables.groupId] });
      
      toast.success(
        variables.isVisible 
          ? 'Ranking visible al público' 
          : 'Ranking oculto del público'
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar visibilidad');
    },
  });
};

// Hook para eliminar ranking de grupo
export const useDeleteRankingFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, rankingId }: { groupId: string; rankingId: string }) =>
      rankingsService.deleteRankingFromGroup(groupId, rankingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups', variables.groupId] });
      toast.success('Ranking eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar ranking');
    },
  });
};

// Hook para recalcular posiciones de grupo
export const useRecalculateGroupPositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => rankingsService.recalculateGroupPositions(groupId),
    onSuccess: (data, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranking-groups', groupId] });
      queryClient.invalidateQueries({ queryKey: ['ranking-groups', groupId] });
      toast.success(`${data.totalUpdated} posiciones recalculadas exitosamente`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al recalcular posiciones');
    },
  });
};

// Hook para obtener estadísticas de grupo
export const useGroupStats = (groupId: string) => {
  return useQuery({
    queryKey: ['ranking-groups', groupId, 'stats'],
    queryFn: () => rankingsService.getGroupStats(groupId),
    enabled: !!groupId,
    staleTime: 300000, // 5 minutos
  });
};

// ===== HOOKS LEGACY (COMPATIBILIDAD) =====

// Hook para obtener rankings legacy (redirige a grupos)
export const useRankings = (filters = {}) => {
  return useQuery({
    queryKey: ['rankings', filters],
    queryFn: () => rankingsService.getRankings(filters),
    staleTime: 30000,
  });
};

// Hook para obtener perfil de jugador legacy
export const usePlayerRanking = (playerId: string) => {
  return useQuery({
    queryKey: ['rankings', 'player', playerId],
    queryFn: () => rankingsService.getPlayerRanking(playerId),
    enabled: !!playerId,
    staleTime: 60000,
  });
};

// Hook para crear/actualizar ranking legacy
export const useUpdatePlayerRanking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playerId, data }: { playerId: string; data: any }) =>
      rankingsService.updatePlayerRanking(playerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-rankings'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      queryClient.invalidateQueries({ queryKey: ['rankings', 'player', variables.playerId] });
      toast.success('Ranking actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar ranking');
    },
  });
};

// Hook para importar rankings legacy
export const useImportRankings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => rankingsService.importRankings(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-rankings'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      
      const { created, updated, errors } = data.summary;
      
      if (errors > 0) {
        toast.warning(`Importación completada con errores: ${created} creados, ${updated} actualizados, ${errors} errores`);
      } else {
        toast.success(`Importación exitosa: ${created} creados, ${updated} actualizados`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al importar rankings');
    },
  });
};

// Hook para cambiar visibilidad legacy
export const useToggleRankingVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rankingId, isVisible }: { rankingId: string; isVisible: boolean }) =>
      rankingsService.toggleVisibility(rankingId, isVisible),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-rankings'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      
      toast.success(
        variables.isVisible 
          ? 'Ranking visible al público' 
          : 'Ranking oculto del público'
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar visibilidad');
    },
  });
};

// Hook para eliminar ranking legacy
export const useDeleteRanking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rankingId: string) => rankingsService.deleteRanking(rankingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rankings'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      toast.success('Ranking eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar ranking');
    },
  });
};

// Hook para recalcular posiciones legacy
export const useRecalculatePositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { type?: string; season?: string; period?: string }) =>
      rankingsService.recalculatePositions(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-rankings'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      toast.success(`${data.totalUpdated} posiciones recalculadas exitosamente`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al recalcular posiciones');
    },
  });
};

// Hook para obtener estadísticas legacy
export const useRankingStats = (params = {}) => {
  return useQuery({
    queryKey: ['rankings', 'stats', params],
    queryFn: () => rankingsService.getRankingStats(params),
    staleTime: 300000, // 5 minutos
  });
};

// ===== HOOKS DE UTILIDADES =====

// Hook para buscar jugadores
export const useSearchPlayers = (query: string) => {
  return useQuery({
    queryKey: ['rankings', 'search-players', query],
    queryFn: () => rankingsService.searchPlayers(query),
    enabled: query.length >= 2,
    staleTime: 60000,
  });
};

// Hook para descargar plantilla Excel
export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: () => rankingsService.downloadTemplate(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plantilla-rankings.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Plantilla descargada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al descargar plantilla');
    },
  });
};

// Hook para filtros de rankings
export const useRankingFilters = () => {
  const seasons = ['2025-01', '2024-12', '2024-11', '2024-10'];
  const periods = [
    { value: 'all_time', label: 'Todo el tiempo' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'daily', label: 'Diario' }
  ];
  const types = [
    { value: 'points', label: 'Puntos' },
    { value: 'hands_played', label: 'Manos Jugadas' },
    { value: 'tournaments', label: 'Torneos' },
    { value: 'rake', label: 'Rake' }
  ];

  return {
    seasons,
    periods,
    types
  };
};