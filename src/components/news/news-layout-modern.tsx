// src/components/news/news-layout-modern.tsx
'use client';

import { News } from '@/types';
import { NewsCardModern } from './news-card-modern';
import { motion } from 'framer-motion';

interface NewsLayoutModernProps {
  news: News[];
  featuredNews?: News;
}

export function NewsLayoutModern({ news, featuredNews }: NewsLayoutModernProps) {
  // Separar las noticias por secciones
  const heroNews = featuredNews || news[0];
  const featuredSection = news.slice(1, 4);
  const defaultSection = news.slice(4, 10);
  const compactSection = news.slice(10);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {heroNews && (
        <section>
          <NewsCardModern news={heroNews} variant="hero" />
        </section>
      )}

      {/* Featured Section - Grid de 3 columnas */}
      {featuredSection.length > 0 && (
        <section>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold mb-6 flex items-center gap-2"
          >
            <div className="h-8 w-1 bg-gradient-to-b from-poker-green to-poker-blue" />
            Noticias Destacadas
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSection.map((item, index) => (
              <NewsCardModern key={item.id} news={item} variant="featured" index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Main Content Area con Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Noticias principales */}
        <div className="lg:col-span-2 space-y-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold mb-4 flex items-center gap-2"
          >
            <div className="h-6 w-1 bg-gradient-to-b from-poker-purple to-poker-red" />
            Más Noticias
          </motion.h2>
          {defaultSection.map((item, index) => (
            <NewsCardModern key={item.id} news={item} variant="default" index={index} />
          ))}
        </div>

        {/* Sidebar con noticias compactas */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-4"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="h-5 w-1 bg-gradient-to-b from-poker-gold to-yellow-600" />
              Últimas Actualizaciones
            </h3>
            <div className="space-y-2">
              {compactSection.map((item, index) => (
                <NewsCardModern key={item.id} news={item} variant="compact" index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}