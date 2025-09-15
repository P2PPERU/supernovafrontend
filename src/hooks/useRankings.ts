import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rankingsService } from '@/services/rankings.service';
import { toast } from 'sonner';

// Hook para obtener rankings públicos
export const useRankings = (filters = {}) => {
  return useQuery({
    queryKey: ['rankings', filters],
    queryFn: () => rankingsService.getRankings(filters),
    staleTime: 30000, // 30 segundos
  });
};

// Hook para obtener perfil de jugador
export const usePlayerRanking = (playerId: string) => {
  return useQuery({
    queryKey: ['rankings', 'player', playerId],
    queryFn: () => rankingsService.getPlayerRanking(playerId),
    enabled: !!playerId,
    staleTime: 60000, // 1 minuto
  });
};

// Hook para obtener estadísticas de rankings
export const useRankingStats = (params = {}) => {
  return useQuery({
    queryKey: ['rankings', 'stats', params],
    queryFn: () => rankingsService.getRankingStats(params),
    staleTime: 300000, // 5 minutos
  });
};

// ADMIN HOOKS

// Hook para obtener todos los rankings (admin)
export const useAdminRankings = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-rankings', filters],
    queryFn: () => rankingsService.getAllRankings(filters),
  });
};

// Hook para crear/actualizar ranking de jugador
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

// Hook para importar rankings desde Excel
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

// Hook para cambiar visibilidad de ranking
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

// Hook para eliminar ranking
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

// Hook para recalcular posiciones
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

// Hook personalizado para filtros de rankings
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