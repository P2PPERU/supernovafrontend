// hooks/useRoulette.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rouletteService } from '@/services/roulette.service';
import { toast } from 'sonner';

// Hook para obtener la configuración de la ruleta (premios activos)
export const useRouletteConfig = () => {
  return useQuery({
    queryKey: ['roulette-config'],
    queryFn: async () => {
      console.log('🎰 Fetching roulette config...');
      const response = await rouletteService.getConfig();
      console.log('✅ Roulette config response:', response);
      return response;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false, // No refrescar la configuración constantemente
    staleTime: 5 * 60 * 1000, // Considerar los datos frescos por 5 minutos
  });
};

// Hook para obtener el estado del usuario
export const useRouletteStatus = () => {
  return useQuery({
    queryKey: ['roulette-status'],
    queryFn: async () => {
      console.log('🎰 Fetching roulette status...');
      const response = await rouletteService.getMyStatus();
      console.log('✅ Roulette status response:', response);
      
      // Validar estructura de respuesta
      if (!response.status) {
        console.error('❌ Invalid roulette status structure:', response);
        throw new Error('Invalid status response');
      }
      
      // Log detallado del estado
      console.log('📊 Status details:', {
        hasDemoAvailable: response.status.has_demo_available,
        hasRealAvailable: response.status.has_real_available,
        demoSpinDone: response.status.demo_spin_done,
        realSpinDone: response.status.real_spin_done,
        isValidated: response.status.is_validated,
        availableBonusSpins: response.status.available_bonus_spins,
        availableDemoSpins: response.status.available_demo_spins || 0,
        totalSpins: response.status.total_spins
      });
      
      return response;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Hook para ejecutar el giro de la ruleta
export const useRouletteSpin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('🎯 Executing spin...');
      const response = await rouletteService.spin();
      console.log('✅ Spin result:', response);
      return response;
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['roulette-status'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-history'] });
      
      // Mostrar notificación según el tipo de giro
      const spin = data.spin;
      if (spin.is_real_prize) {
        toast.success(
          `¡PREMIO REAL! ${spin.prize?.name || 'Premio'}`,
          {
            description: spin.prize?.prize_value ? `Has ganado S/ ${spin.prize.prize_value}` : undefined,
            duration: 5000,
          }
        );
      } else {
        toast.info(
          `Premio Demo: ${spin.prize?.name || 'Premio'}`,
          {
            description: 'Este es un premio de demostración. ¡Valídate para ganar premios reales!',
            duration: 4000,
          }
        );
      }
      
      return data;
    },
    onError: (error: any) => {
      console.error('❌ Spin error:', error);
      
      // Manejar diferentes tipos de errores
      const errorMessage = error.response?.data?.message || error.message || 'Error al girar la ruleta';
      
      if (error.response?.status === 403) {
        toast.error('No tienes giros disponibles', {
          description: 'Valida un código o espera a tu próximo giro gratuito',
        });
      } else if (error.response?.status === 429) {
        toast.error('Demasiados intentos', {
          description: 'Por favor espera un momento antes de intentar nuevamente',
        });
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    },
  });
};

// Hook para validar un código promocional
export const useValidateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      console.log('🎟️ Validating code:', code);
      const response = await rouletteService.validateCode(code);
      console.log('✅ Code validation response:', response);
      return response;
    },
    onSuccess: (data) => {
      // Invalidar el estado para reflejar los nuevos giros disponibles
      queryClient.invalidateQueries({ queryKey: ['roulette-status'] });
      
      toast.success('¡Código válido!', {
        description: data.message || 'Tienes un nuevo giro disponible',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      console.error('❌ Code validation error:', error);
      
      const errorMessage = error.response?.data?.message || 'Código inválido o expirado';
      
      if (error.response?.status === 404) {
        toast.error('Código no encontrado', {
          description: 'El código ingresado no existe',
        });
      } else if (error.response?.status === 410) {
        toast.error('Código expirado', {
          description: 'Este código ya no está vigente',
        });
      } else if (error.response?.status === 409) {
        toast.error('Código ya usado', {
          description: 'Ya has utilizado este código anteriormente',
        });
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    },
  });
};

// Hook para obtener el historial de giros
export const useRouletteHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['roulette-history', page, limit],
    queryFn: async () => {
      console.log(`📜 Fetching spin history (page: ${page}, limit: ${limit})...`);
      const response = await rouletteService.getMyHistory(page, limit);
      console.log('✅ History response:', response);
      return response;
    },
    placeholderData: (previousData) => previousData, // Mantener datos anteriores mientras se cargan nuevos (v5)
  });
};

// Hook para obtener la vista previa de la ruleta (para testing)
export const useRoulettePreview = () => {
  return useQuery({
    queryKey: ['roulette-preview'],
    queryFn: async () => {
      console.log('👁️ Fetching roulette preview...');
      const response = await rouletteService.getPreview();
      console.log('✅ Preview response:', response);
      return response;
    },
    enabled: false, // Solo cargar cuando se solicite explícitamente
  });
};

// Hook para obtener la lista de premios
export const useRoulettePrizes = () => {
  return useQuery({
    queryKey: ['roulette-prizes'],
    queryFn: async () => {
      console.log('🎰 Fetching roulette prizes...');
      
      // Si tienes un endpoint específico para premios, úsalo:
      // const response = await rouletteService.getPrizes();
      
      // Si no, usa getConfig y extrae los premios:
      const response = await rouletteService.getConfig();
      console.log('✅ Prizes from config:', response.config?.prizes);
      
      // Retornar en el formato esperado
      return {
        success: true,
        prizes: response.config?.prizes || []
      };
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};