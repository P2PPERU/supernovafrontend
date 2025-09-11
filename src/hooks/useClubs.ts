// src/hooks/useClubs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsService, adminClubsService } from '@/services/clubs.service';
import { ClubFilters } from '@/types/club.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Hooks públicos para clubs
export const useClubs = (filters: ClubFilters = {}) => {
  return useQuery({
    queryKey: ['clubs', filters],
    queryFn: () => clubsService.getClubs(filters),
    staleTime: 60000, // 1 minuto
  });
};

export const useClub = (id: string) => {
  return useQuery({
    queryKey: ['club', id],
    queryFn: () => clubsService.getClubById(id),
    enabled: !!id,
  });
};

export const useFeaturedClubs = (limit = 6) => {
  return useQuery({
    queryKey: ['clubs', 'featured', limit],
    queryFn: () => clubsService.getFeaturedClubs(limit),
    staleTime: 300000, // 5 minutos
  });
};

export const useSearchClubs = (query: string, filters: ClubFilters = {}) => {
  return useQuery({
    queryKey: ['clubs', 'search', query, filters],
    queryFn: () => clubsService.searchClubs(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 30000, // 30 segundos
  });
};

// Hooks de administración
export const useAdminClubs = (filters: ClubFilters = {}) => {
  return useQuery({
    queryKey: ['admin-clubs', filters],
    queryFn: () => adminClubsService.getClubs(filters),
  });
};

export const useAdminClub = (id: string) => {
  return useQuery({
    queryKey: ['admin-club', id],
    queryFn: () => adminClubsService.getClubById(id),
    enabled: !!id,
  });
};

export const useClubStats = () => {
  return useQuery({
    queryKey: ['club-stats'],
    queryFn: adminClubsService.getStats,
  });
};

export const useCreateClub = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: adminClubsService.createClub,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-stats'] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] }); // Invalidar también las públicas
      queryClient.invalidateQueries({ queryKey: ['clubs', 'featured'] });
      
      toast.success('Club creado exitosamente');
      router.push('/admin/clubs');
    },
    onError: (error: any) => {
      console.error('Error creating club:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error al crear club');
    },
  });
};

export const useUpdateClub = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminClubsService.updateClub(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-clubs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-club', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['club-stats'] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['clubs', 'featured'] });
      queryClient.invalidateQueries({ queryKey: ['club', variables.id] });
      
      toast.success('Club actualizado exitosamente');
      router.push('/admin/clubs');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar club');
    },
  });
};

export const useUpdateClubStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminClubsService.updateClubStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-clubs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-club', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club', variables.id] });
      
      toast.success(variables.isActive ? 'Club activado' : 'Club desactivado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    },
  });
};

export const useDeleteClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminClubsService.deleteClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-stats'] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['clubs', 'featured'] });
      
      toast.success('Club eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar club');
    },
  });
};