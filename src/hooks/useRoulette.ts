import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rouletteService } from '@/services/roulette.service';
import { toast } from 'sonner';

export const useRouletteStatus = () => {
  return useQuery({
    queryKey: ['roulette-status'],
    queryFn: rouletteService.getMyStatus,
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