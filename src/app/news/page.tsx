'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNews, useFeaturedNews } from '@/hooks/useNews';
import { 
  Search, 
  Newspaper,
  Sparkles
} from 'lucide-react';

// IMPORTS ACTUALIZADOS
import { NewsLayoutModern } from '@/components/news/news-layout-modern';
import { NewsTicker } from '@/components/news/news-ticker';
import { CategoriesNav } from '@/components/news/categories-nav';
import { NewsSkeletonGrid } from '@/components/news/news-skeleton';
import { AdSlot } from '@/components/ads/AdSlot';

export default function NewsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const filters = {
    page,
    limit: 15,
    category: category === 'all' ? undefined : category,
    search: search || undefined,
    status: 'published',
  };
  
  const { data, isLoading } = useNews(filters);
  const { data: featuredData } = useFeaturedNews(10);
  const { data: trendingData } = useNews({ 
    ...filters, 
    limit: 5, 
    sortBy: 'views' 
  });

  const news = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const tickerNews = featuredData?.news?.slice(0, 10) || [];
  const trendingNews = trendingData?.data || [];
  
  const mainFeaturedNews = news.find(item => item.featured) || news[0];
  const otherNews = news.filter(item => item.id !== mainFeaturedNews?.id);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* News Ticker */}
      <NewsTicker news={tickerNews} />

      {/* Banner Ad - Top */}
      <div className="container mx-auto px-4 py-4">
        <AdSlot type="banner" position="top" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-poker-green/5 via-transparent to-poker-purple/5 opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="h-4 w-4 text-poker-gold" />
              <span className="text-sm font-medium">Centro de Noticias</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Las Últimas <span className="gradient-text">Noticias</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Mantente al día con todo lo que sucede en el mundo del poker
            </p>
          </motion.div>

          {/* Barra de búsqueda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar noticias..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-12 pr-4 h-12 text-base glass border-white/10 focus:border-poker-green/50"
              />
            </div>
          </motion.div>

          {/* Navegación de categorías */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CategoriesNav 
              activeCategory={category}
              onCategoryChange={(cat) => {
                setCategory(cat);
                setPage(1);
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <NewsSkeletonGrid count={9} variant="medium" />
        ) : news.length === 0 ? (
          <Card className="glass border-white/10 p-12 text-center">
            <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              No se encontraron noticias con los filtros seleccionados.
            </p>
            {search && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </Card>
        ) : (
          <NewsLayoutModern 
            news={otherNews} 
            featuredNews={mainFeaturedNews}
            trendingNews={trendingNews}
            onLoadMore={handleLoadMore}
            hasMore={page < totalPages}
            isLoading={isLoading}
          />
        )}
      </section>
    </div>
  );
}