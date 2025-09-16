import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { LoginRequest, RegisterRequest } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (data) => {
      console.log('✅ Login successful:', data);
      
      if (!data.token || !data.user || !data.refreshToken) {
        console.error('❌ Invalid login response structure');
        toast.error('Error en la respuesta del servidor');
        return;
      }
      
      setAuth(data.user, data.token, data.refreshToken);
      
      await queryClient.invalidateQueries({ queryKey: ['roulette-status'] });
      
      setTimeout(() => {
        const savedToken = localStorage.getItem('token');
        console.log('🔍 Token saved in localStorage:', savedToken ? 'Yes' : 'No');
        
        toast.success('¡Bienvenido!');
        router.push('/dashboard');
      }, 100);
    },
    onError: (error: any) => {
      console.error('❌ Login error:', error);
      const message = error.response?.data?.message || error.response?.data?.error || 'Error al iniciar sesión';
      toast.error(message);
    },
  });
};

// Nuevo hook para registro con afiliados
export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterRequest & {
      affiliateId?: string;
      affiliateCode?: string;
    }) => authService.register(data),
    onSuccess: async (data) => {
      console.log('✅ Registration successful:', data);
      
      if (!data.token || !data.user || !data.refreshToken) {
        console.error('❌ Invalid registration response structure');
        toast.error('Error en la respuesta del servidor');
        return;
      }
      
      setAuth(data.user, data.token, data.refreshToken);
      
      await queryClient.invalidateQueries({ queryKey: ['roulette-status'] });
      
      setTimeout(() => {
        toast.success('¡Cuenta creada exitosamente! Bienvenido a SUPERNOVA');
        router.push('/dashboard');
      }, 100);
    },
    onError: (error: any) => {
      console.error('❌ Registration error:', error);
      const message = error.response?.data?.message || error.response?.data?.error || 'Error al crear la cuenta';
      toast.error(message);
    },
  });
};

// Hook para obtener afiliados disponibles - compatible con tu servicio actual
export const useAvailableAffiliates = () => {
  return useQuery({
    queryKey: ['available-affiliates'],
    queryFn: () => authService.getAffiliates(), // Usar tu método existente
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (reemplaza cacheTime en React Query v5)
  });
};

export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
  });
};

export const useLogout = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    router.push('/login');
    toast.success('Sesión cerrada');
  };
};