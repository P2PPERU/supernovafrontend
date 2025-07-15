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

export const newsService = {
  getNews: async (filters: NewsFilters = {}): Promise<PaginatedResponse<News>> => {
    const response = await api.get('/news', { params: filters });
    return response.data;
  },

  getFeaturedNews: async (limit = 5) => {
    const response = await api.get('/news/featured', { params: { limit } });
    return response.data;
  },

  getNewsByCategory: async (category: string, page = 1, limit = 10) => {
    const response = await api.get(`/news/category/${category}`, {
      params: { page, limit },
    });
    return response.data;
  },

  getNewsById: async (id: string) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },
};