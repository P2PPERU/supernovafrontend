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
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Premio creado exitosamente');
      router.push('/admin/roulette/prizes');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear premio';
      toast.error(errorMessage);
      console.error('Error creating prize:', error);
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
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Premio actualizado exitosamente');
      router.push('/admin/roulette/prizes');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar premio';
      toast.error(errorMessage);
      console.error('Error updating prize:', error);
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
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Premio eliminado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar premio';
      toast.error(errorMessage);
      console.error('Error deleting prize:', error);
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
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success(variables.isActive ? 'Premio activado' : 'Premio desactivado');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al cambiar estado';
      toast.error(errorMessage);
      console.error('Error toggling prize status:', error);
    },
  });
};

// Ajustar probabilidades
export const useAdjustProbabilities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (probabilities: Array<{ prize_id: string; probability: number }>) => 
      adminRouletteService.adjustProbabilities(probabilities),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Probabilidades ajustadas exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al ajustar probabilidades';
      toast.error(errorMessage);
      console.error('Error adjusting probabilities:', error);
    },
  });
};

// Reordenar premios
export const useReorderPrizes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prizes: Array<{ id: string; position: number }>) => 
      adminRouletteService.reorderPrizes(prizes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Orden de premios actualizado');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al reordenar premios';
      toast.error(errorMessage);
      console.error('Error reordering prizes:', error);
    },
  });
};

// Clonar premio
export const useClonePrize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, position }: { id: string; position?: number }) => 
      adminRouletteService.clonePrize(id, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Premio clonado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al clonar premio';
      toast.error(errorMessage);
      console.error('Error cloning prize:', error);
    },
  });
};

// Actualización masiva de premios
export const useBulkUpdatePrizes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prizes: Partial<RoulettePrize>[]) => 
      adminRouletteService.bulkUpdatePrizes(prizes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Premios actualizados masivamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error en actualización masiva';
      toast.error(errorMessage);
      console.error('Error bulk updating prizes:', error);
    },
  });
};

// Toggle estado de múltiples premios
export const useToggleMultiplePrizes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prizeIds, isActive }: { prizeIds: string[]; isActive: boolean }) => 
      adminRouletteService.toggleMultiplePrizes(prizeIds, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      const message = variables.isActive 
        ? `${variables.prizeIds.length} premios activados`
        : `${variables.prizeIds.length} premios desactivados`;
      toast.success(message);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al cambiar estados';
      toast.error(errorMessage);
      console.error('Error toggling multiple prizes:', error);
    },
  });
};

// Restablecer premios por defecto
export const useResetDefaultPrizes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminRouletteService.resetDefaultPrizes(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Premios restablecidos a valores por defecto');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al restablecer premios';
      toast.error(errorMessage);
      console.error('Error resetting default prizes:', error);
    },
  });
};

// === HOOKS PARA VALIDACIONES ===

// Obtener validaciones pendientes
export const useAdminPendingValidations = (filters?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['admin-pending-validations', filters],
    queryFn: () => adminRouletteService.getPendingValidations(filters),
    refetchInterval: 30000, // Refrescar cada 30 segundos
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
      queryClient.invalidateQueries({ queryKey: ['admin-validation-history'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-stats'] });
      
      const message = variables.data.action === 'approve' 
        ? 'Usuario validado exitosamente' 
        : 'Validación rechazada';
      toast.success(message);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al validar usuario';
      toast.error(errorMessage);
      console.error('Error validating user:', error);
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
      queryClient.invalidateQueries({ queryKey: ['admin-validation-history'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-stats'] });
      
      const message = variables.action === 'approve' 
        ? `${variables.userIds.length} usuarios validados exitosamente`
        : `${variables.userIds.length} validaciones rechazadas`;
      toast.success(message);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al validar usuarios';
      toast.error(errorMessage);
      console.error('Error batch validating users:', error);
    },
  });
};

// Obtener historial de validaciones
export const useValidationHistory = (filters?: {
  page?: number;
  limit?: number;
  action?: 'approve' | 'reject';
  startDate?: string;
  endDate?: string;
}) => {
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
    refetchInterval: 60000, // Refrescar cada minuto
  });
};

// Obtener estadísticas del dashboard
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminRouletteService.getDashboardStats(),
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

// === HOOKS PARA CÓDIGOS ===

// Obtener códigos
export const useAdminRouletteCodes = (filters?: {
  page?: number;
  limit?: number;
  status?: 'active' | 'used' | 'expired';
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin-roulette-codes', filters],
    queryFn: () => adminRouletteService.getCodes(filters),
  });
};

// Crear código
export const useCreateRouletteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { code: string; maxUses?: number; expiresAt?: string }) => 
      adminRouletteService.createCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-codes'] });
      toast.success('Código creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear código';
      
      if (error.response?.status === 409) {
        toast.error('El código ya existe');
      } else {
        toast.error(errorMessage);
      }
      console.error('Error creating code:', error);
    },
  });
};

// Eliminar código
export const useDeleteRouletteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminRouletteService.deleteCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-codes'] });
      toast.success('Código eliminado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar código';
      toast.error(errorMessage);
      console.error('Error deleting code:', error);
    },
  });
};

// Actualizar código
export const useUpdateRouletteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { maxUses?: number; expiresAt?: string } }) => 
      adminRouletteService.updateCode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-codes'] });
      toast.success('Código actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar código';
      toast.error(errorMessage);
      console.error('Error updating code:', error);
    },
  });
};

// === HOOKS PARA CONFIGURACIÓN ===

// Exportar configuración
export const useExportConfig = () => {
  return useMutation({
    mutationFn: () => adminRouletteService.exportConfig(),
    onSuccess: (data) => {
      // Crear un blob y descargar el archivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roulette-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Configuración exportada exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al exportar configuración';
      toast.error(errorMessage);
      console.error('Error exporting config:', error);
    },
  });
};

// Importar configuración
export const useImportConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ config, replaceExisting }: { config: any; replaceExisting?: boolean }) => 
      adminRouletteService.importConfig(config, replaceExisting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roulette-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-config'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-prizes'] });
      toast.success('Configuración importada exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al importar configuración';
      toast.error(errorMessage);
      console.error('Error importing config:', error);
    },
  });
};

// Vista previa de la ruleta
export const useAdminRoulettePreview = () => {
  return useQuery({
    queryKey: ['admin-roulette-preview'],
    queryFn: () => adminRouletteService.getPreview(),
  });
};

// === HOOKS PARA REPORTES ===

// Generar reporte
export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (filters: {
      startDate: string;
      endDate: string;
      type: 'summary' | 'detailed' | 'users' | 'prizes';
      format: 'json' | 'csv' | 'pdf';
    }) => adminRouletteService.generateReport(filters),
    onSuccess: (data, variables) => {
      if (variables.format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roulette-report-${variables.type}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      toast.success('Reporte generado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al generar reporte';
      toast.error(errorMessage);
      console.error('Error generating report:', error);
    },
  });
};