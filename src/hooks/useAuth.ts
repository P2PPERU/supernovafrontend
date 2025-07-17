import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { LoginRequest } from '@/types';
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
      
      // Verificar que tenemos los datos necesarios
      if (!data.token || !data.user || !data.refreshToken) {
        console.error('❌ Invalid login response structure');
        toast.error('Error en la respuesta del servidor');
        return;
      }
      
      // Guardar en el store (que también guarda en cookies y localStorage)
      setAuth(data.user, data.token, data.refreshToken);
      
      // Invalidar y refetch el estado de la ruleta
      await queryClient.invalidateQueries({ queryKey: ['roulette-status'] });
      
      // Verificar que se guardó correctamente
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