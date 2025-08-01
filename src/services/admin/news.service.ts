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

// Transformador para normalizar las respuestas del backend
const transformNewsResponse = (news: any): News => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
  
  return {
    ...news,
    imageUrl: news.image_url 
      ? `${baseUrl}${news.image_url}` 
      : news.imageUrl 
        ? `${baseUrl}${news.imageUrl}`
        : null,
    publishedAt: news.publishedAt || news.published_at,
    authorId: news.authorId || news.author_id,
    createdAt: news.createdAt || news.created_at,
    updatedAt: news.updatedAt || news.updated_at,
  };
};

export const adminNewsService = {
  // Obtener lista de noticias con filtros
  getNews: async (filters: NewsFilters = {}): Promise<PaginatedResponse<News>> => {
    const response = await api.get('/news', { params: filters });
    return {
      ...response.data,
      data: response.data.news?.map(transformNewsResponse) || [], // CAMBIO: .data → .news
      totalItems: response.data.totalNews, // AGREGADO
    };
  },

  // Obtener noticia por ID
  getNewsById: async (id: string): Promise<{ success: boolean; news: News }> => {
    const response = await api.get(`/news/${id}`);
    return {
      ...response.data,
      news: transformNewsResponse(response.data.news),
    };
  },

  // Crear noticia
  createNews: async (data: CreateNewsData): Promise<{ success: boolean; news: News }> => {
    const formData = new FormData();
    
    // Log para debug
    console.log('🚀 Creating news with data:', data);
    
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.summary) formData.append('summary', data.summary);
    formData.append('category', data.category);
    formData.append('status', data.status || 'draft');
    
    // Log del estado
    console.log('📋 Status being sent:', data.status || 'draft');
    
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => formData.append('tags[]', tag));
    }
    formData.append('featured', String(data.featured || false));
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      ...response.data,
      news: transformNewsResponse(response.data.news),
    };
  },

  // Actualizar noticia
  updateNews: async (id: string, data: UpdateNewsData): Promise<{ success: boolean; news: News }> => {
    const formData = new FormData();
    
    console.log('🔄 Updating news with data:', data);
    
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.summary !== undefined) formData.append('summary', data.summary);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.status !== undefined) {
      formData.append('status', data.status);
      console.log('📋 Status being updated to:', data.status);
    }
    if (data.tags !== undefined) {
      if (Array.isArray(data.tags) && data.tags.length > 0) {
      data.tags.forEach(tag => formData.append('tags[]', tag));
      } else {
      formData.append('tags[]', '');
      }
    }
    if (data.featured !== undefined) formData.append('featured', String(data.featured));
    if (data.image) formData.append('image', data.image);

    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      ...response.data,
      news: transformNewsResponse(response.data.news),
    };
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
    // Usar FormData para mantener consistencia
    const formData = new FormData();
    formData.append('status', status);
    
    console.log('📋 Updating status to:', status);
    
    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      ...response.data,
      news: transformNewsResponse(response.data.news),
    };
  },

  // Toggle featured
  toggleFeatured: async (id: string, featured: boolean): Promise<{ success: boolean; news: News }> => {
    // Usar FormData para mantener consistencia
    const formData = new FormData();
    formData.append('featured', String(featured));
    
    console.log('⭐ Toggling featured to:', featured);
    
    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      ...response.data,
      news: transformNewsResponse(response.data.news),
    };
  },
};