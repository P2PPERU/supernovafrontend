// src/app/news/page.tsx
'use client';

import { useState, useEffect } from 'react';
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

  const filters = {
    page,
    limit: 20,
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
  
  const mainFeaturedNews = news.find(item => item.featured);
  const otherNews = mainFeaturedNews 
    ? news.filter(item => item.id !== mainFeaturedNews.id)
    : news;

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1923] via-[#1a2332] to-[#0f1923]">
      {/* Hero Section con Fondo Animado de Cartas */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-[#1a2332] to-[#0f1923]">
        {/* Elementos de fondo animados - SÍMBOLOS DE CARTAS MONOCROMÁTICOS */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Carta superior izquierda */}
          <div className="absolute top-10 left-[5%] text-[120px] opacity-10 text-gray-400 floating">
            {cards[currentCard]}
          </div>
          
          {/* Carta inferior derecha */}
          <div className="absolute bottom-16 right-[10%] text-[100px] opacity-10 text-gray-400 floating" style={{ animationDelay: '1s' }}>
            {cards[(currentCard + 1) % cards.length]}
          </div>
          
          {/* Carta centro izquierda */}
          <div className="absolute top-1/2 left-[15%] text-[90px] opacity-10 text-gray-400 floating" style={{ animationDelay: '2s' }}>
            {cards[(currentCard + 2) % cards.length]}
          </div>
          
          {/* Carta centro derecha */}
          <div className="absolute top-1/3 right-[20%] text-[110px] opacity-10 text-gray-400 floating" style={{ animationDelay: '3s' }}>
            {cards[(currentCard + 3) % cards.length]}
          </div>
          
          {/* Cartas adicionales para más densidad */}
          <div className="absolute top-[70%] left-[40%] text-[80px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '1.5s' }}>
            {cards[(currentCard + 1) % cards.length]}
          </div>
          
          <div className="absolute top-[20%] right-[35%] text-[95px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '2.5s' }}>
            {cards[(currentCard + 2) % cards.length]}
          </div>
        </div>

        {/* Gradiente overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-blue-900/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 backdrop-blur-sm bg-white/5 border border-white/10">
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
                className="pl-12 pr-4 h-12 text-base glass border-white/10 rounded-full focus:border-poker-green/50 bg-white/5 backdrop-blur-sm"
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

      {/* Contenido Principal con fondo sutil de cartas */}
      <section className="container mx-auto px-4 pb-20 relative">
        {/* Fondo sutil de cartas para la sección de contenido */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[80%] text-[200px] opacity-[0.05] text-gray-500 rotating-slow">♠</div>
          <div className="absolute bottom-[20%] left-[10%] text-[180px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '2s' }}>♥</div>
          <div className="absolute top-[60%] right-[15%] text-[160px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '4s' }}>♣</div>
          <div className="absolute top-[30%] left-[50%] text-[190px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '6s' }}>♦</div>
        </div>

        <div className="relative z-10">
          {isLoading ? (
            <NewsSkeletonGrid count={6} variant="medium" />
          ) : news.length === 0 ? (
            <Card className="glass border-white/10 p-12 text-center bg-white/5 backdrop-blur-sm">
              <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">
                No se encontraron noticias.
              </p>
              {search && (
                <Button
                  variant="outline"
                  className="mt-4 border-white/20 hover:bg-white/10"
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
        </div>
      </section>
    </div>
  );
}