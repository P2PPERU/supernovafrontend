// src/components/news/news-layout-modern.tsx
'use client';

import { useState } from 'react';
import { News } from '@/types';
import { NewsCardModern } from './news-card-modern';
import { NewsSidebar, SidebarSection } from './news-sidebar';
import { TrendingWidget } from './trending-widget';
import { TagsCloud } from './tags-cloud';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock } from 'lucide-react';

interface NewsLayoutModernProps {
  news: News[];
  featuredNews?: News;
  trendingNews?: News[];
  tags?: Array<{ name: string; count: number; trending?: boolean }>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  showSingleAd?: boolean;
}

export function NewsLayoutModern({ 
  news, 
  featuredNews,
  trendingNews = [],
  tags = [],
  onLoadMore,
  hasMore = false,
  isLoading = false,
  showSingleAd = false
}: NewsLayoutModernProps) {
  // Asegurarse de que tenemos noticias
  const allNews = featuredNews ? [featuredNews, ...news] : news;
  const heroNews = allNews[0];
  const otherNews = allNews.slice(1);

  const defaultTags = tags.length > 0 ? tags : [
    { name: 'WSOP 2025', count: 45, trending: true },
    { name: 'Estrategia', count: 38 },
    { name: 'Torneos Online', count: 32, trending: true },
    { name: 'Cash Games', count: 28 },
    { name: 'Poker en Vivo', count: 25 },
  ];

  const topTrendingNews = trendingNews.length > 0 ? trendingNews : otherNews.slice(0, 5);

  // Si no hay noticias, mostrar mensaje
  if (allNews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No hay noticias disponibles</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Noticia Principal con Imagen Grande */}
      {heroNews && (
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <NewsCardModern news={heroNews} variant="hero" />
          </motion.div>
        </section>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contenido Principal - 8 columnas */}
        <main className="lg:col-span-8">
          {/* Título de sección */}
          <div className="flex items-center justify-between mb-8">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="h-10 w-1 bg-gradient-to-b from-poker-green to-poker-blue rounded-full" />
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-6 w-6 text-poker-green" />
                  Últimas Noticias
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Todas las novedades del mundo del poker
                </p>
              </div>
            </motion.div>
          </div>

          {/* Grid de todas las noticias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {otherNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NewsCardModern news={item} variant="featured" index={index} />
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={onLoadMore}
                disabled={isLoading}
                className="glass border-white/20 hover:bg-white/10 rounded-full px-8"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Cargando...
                  </>
                ) : (
                  <>
                    Cargar más noticias
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </main>

        {/* Sidebar - 4 columnas (simplificado) */}
        <NewsSidebar className="lg:col-span-4">
          {/* Widget de Trending */}
          {topTrendingNews.length > 0 && (
            <SidebarSection delay={0.2}>
              <TrendingWidget 
                news={topTrendingNews} 
                title="Lo Más Leído"
                showViews={true}
              />
            </SidebarSection>
          )}

          {/* Tags Cloud */}
          <SidebarSection delay={0.3}>
            <TagsCloud 
              tags={defaultTags}
              onTagClick={(tag) => console.log('Tag clicked:', tag)}
            />
          </SidebarSection>
        </NewsSidebar>
      </div>
    </div>
  );
}