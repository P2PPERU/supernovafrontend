import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUsersService } from '@/services/admin/users.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Hook para obtener lista de usuarios
export const useAdminUsers = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminUsersService.getUsers(filters),
  });
};

// Hook para obtener estadísticas
export const useAdminUserStats = () => {
  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: adminUsersService.getStats,
  });
};

// Hook para obtener usuario por ID
export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminUsersService.getUserById(id),
    enabled: !!id,
  });
};

// Hook para crear usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: adminUsersService.createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      toast.success('Usuario creado exitosamente');
      router.push('/admin/users');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    },
  });
};

// Hook para actualizar estado
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminUsersService.updateUserStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
      toast.success(variables.isActive ? 'Usuario activado' : 'Usuario desactivado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar estado');
    },
  });
};

// Hook para actualizar rol
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminUsersService.updateUserRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar rol');
    },
  });
};

// Hook para actualizar balance
export const useUpdateUserBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; balance: number; operation: string }) =>
      adminUsersService.updateUserBalance(id, data as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
      toast.success('Balance actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar balance');
    },
  });
};

// Hook para restablecer contraseña
export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      adminUsersService.resetUserPassword(id, newPassword),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
      toast.success('Contraseña restablecida exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al restablecer contraseña');
    },
  });
};

// Hook para eliminar usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: adminUsersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      toast.success('Usuario eliminado exitosamente');
      router.push('/admin/users');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar usuario');
    },
  });
};