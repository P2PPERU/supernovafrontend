import { api } from '@/lib/axios';
import { News, PaginatedResponse } from '@/types';

interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}

// Transformador para normalizar las respuestas del backend
const transformNewsResponse = (news: any): News => {
  return {
    ...news,
    imageUrl: news.imageUrl || news.image_url,
    publishedAt: news.publishedAt || news.published_at,
    authorId: news.authorId || news.author_id,
    createdAt: news.createdAt || news.created_at,
    updatedAt: news.updatedAt || news.updated_at,
  };
};

export const newsService = {
  getNews: async (filters: NewsFilters = {}): Promise<PaginatedResponse<News>> => {
    console.log('📡 Enviando petición con filtros:', filters);
    
    // Limpiar filtros undefined
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    console.log('📡 Filtros limpios:', cleanFilters);
    
    const response = await api.get('/news', { params: cleanFilters });
    console.log('📰 News response:', response.data);
    console.log('📰 Response status:', response.status);
    console.log('📰 Raw news data:', response.data.data);
    
    return {
      ...response.data,
      data: response.data.data?.map(transformNewsResponse) || [],
    };
  },

  getFeaturedNews: async (limit = 5) => {
    const response = await api.get('/news/featured', { params: { limit } });
    return {
      ...response.data,
      news: response.data.news?.map(transformNewsResponse) || [],
    };
  },

  getNewsByCategory: async (category: string, page = 1, limit = 10) => {
    const response = await api.get(`/news/category/${category}`, {
      params: { page, limit },
    });
    return {
      ...response.data,
      data: response.data.data?.map(transformNewsResponse) || [],
    };
  },

  getNewsById: async (id: string) => {
    const response = await api.get(`/news/${id}`);
    return {
      ...response.data,
      news: transformNewsResponse(response.data.news),
    };
  },
};