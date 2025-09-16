import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUsersService } from '@/services/admin/users.service';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Hooks existentes de usuarios
export const useAdminUsers = (filters: any = {}) => {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminUsersService.getUsers(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminUserStats = () => {
  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: adminUsersService.getStats,
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: adminUsersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate-profiles'] });
      toast.success('Usuario creado exitosamente');
      router.push('/admin/users');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear usuario';
      toast.error(message);
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminUsersService.updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      toast.success('Estado actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar estado';
      toast.error(message);
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminUsersService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate-profiles'] });
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar rol';
      toast.error(message);
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      adminUsersService.resetUserPassword(id, newPassword),
    onSuccess: () => {
      toast.success('Contraseña restablecida exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al restablecer contraseña';
      toast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUsersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar usuario';
      toast.error(message);
    },
  });
};

// Nuevos hooks para afiliados
export const useAffiliateProfiles = (filters: any = {}) => {
  return useQuery({
    queryKey: ['affiliate-profiles', filters],
    queryFn: () => adminUsersService.getAffiliateProfiles(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useAvailableAffiliates = () => {
  return useQuery({
    queryKey: ['available-affiliates'],
    queryFn: adminUsersService.getAvailableAffiliates,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUpdateAffiliateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      adminUsersService.updateAffiliateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['available-affiliates'] });
      toast.success('Perfil de afiliado actualizado');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(message);
    },
  });
};

export const useAffiliationHistory = (filters: any = {}) => {
  return useQuery({
    queryKey: ['affiliation-history', filters],
    queryFn: () => adminUsersService.getAffiliationHistory(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useAgentClients = (agentId: string, filters: any = {}) => {
  return useQuery({
    queryKey: ['agent-clients', agentId, filters],
    queryFn: () => adminUsersService.getAgentClients(agentId, filters),
    enabled: !!agentId,
    placeholderData: (previousData) => previousData,
  });
};

export const useTransferClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, newAgentId }: { clientId: string; newAgentId: string }) =>
      adminUsersService.transferClient(clientId, newAgentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['agent-clients'] });
      queryClient.invalidateQueries({ queryKey: ['affiliation-history'] });
      toast.success('Cliente transferido exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al transferir cliente';
      toast.error(message);
    },
  });
};

export const useAffiliateStats = (agentId?: string) => {
  return useQuery({
    queryKey: ['affiliate-stats', agentId],
    queryFn: () => adminUsersService.getAffiliateStats(agentId),
    refetchInterval: 60000, // Actualizar cada minuto
  });
};

// Hooks para códigos de afiliado
export const useAffiliateCodes = (affiliateId?: string) => {
  return useQuery({
    queryKey: ['affiliate-codes', affiliateId],
    queryFn: () => adminUsersService.getAffiliateCodes(affiliateId),
    enabled: !!affiliateId,
  });
};

export const useCreateAffiliateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ affiliateId, data }: { affiliateId: string; data: any }) =>
      adminUsersService.createAffiliateCode(affiliateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-codes'] });
      toast.success('Código de afiliado creado');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear código';
      toast.error(message);
    },
  });
};

export const useUpdateAffiliateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ codeId, data }: { codeId: string; data: any }) =>
      adminUsersService.updateAffiliateCode(codeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-codes'] });
      toast.success('Código actualizado');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar código';
      toast.error(message);
    },
  });
};

export const useDeleteAffiliateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUsersService.deleteAffiliateCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-codes'] });
      toast.success('Código eliminado');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar código';
      toast.error(message);
    },
  });
};