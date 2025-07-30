'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Eye, Clock, TrendingUp, Newspaper } from 'lucide-react';
import { useFeaturedNews } from '@/hooks/useNews';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { News } from '@/types';
import { motion } from 'framer-motion';

// Interfaz extendida para manejar propiedades opcionales
interface ExtendedNews extends News {
  imageUrl?: string;
  views?: number;
  summary?: string;
}

export function FeaturedNews() {
  const { data, isLoading } = useFeaturedNews(6);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <div className="h-4 w-4 rounded-full bg-gray-600 animate-pulse" />
              <div className="h-4 w-24 bg-gray-600 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const news: ExtendedNews[] = data?.news || [];
  if (news.length === 0) return null;

  const mainNews = news[0];
  const secondaryNews = news.slice(1, 3);
  const additionalNews = news.slice(3, 6);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Newspaper className="h-4 w-4 text-poker-green" />
            <span className="text-sm font-medium">Últimas Noticias</span>
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
              <Card className="glass overflow-hidden h-full group cursor-pointer card-hover">
                <Link href={`/news/${mainNews.id}`}>
                  {mainNews.imageUrl && (
                    <div className="relative h-64 lg:h-96 w-full overflow-hidden">
                      <Image
                        src={mainNews.imageUrl}
                        alt={mainNews.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-poker-gold text-black">
                          Destacado
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(mainNews.publishedAt || mainNews.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {mainNews.views || 0} vistas
                      </span>
                      <Badge variant="outline" className="border-poker-green/50 text-poker-green">
                        {getCategoryLabel(mainNews.category)}
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 group-hover:text-poker-green transition-colors">
                      {mainNews.title}
                    </h3>
                    <p className="text-gray-400 line-clamp-3 mb-4">
                      {mainNews.summary || mainNews.content || ''}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Por {mainNews.author?.username || 'Admin'} • {formatRelativeTime(mainNews.publishedAt || mainNews.createdAt)}
                      </span>
                      <span className="text-poker-green font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Leer más
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          )}

          {/* Secondary news */}
          <div className="space-y-6">
            {secondaryNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass overflow-hidden group cursor-pointer card-hover">
                  <Link href={`/news/${item.id}`}>
                    <div className="flex gap-4 p-4">
                      {item.imageUrl && (
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(item.category)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(item.publishedAt || item.createdAt)}
                          </span>
                        </div>
                        <h4 className="font-semibold line-clamp-2 group-hover:text-poker-green transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                          {item.summary || item.content || ''}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="glass p-6 bg-gradient-to-br from-poker-green/10 to-poker-blue/10">
                <TrendingUp className="h-8 w-8 text-poker-green mb-3" />
                <h4 className="font-semibold mb-2">Mantente Actualizado</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Suscríbete para recibir las últimas noticias y ofertas exclusivas.
                </p>
                <Button size="sm" className="w-full bg-poker-green hover:bg-poker-darkGreen">
                  Suscribirme
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Additional news cards */}
        {additionalNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {additionalNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass overflow-hidden h-full group cursor-pointer card-hover">
                  <Link href={`/news/${item.id}`}>
                    {item.imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
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
                        {item.summary || item.content || ''}
                      </p>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
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
            className="glass border-poker-green/50 hover:bg-poker-green/10"
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
  switch (category) {
    case 'tournament':
      return 'Torneo';
    case 'promotion':
      return 'Promoción';
    case 'update':
      return 'Actualización';
    case 'general':
      return 'General';
    default:
      return category;
  }
}