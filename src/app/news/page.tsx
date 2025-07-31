'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNews, useFeaturedNews } from '@/hooks/useNews';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { News } from '@/types';
import { 
  Search, 
  Newspaper,
  Crown,
  TrendingUp,
  Clock,
  Eye,
  Calendar,
  ArrowRight,
  Trophy,
  Gift,
  Megaphone,
  Sparkles,
  Filter,
  Tag,
  Zap,
  Users
} from 'lucide-react';

// IMPORTAR NUEVOS COMPONENTES
import { NewsHero } from '@/components/news/news-hero';
import { NewsTicker } from '@/components/news/news-ticker';
import { NewsGrid } from '@/components/news/news-grid';
import { NewsSidebar, SidebarSection } from '@/components/news/news-sidebar';
import { TrendingWidget } from '@/components/news/trending-widget';
import { LiveUpdatesWidget } from '@/components/news/live-updates-widget';
import { TagsCloud } from '@/components/news/tags-cloud';
import { CategoriesNav } from '@/components/news/categories-nav';
import { NewsSkeletonGrid } from '@/components/news/news-skeleton';
import { QuickReadModal } from '@/components/news/quick-read-modal';

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [quickReadNews, setQuickReadNews] = useState<News | null>(null);
  const [layout, setLayout] = useState<'magazine' | 'blog' | 'masonry'>('magazine');

  const { data, isLoading } = useNews({
    page,
    limit: 12,
    category: category === 'all' ? undefined : category,
    search: search || undefined,
    status: 'published',
  });

  const { data: featuredData } = useFeaturedNews(6);

  const news = data?.data || [];
  const totalPages = data?.totalPages || 1;
  
  // Separar noticias
  const mainNews = news.find(item => item.featured) || news[0];
  const otherNews = news.filter(item => item.id !== mainNews?.id);
  
  // Datos para widgets
  const trendingNews = featuredData?.news?.slice(0, 5) || [];
  const tickerNews = featuredData?.news?.slice(0, 10) || [];
  
  // Tags mock (en producción vendría del backend)
  const popularTags = [
    { name: 'WSOP', count: 45, trending: true },
    { name: 'Main Event', count: 38 },
    { name: 'High Roller', count: 32 },
    { name: 'Estrategia', count: 28 },
    { name: 'Torneos', count: 25 },
    { name: 'Cash Game', count: 22 },
    { name: 'Online', count: 20 },
    { name: 'Satélites', count: 18 },
    { name: 'Freeroll', count: 15 },
    { name: 'Bonus', count: 12 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* News Ticker */}
      <NewsTicker news={tickerNews} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-poker-green/10 via-transparent to-poker-purple/10 opacity-50" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Newspaper className="h-4 w-4 text-poker-green" />
              <span className="text-sm font-medium">Centro de Noticias</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Las Últimas <span className="gradient-text">Noticias</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Mantente al día con todo lo que sucede en el mundo del poker
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar noticias, torneos, promociones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg glass border-white/10 focus:border-poker-green/50"
              />
            </div>
          </motion.div>

          {/* Categories Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <CategoriesNav 
              activeCategory={category}
              onCategoryChange={setCategory}
              showCounts
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <NewsSkeletonGrid count={9} variant="medium" />
        ) : news.length === 0 ? (
          <Card className="glass border-white/10 p-12 text-center">
            <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              No se encontraron noticias con los filtros seleccionados.
            </p>
          </Card>
        ) : (
          <>
            {/* Featured News Hero */}
            {mainNews && (
              <div className="mb-12">
                <NewsHero news={mainNews} />
              </div>
            )}

            {/* Main Grid + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* News Grid */}
              <div className="lg:col-span-3">
                <NewsGrid news={otherNews} layout={layout} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="glass border-white/20"
                    >
                      Anterior
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className={page === pageNum ? 'bg-poker-green text-black' : 'hover:bg-white/10'}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="glass border-white/20"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar with new widgets */}
              <NewsSidebar>
                <SidebarSection delay={0.3}>
                  <TrendingWidget news={trendingNews} />
                </SidebarSection>

                <SidebarSection delay={0.4}>
                  <LiveUpdatesWidget />
                </SidebarSection>

                <SidebarSection delay={0.5}>
                  <TagsCloud 
                    tags={popularTags}
                    onTagClick={(tag) => console.log('Tag clicked:', tag)}
                  />
                </SidebarSection>

                {/* Newsletter Widget */}
                <SidebarSection delay={0.6}>
                  <Card className="glass border-white/10 p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-poker-gold" />
                      Newsletter VIP
                    </h3>
                    
                    <p className="text-sm text-gray-400 mb-4">
                      Recibe las mejores noticias y análisis exclusivos directamente en tu correo.
                    </p>
                    
                    <Input
                      type="email"
                      placeholder="Tu email"
                      className="mb-3 glass border-white/10"
                    />
                    
                    <Button className="w-full bg-gradient-to-r from-poker-gold to-yellow-600 text-black hover:opacity-90">
                      Suscribirme
                    </Button>
                  </Card>
                </SidebarSection>
              </NewsSidebar>
            </div>
          </>
        )}
      </div>

      {/* Quick Read Modal */}
      <QuickReadModal
        news={quickReadNews}
        isOpen={!!quickReadNews}
        onClose={() => setQuickReadNews(null)}
      />
    </div>
  );
}