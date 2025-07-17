import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rouletteService } from '@/services/roulette.service';
import { toast } from 'sonner';

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
        totalSpins: response.status.total_spins
      });
      
      return response;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useRouletteSpin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rouletteService.spin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roulette-status'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-history'] });
      
      if (data.spin.isReal) {
        toast.success(`¡Ganaste ${data.spin.prize.name}!`);
      } else {
        toast.info(`Demo: ${data.spin.prize.name}`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al girar la ruleta');
    },
  });
};

export const useValidateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => rouletteService.validateCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roulette-status'] });
      toast.success('¡Código válido! Tienes un nuevo giro disponible.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Código inválido');
    },
  });
};