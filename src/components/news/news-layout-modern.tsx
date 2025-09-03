// src/components/news/news-layout-modern.tsx
'use client';

import { useState, useEffect } from 'react';
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
  const [currentCard, setCurrentCard] = useState(0);
  
  // Array de símbolos de cartas
  const cards = ['♠', '♥', '♣', '♦'];
  
  // Efecto para rotar los símbolos de cartas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
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
    <div className="relative min-h-screen">
      {/* Fondo animado de cartas para toda la sección */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cartas para la sección hero */}
        <div className="absolute top-[5%] right-[8%] text-[150px] opacity-[0.05] text-gray-500 floating">
          {cards[currentCard]}
        </div>
        <div className="absolute top-[15%] left-[5%] text-[120px] opacity-[0.05] text-gray-500 floating" style={{ animationDelay: '1.5s' }}>
          {cards[(currentCard + 1) % cards.length]}
        </div>
        
        {/* Cartas para la sección media */}
        <div className="absolute top-[40%] right-[15%] text-[140px] opacity-[0.04] text-gray-500 rotating-slow">
          {cards[(currentCard + 2) % cards.length]}
        </div>
        <div className="absolute top-[50%] left-[10%] text-[160px] opacity-[0.04] text-gray-500 rotating-slow" style={{ animationDelay: '3s' }}>
          {cards[(currentCard + 3) % cards.length]}
        </div>
        
        {/* Cartas para la sección inferior */}
        <div className="absolute bottom-[20%] right-[25%] text-[130px] opacity-[0.03] text-gray-500 floating" style={{ animationDelay: '2s' }}>
          {cards[currentCard]}
        </div>
        <div className="absolute bottom-[10%] left-[20%] text-[110px] opacity-[0.03] text-gray-500 floating" style={{ animationDelay: '4s' }}>
          {cards[(currentCard + 1) % cards.length]}
        </div>
        
        {/* Cartas adicionales para llenar espacios */}
        <div className="absolute top-[25%] right-[45%] text-[100px] opacity-[0.03] text-gray-500 rotating-slow" style={{ animationDelay: '5s' }}>
          {cards[(currentCard + 2) % cards.length]}
        </div>
        <div className="absolute top-[65%] left-[35%] text-[90px] opacity-[0.03] text-gray-500 floating" style={{ animationDelay: '3.5s' }}>
          {cards[(currentCard + 3) % cards.length]}
        </div>
      </div>

      {/* Contenido principal con z-index superior */}
      <div className="relative z-10">
        {/* Hero Section - Noticia Principal con Imagen Grande */}
        {heroNews && (
          <section className="mb-16 relative">
            {/* Efecto de luz sutil detrás del hero */}
            <div className="absolute inset-0 bg-gradient-to-br from-poker-green/5 via-transparent to-poker-blue/5 rounded-3xl blur-3xl" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full relative"
            >
              <NewsCardModern news={heroNews} variant="hero" />
            </motion.div>
          </section>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contenido Principal - 8 columnas */}
          <main className="lg:col-span-8 relative">
            {/* Carta decorativa sutil para el título */}
            <div className="absolute -top-4 -left-4 text-[80px] opacity-[0.02] text-gray-500">
              {cards[(currentCard + 1) % cards.length]}
            </div>
            
            {/* Título de sección */}
            <div className="flex items-center justify-between mb-8 relative">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative">
              {/* Carta decorativa para el grid */}
              <div className="absolute -bottom-8 -right-8 text-[120px] opacity-[0.02] text-gray-500 rotating-slow" style={{ animationDelay: '2s' }}>
                {cards[(currentCard + 3) % cards.length]}
              </div>
              
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
              <div className="text-center mt-12 relative">
                {/* Pequeño símbolo decorativo junto al botón */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-[40px] opacity-[0.05] text-gray-500">
                  {cards[currentCard]}
                </div>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="glass border-white/20 hover:bg-white/10 rounded-full px-8 backdrop-blur-sm"
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
          <NewsSidebar className="lg:col-span-4 relative">
            {/* Carta decorativa para el sidebar */}
            <div className="absolute -top-6 -right-4 text-[100px] opacity-[0.02] text-gray-500 floating" style={{ animationDelay: '1s' }}>
              {cards[(currentCard + 2) % cards.length]}
            </div>
            
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
    </div>
  );
}