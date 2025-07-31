import { api } from '@/lib/axios';
import { News, PaginatedResponse } from '@/types';

// Tipos para filtros
interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  featured?: string;
  search?: string;
  sortBy?: string;
}

// Tipos para crear/actualizar
interface CreateNewsData {
  title: string;
  content: string;
  summary?: string;
  category: 'general' | 'tournament' | 'promotion' | 'update';
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  featured?: boolean;
  image?: File;
}

interface UpdateNewsData extends Partial<CreateNewsData> {}

// Tipos para estadísticas
interface NewsStats {
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    totalViews: number;
    avgViews: number;
  }>;
  topNews: Array<{
    id: string;
    title: string;
    views: number;
    category: string;
  }>;
  topAuthors: Array<{
    author: {
      id: string;
      username: string;
    };
    newsCount: number;
    totalViews: number;
  }>;
  newsByMonth: Array<{
    month: string;
    count: number;
  }>;
}

export const adminNewsService = {
  // Obtener lista de noticias con filtros
  getNews: async (filters: NewsFilters = {}): Promise<PaginatedResponse<News>> => {
    const response = await api.get('/news', { params: filters });
    return response.data;
  },

  // Obtener noticia por ID
  getNewsById: async (id: string): Promise<{ success: boolean; news: News }> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Crear noticia
  createNews: async (data: CreateNewsData): Promise<{ success: boolean; news: News }> => {
    const formData = new FormData();
    
    // Agregar campos al FormData
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.summary) formData.append('summary', data.summary);
    formData.append('category', data.category);
    formData.append('status', data.status || 'draft');
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    formData.append('featured', String(data.featured || false));
    
    // Solo agregar imagen si existe
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar noticia
  updateNews: async (id: string, data: UpdateNewsData): Promise<{ success: boolean; news: News }> => {
    const formData = new FormData();
    
    // Solo agregar campos que estén presentes
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.summary !== undefined) formData.append('summary', data.summary);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.status !== undefined) formData.append('status', data.status);
    if (data.tags !== undefined) formData.append('tags', JSON.stringify(data.tags));
    if (data.featured !== undefined) formData.append('featured', String(data.featured));
    if (data.image) formData.append('image', data.image);

    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Eliminar noticia
  deleteNews: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async (): Promise<{ success: boolean; stats: NewsStats }> => {
    const response = await api.get('/news/stats/overview');
    return response.data;
  },

  // Cambiar estado de una noticia (publicar, archivar, etc)
  updateNewsStatus: async (id: string, status: 'draft' | 'published' | 'archived'): Promise<{ success: boolean; news: News }> => {
    const response = await api.put(`/news/${id}`, { status });
    return response.data;
  },

  // Toggle featured
  toggleFeatured: async (id: string, featured: boolean): Promise<{ success: boolean; news: News }> => {
    const response = await api.put(`/news/${id}`, { featured });
    return response.data;
  },
};