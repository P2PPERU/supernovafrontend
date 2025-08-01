'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { useFeaturedNews } from '@/hooks/useNews';
import { News } from '@/types';
import { NewsCardModern } from '@/components/news/news-card-modern';

export function FeaturedNews() {
  const { data, isLoading } = useFeaturedNews(7); // 1 hero + 3 featured + 3 compact

  if (isLoading) {
    return (
      <section className="py-20 relative bg-gradient-to-b from-background via-background/95 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass animate-pulse">
              <div className="h-4 w-4 rounded-full bg-gray-600" />
              <div className="h-4 w-24 bg-gray-600 rounded" />
            </div>
          </div>
          
          {/* Loading Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const news: News[] = data?.news || [];
  if (news.length === 0) return null;

  const mainNews = news[0];
  const featuredNews = news.slice(1, 4);
  const compactNews = news.slice(4, 7);

  return (
    <section className="py-20 relative bg-gradient-to-b from-background via-background/95 to-background overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-poker-green/10 to-poker-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="h-4 w-4 text-poker-gold animate-pulse" />
            <span className="text-sm font-medium">Lo Último</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mantente <span className="gradient-text">Informado</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Las últimas novedades, torneos y actualizaciones del club
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main featured news - Ocupa 2 columnas */}
          {mainNews && (
            <div className="lg:col-span-2">
              <NewsCardModern news={mainNews} variant="hero" />
            </div>
          )}

          {/* Sidebar con noticias compactas */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <TrendingUp className="h-5 w-5 text-poker-green" />
              <h3 className="text-lg font-semibold">Tendencias</h3>
            </motion.div>

            {compactNews.map((item, index) => (
              <NewsCardModern key={item.id} news={item} variant="compact" index={index} />
            ))}

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass border-white/10 p-6 rounded-xl bg-gradient-to-br from-poker-green/10 to-poker-blue/10"
            >
              <h4 className="font-semibold mb-2">¿Quieres más?</h4>
              <p className="text-sm text-gray-400 mb-4">
                Explora todas nuestras noticias y mantente al día
              </p>
              <Button size="sm" className="w-full bg-poker-green hover:bg-poker-darkGreen text-black" asChild>
                <Link href="/news">
                  Ver todas las noticias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Featured news grid */}
        {featuredNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {featuredNews.map((item, index) => (
              <NewsCardModern key={item.id} news={item} variant="featured" index={index} />
            ))}
          </div>
        )}

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="glass border-white/20 hover:bg-white/10 hover:border-poker-green/50 transition-all"
            asChild
          >
            <Link href="/news">
              Explorar Centro de Noticias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}