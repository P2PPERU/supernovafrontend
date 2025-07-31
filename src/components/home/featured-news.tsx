'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Eye, Clock, TrendingUp, Newspaper, Trophy, Gift, Zap } from 'lucide-react';
import { useFeaturedNews } from '@/hooks/useNews';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { News } from '@/types';

// Icons para categorías
const categoryIcons: Record<string, any> = {
  general: Newspaper,
  tournament: Trophy,
  promotion: Gift,
  update: Zap,
};

export function FeaturedNews() {
  const { data, isLoading } = useFeaturedNews(6);

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
  const secondaryNews = news.slice(1, 3);
  const additionalNews = news.slice(3, 6);

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
            <TrendingUp className="h-4 w-4 text-poker-green" />
            <span className="text-sm font-medium">Lo Último</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mantente <span className="gradient-text">Informado</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Las últimas novedades, torneos y actualizaciones del club
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main featured news */}
          {mainNews && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="glass border-white/10 overflow-hidden h-full group cursor-pointer hover:shadow-2xl transition-all duration-500">
                <Link href={`/news/${mainNews.id}`}>
                  <div className="relative h-64 lg:h-96 w-full overflow-hidden">
                    {mainNews.imageUrl ? (
                      <>
                        <Image
                          src={mainNews.imageUrl}
                          alt={mainNews.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      </>
                    ) : (
                      <div className="h-full bg-gradient-to-br from-poker-green/20 to-poker-purple/20 flex items-center justify-center">
                        <Newspaper className="h-24 w-24 text-gray-600" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-poker-gold text-black shadow-lg">
                        Destacado
                      </Badge>
                      <Badge variant="outline" className="glass border-white/20 backdrop-blur-sm">
                        {getCategoryLabel(mainNews.category)}
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-white group-hover:text-poker-green transition-colors">
                        {mainNews.title}
                      </h3>
                      <p className="text-gray-200 line-clamp-2 mb-4">
                        {mainNews.summary || mainNews.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(mainNews.publishedAt || mainNews.createdAt)}
                          </span>
                          {mainNews.views && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {mainNews.views.toLocaleString()} vistas
                            </span>
                          )}
                        </div>
                        <span className="text-poker-green font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Leer más
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          )}

          {/* Secondary news */}
          <div className="space-y-6">
            {secondaryNews.map((item, index) => {
              const CategoryIcon = categoryIcons[item.category] || Newspaper;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass border-white/10 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <Link href={`/news/${item.id}`}>
                      <div className="flex gap-4 p-4">
                        {item.imageUrl ? (
                          <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center flex-shrink-0">
                            <CategoryIcon className="h-12 w-12 text-gray-600" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {getCategoryLabel(item.category)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(item.publishedAt || item.createdAt)}
                            </span>
                          </div>
                          <h4 className="font-semibold line-clamp-2 group-hover:text-poker-green transition-colors">
                            {item.title}
                          </h4>
                          {item.readTime && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.readTime} min de lectura
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-white/10 p-6 bg-gradient-to-br from-poker-green/10 to-poker-blue/10">
                <TrendingUp className="h-8 w-8 text-poker-green mb-3" />
                <h4 className="font-semibold mb-2">Mantente Actualizado</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Suscríbete para recibir las últimas noticias y ofertas exclusivas.
                </p>
                <Button size="sm" className="w-full bg-poker-green hover:bg-poker-darkGreen text-black">
                  Suscribirme
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Additional news cards */}
        {additionalNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {additionalNews.map((item, index) => {
              const CategoryIcon = categoryIcons[item.category] || Newspaper;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass border-white/10 overflow-hidden h-full group cursor-pointer hover:shadow-lg hover:border-poker-green/30 transition-all duration-300">
                    <Link href={`/news/${item.id}`}>
                      {item.imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {getCategoryLabel(item.category)}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(item.publishedAt || item.createdAt)}
                          </span>
                        </div>
                        <h4 className="font-semibold line-clamp-2 mb-2 group-hover:text-poker-green transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-3">
                          {item.summary || item.content}
                        </p>
                      </div>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="glass border-white/20 hover:bg-white/10 hover:border-poker-green/50 transition-all"
            asChild
          >
            <Link href="/news">
              Ver Todas las Noticias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    general: 'General',
    tournament: 'Torneo',
    promotion: 'Promoción',
    update: 'Actualización',
  };
  return categories[category] || category;
}