// src/components/news/news-layout-modern.tsx
'use client';

import { useState } from 'react';
import { News } from '@/types';
import { NewsCardModern } from './news-card-modern';
import { NewsSidebar, SidebarSection } from './news-sidebar';
import { TrendingWidget } from './trending-widget';
import { TagsCloud } from './tags-cloud';
import { LiveUpdatesWidget } from './live-updates-widget';
import { AdSlot } from '@/components/ads/AdSlot';
import { motion } from 'framer-motion';
import { 
  Clock, 
  TrendingUp, 
  Newspaper,
  ChevronRight,
  Sparkles,
  Flame,
  Mail,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface NewsLayoutModernProps {
  news: News[];
  featuredNews?: News;
  trendingNews?: News[];
  tags?: Array<{ name: string; count: number; trending?: boolean }>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function NewsLayoutModern({ 
  news, 
  featuredNews,
  trendingNews = [],
  tags = [],
  onLoadMore,
  hasMore = false,
  isLoading = false
}: NewsLayoutModernProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  // Separar las noticias por secciones
  const heroNews = featuredNews || news[0];
  const subFeaturedNews = news.slice(1, 3);
  const latestNews = news.slice(3, 9);
  const remainingNews = news.slice(9);

  // Datos mock para tags si no se proporcionan
  const defaultTags = tags.length > 0 ? tags : [
    { name: 'WSOP 2025', count: 45, trending: true },
    { name: 'Estrategia', count: 38 },
    { name: 'Torneos Online', count: 32, trending: true },
    { name: 'Cash Games', count: 28 },
    { name: 'Poker en Vivo', count: 25 },
    { name: 'Análisis', count: 22 },
    { name: 'Bankroll', count: 20 },
    { name: 'Psicología', count: 18 },
  ];

  // Trending news - usar las proporcionadas o las primeras 5
  const topTrendingNews = trendingNews.length > 0 ? trendingNews : news.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Hero Section con Grid Complejo */}
      {heroNews && (
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Noticia Principal - Ocupa 8 columnas */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8"
            >
              <NewsCardModern news={heroNews} variant="hero" />
            </motion.div>

            {/* Sub-featured News - Ocupa 4 columnas */}
            <div className="lg:col-span-4 space-y-6">
              {subFeaturedNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <NewsCardModern news={item} variant="featured" index={index} />
                </motion.div>
              ))}
              
              {/* Ad Slot para móvil */}
              <div className="lg:hidden">
                <AdSlot type="native" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección Principal con Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contenido Principal - 8 columnas */}
        <main className="lg:col-span-8">
          {/* Banner Ad */}
          <div className="mb-8">
            <AdSlot type="banner" position="top" />
          </div>

          {/* Sección de Últimas Noticias */}
          {latestNews.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1 bg-gradient-to-b from-poker-green to-poker-blue" />
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Clock className="h-6 w-6 text-poker-green" />
                      Últimas Noticias
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Lo más reciente del mundo del poker
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-poker-green hover:text-poker-green/80"
                >
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {/* Grid de noticias recientes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <NewsCardModern news={item} variant="featured" index={index} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Native Ad entre secciones */}
          <div className="my-8">
            <AdSlot type="native" />
          </div>

          {/* Sección de Más Noticias */}
          {remainingNews.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-gradient-to-b from-poker-purple to-poker-red" />
                <h3 className="text-xl font-bold">Más Noticias</h3>
              </div>

              <div className="space-y-4">
                {remainingNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <NewsCardModern news={item} variant="default" index={index} />
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="glass border-white/20 hover:bg-white/10"
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
            </section>
          )}

          {/* Bottom Banner Ad */}
          <div className="mt-8">
            <AdSlot type="banner" position="bottom" />
          </div>
        </main>

        {/* Sidebar - 4 columnas */}
        <NewsSidebar className="lg:col-span-4">
          {/* Widget de Trending */}
          <SidebarSection delay={0.2}>
            <TrendingWidget 
              news={topTrendingNews} 
              title="Lo Más Leído"
              showViews={true}
            />
          </SidebarSection>

          {/* Sidebar Ad */}
          <SidebarSection delay={0.3}>
            <AdSlot type="sidebar" />
          </SidebarSection>

          {/* Tags Cloud */}
          <SidebarSection delay={0.4}>
            <TagsCloud 
              tags={defaultTags}
              onTagClick={(tag) => {
                setSelectedTag(tag);
                console.log('Tag clicked:', tag);
              }}
            />
          </SidebarSection>

          {/* Live Updates Widget */}
          <SidebarSection delay={0.5}>
            <LiveUpdatesWidget />
          </SidebarSection>

          {/* Newsletter CTA */}
          <SidebarSection delay={0.6}>
            <Card className="glass border-white/10 p-6 bg-gradient-to-br from-poker-green/10 to-poker-blue/10">
              <div className="text-center space-y-4">
                <div className="inline-flex p-3 rounded-full bg-poker-green/20">
                  <Mail className="h-6 w-6 text-poker-green" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Newsletter Semanal</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Recibe las mejores noticias y estrategias en tu email
                  </p>
                </div>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass border-white/20"
                  />
                  <Button className="w-full bg-poker-green hover:bg-poker-darkGreen text-black">
                    <Bell className="h-4 w-4 mr-2" />
                    Suscribirse
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Sin spam, solo contenido de calidad
                </p>
              </div>
            </Card>
          </SidebarSection>

          {/* Quick Stats */}
          <SidebarSection delay={0.7}>
            <Card className="glass border-white/10 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-poker-gold" />
                Stats del Día
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Noticias Publicadas</span>
                  <Badge className="bg-poker-green/20 text-poker-green">
                    {news.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Trending Topics</span>
                  <Badge className="bg-poker-gold/20 text-poker-gold">
                    {defaultTags.filter(t => t.trending).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Lectores Activos</span>
                  <Badge className="bg-poker-blue/20 text-poker-blue">
                    2.3k
                  </Badge>
                </div>
              </div>
            </Card>
          </SidebarSection>
        </NewsSidebar>
      </div>
    </div>
  );
}