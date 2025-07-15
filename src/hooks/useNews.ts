import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/services/news.service';

export const useNews = (filters = {}) => {
  return useQuery({
    queryKey: ['news', filters],
    queryFn: () => newsService.getNews(filters),
  });
};

export const useFeaturedNews = (limit = 5) => {
  return useQuery({
    queryKey: ['featured-news', limit],
    queryFn: () => newsService.getFeaturedNews(limit),
  });
};

export const useNewsDetail = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsService.getNewsById(id),
    enabled: !!id,
  });
};