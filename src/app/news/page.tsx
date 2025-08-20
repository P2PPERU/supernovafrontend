// src/app/news/page.tsx
'use client';

import { useState } from 'react';
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

import { NewsLayoutModern } from '@/components/news/news-layout-modern';
import { CategoriesNav } from '@/components/news/categories-nav';
import { NewsSkeletonGrid } from '@/components/news/news-skeleton';

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const filters = {
    page,
    limit: 20, // Aumentar el límite para mostrar más noticias
    category: category === 'all' ? undefined : category,
    search: search || undefined,
    status: 'published',
  };
  
  const { data, isLoading } = useNews(filters);
  const { data: featuredData } = useFeaturedNews(5);
  const { data: trendingData } = useNews({ 
    ...filters, 
    limit: 5, 
    sortBy: 'views' 
  });

  const news = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const trendingNews = trendingData?.data || [];
  
  // Obtener noticia destacada si existe
  const mainFeaturedNews = news.find(item => item.featured);
  // Todas las demás noticias (incluyendo la destacada si no hay una específica)
  const otherNews = mainFeaturedNews 
    ? news.filter(item => item.id !== mainFeaturedNews.id)
    : news;

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section Simple */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-poker-gold" />
              <span className="text-sm font-medium">Centro de Noticias</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Las Últimas <span className="gradient-text">Noticias</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Mantente informado con todo lo que sucede en el mundo del poker
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
                className="pl-12 pr-4 h-12 text-base glass border-white/10 rounded-full focus:border-poker-green/50"
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
          <NewsSkeletonGrid count={6} variant="medium" />
        ) : news.length === 0 ? (
          <Card className="glass border-white/10 p-12 text-center">
            <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              No se encontraron noticias.
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
          <>
            {/* Debug - Temporal para ver cuántas noticias hay */}
            <div className="mb-4 text-sm text-gray-500">
              Mostrando {news.length} noticias
            </div>
            
            <NewsLayoutModern 
              news={otherNews} 
              featuredNews={mainFeaturedNews}
              trendingNews={trendingNews}
              onLoadMore={handleLoadMore}
              hasMore={page < totalPages}
              isLoading={isLoading}
              showSingleAd={false}
            />
          </>
        )}
      </section>
    </div>
  );
}