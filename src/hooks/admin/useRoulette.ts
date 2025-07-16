import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminRouletteService, RoulettePrize, CreatePrizeData, UpdatePrizeData, ValidationData } from '@/services/admin/roulette.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// === HOOKS PARA PREMIOS ===

// Obtener lista de premios
export const useAdminPrizes = (filters?: { isActive?: boolean }) => {
  return useQuery({
    queryKey: ['admin-roulette-prizes', filters],
    queryFn: () => adminRouletteService.getPrizes(filters),
  });
};

// Obtener premio por ID
export const useAdminPrize = (id: string) => {
  return useQuery({
    queryKey: ['admin-roulette-prize', id],
    queryFn: () => adminRouletteService.getPrizeById(id),
    enabled: !!id,
  });
};

// Crear premio
export const useCreatePrize = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreatePrizeData) => adminRouletteService.createPrize(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      toast.success('Premio creado exitosamente');
      router.push('/admin/roulette/prizes');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear premio');
    },
  });
};

// Actualizar premio
export const useUpdatePrize = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePrizeData }) => 
      adminRouletteService.updatePrize(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prize', variables.id] });
      toast.success('Premio actualizado exitosamente');
      router.push('/admin/roulette/prizes');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar premio');
    },
  });
};

// Eliminar premio
export const useDeletePrize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminRouletteService.deletePrize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      toast.success('Premio eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar premio');
    },
  });
};

// Toggle estado activo de premio
export const useTogglePrizeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      adminRouletteService.updatePrize(id, { isActive }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      toast.success(variables.isActive ? 'Premio activado' : 'Premio desactivado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    },
  });
};

// Ajustar probabilidades
export const useAdjustProbabilities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prizes: Array<{ id: string; probability: number }>) => 
      adminRouletteService.adjustProbabilities(prizes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      toast.success('Probabilidades ajustadas exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al ajustar probabilidades');
    },
  });
};

// === HOOKS PARA VALIDACIONES ===

// Obtener validaciones pendientes
export const useAdminPendingValidations = (filters?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['admin-pending-validations', filters],
    queryFn: () => adminRouletteService.getPendingValidations(filters),
  });
};

// Validar usuario
export const useValidateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ValidationData }) => 
      adminRouletteService.validateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-validations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-stats'] });
      toast.success(
        variables.data.action === 'approve' 
          ? 'Usuario validado exitosamente' 
          : 'Validación rechazada'
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al validar usuario');
    },
  });
};

// Validar en lote
export const useValidateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, action, notes }: { 
      userIds: string[]; 
      action: 'approve' | 'reject'; 
      notes?: string 
    }) => adminRouletteService.validateBatch(userIds, action, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-validations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-stats'] });
      const message = variables.action === 'approve' 
        ? `${variables.userIds.length} usuarios validados exitosamente`
        : `${variables.userIds.length} validaciones rechazadas`;
      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al validar usuarios');
    },
  });
};

// Obtener historial de validaciones
export const useValidationHistory = (filters?: any) => {
  return useQuery({
    queryKey: ['admin-validation-history', filters],
    queryFn: () => adminRouletteService.getValidationHistory(filters),
  });
};

// === HOOKS PARA ESTADÍSTICAS ===

// Obtener estadísticas
export const useAdminRouletteStats = (filters?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}) => {
  return useQuery({
    queryKey: ['admin-roulette-stats', filters],
    queryFn: () => adminRouletteService.getStats(filters),
  });
};

// === HOOKS PARA CÓDIGOS ===

// Obtener códigos
export const useAdminRouletteCodes = (filters?: any) => {
  return useQuery({
    queryKey: ['admin-roulette-codes', filters],
    queryFn: () => adminRouletteService.getCodes(filters),
  });
};

// Crear código
export const useCreateRouletteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => adminRouletteService.createCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-codes'] });
      toast.success('Código creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear código');
    },
  });
};