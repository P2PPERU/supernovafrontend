// src/hooks/admin/useDashboard.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { dashboardService } from '@/services/admin/dashboard.service';
import { rouletteService } from '@/services/admin/roulette.service';
import { toast } from 'sonner';

// Hook para estadísticas del dashboard
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
    refetchInterval: 30000, // Refrescar cada 30 segundos
    staleTime: 20000, // Considerar datos frescos por 20 segundos
  });
};

// Hook para datos de ingresos
export const useRevenueData = (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: () => dashboardService.getRevenueData(period),
    staleTime: 60000, // Considerar datos frescos por 1 minuto
  });
};

// Hook para actividad reciente
export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: () => dashboardService.getRecentActivity(limit),
    refetchInterval: 10000, // Refrescar cada 10 segundos
  });
};

// Hook para métricas de performance
export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'performance'],
    queryFn: dashboardService.getPerformanceMetrics,
    staleTime: 300000, // Considerar datos frescos por 5 minutos
  });
};

// Hooks específicos para ruleta
export const useRouletteStats = () => {
  return useQuery({
    queryKey: ['roulette', 'stats'],
    queryFn: rouletteService.getStats,
    refetchInterval: 15000, // Refrescar cada 15 segundos
  });
};

// Hook para validaciones pendientes
export const usePendingValidations = () => {
  return useQuery({
    queryKey: ['roulette', 'validations', 'pending'],
    queryFn: rouletteService.getPendingValidations,
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

// Hook para análisis de conversión
export const useConversionAnalysis = (period: 'day' | 'week' | 'month' = 'week') => {
  return useQuery({
    queryKey: ['roulette', 'analytics', 'conversion', period],
    queryFn: () => rouletteService.getConversionAnalysis(period),
    staleTime: 60000,
  });
};

// Hook para validar usuario
export const useValidateUser = () => {
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      rouletteService.validateUser(userId, notes),
    onSuccess: () => {
      toast.success('Usuario validado exitosamente');
    },
    onError: () => {
      toast.error('Error al validar usuario');
    },
  });
};

// Hook para validación en lote
export const useValidateBatch = () => {
  return useMutation({
    mutationFn: (userIds: string[]) => rouletteService.validateBatch(userIds),
    onSuccess: (data) => {
      toast.success(`${data.validated} usuarios validados exitosamente`);
    },
    onError: () => {
      toast.error('Error al validar usuarios');
    },
  });
};

// Hook para obtener historial de giros
export const useSpinHistory = (params?: {
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['roulette', 'history', params],
    queryFn: () => rouletteService.getSpinHistory(params),
    enabled: !!params,
  });
};