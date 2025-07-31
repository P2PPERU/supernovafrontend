'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Eye, TrendingUp, Sparkles } from 'lucide-react';
import { News } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

interface NewsHeroProps {
  news: News;
  showStats?: boolean;
}

export function NewsHero({ news, showStats = true }: NewsHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative group"
    >
      <Link href={`/news/${news.id}`}>
        <Card className="relative h-[70vh] min-h-[600px] overflow-hidden border-0">
          {/* Background Image */}
          {news.imageUrl ? (
            <>
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-poker-green/20 to-poker-purple/20" />
          )}

          {/* Animated Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-poker-green rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-poker-purple rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl"
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge className="bg-poker-gold text-black shadow-lg shadow-poker-gold/30 animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Destacado
                  </Badge>
                  {news.featured && (
                    <Badge className="glass border-white/20 backdrop-blur-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <Badge variant="outline" className="glass border-white/20 backdrop-blur-sm">
                    {getCategoryLabel(news.category)}
                  </Badge>
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                >
                  {news.title}
                </motion.h1>

                {/* Summary */}
                {news.summary && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-gray-200 mb-8 max-w-3xl line-clamp-3"
                  >
                    {news.summary}
                  </motion.p>
                )}

                {/* Meta Info */}
                {showStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-wrap items-center gap-6 text-gray-300"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {news.author?.username?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{news.author?.username || 'Admin'}</p>
                        <p className="text-xs text-gray-400">{formatRelativeTime(news.publishedAt || news.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(news.publishedAt || news.createdAt)}
                      </span>
                      {news.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {news.readTime} min
                        </span>
                      )}
                      {news.views && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {news.views.toLocaleString()} vistas
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
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