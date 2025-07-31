import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminNewsService } from '@/services/admin/news.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Hook para obtener lista de noticias
export const useAdminNews = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-news', filters],
    queryFn: () => adminNewsService.getNews(filters),
  });
};

// Hook para obtener noticia por ID
export const useAdminNewsDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin-news', id],
    queryFn: () => adminNewsService.getNewsById(id),
    enabled: !!id,
  });
};

// Hook para obtener estadísticas
export const useAdminNewsStats = () => {
  return useQuery({
    queryKey: ['admin-news-stats'],
    queryFn: adminNewsService.getStats,
  });
};

// Hook para crear noticia
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: any) => {
      console.log('📝 Creating news with data:', data);
      return adminNewsService.createNews(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['admin-news-stats'] });
      queryClient.invalidateQueries({ queryKey: ['news'] }); // Invalidar también las públicas
      queryClient.invalidateQueries({ queryKey: ['featured-news'] });
      
      toast.success('Noticia creada exitosamente');
      
      // Redirigir según el estado
      if (data.news.status === 'published') {
        router.push('/admin/news');
      } else {
        // Si es borrador, ir a editar
        router.push(`/admin/news/${data.news.id}/edit`);
      }
    },
    onError: (error: any) => {
      console.error('❌ Error creating news:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error al crear noticia');
    },
  });
};

// Hook para actualizar noticia
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminNewsService.updateNews(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['admin-news', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-news-stats'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['featured-news'] });
      
      toast.success('Noticia actualizada exitosamente');
      router.push('/admin/news');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar noticia');
    },
  });
};

// Hook para eliminar noticia
export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminNewsService.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['admin-news-stats'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['featured-news'] });
      
      toast.success('Noticia eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar noticia');
    },
  });
};

// Hook para cambiar estado
export const useUpdateNewsStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'published' | 'archived' }) =>
      adminNewsService.updateNewsStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['admin-news', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      
      const statusMessages = {
        published: 'Noticia publicada exitosamente',
        draft: 'Noticia guardada como borrador',
        archived: 'Noticia archivada exitosamente',
      };
      
      toast.success(statusMessages[variables.status]);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    },
  });
};

// Hook para toggle featured
export const useToggleFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      adminNewsService.toggleFeatured(id, featured),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['admin-news', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['featured-news'] });
      
      toast.success(
        variables.featured 
          ? 'Noticia destacada exitosamente' 
          : 'Noticia removida de destacadas'
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar destacado');
    },
  });
};

// Hook para publicación programada (opcional)
export const useSchedulePublication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, publishAt }: { id: string; publishAt: string }) =>
      adminNewsService.updateNews(id, { publishAt, status: 'scheduled' } as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['admin-news', variables.id] });
      
      toast.success('Publicación programada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al programar publicación');
    },
  });
};