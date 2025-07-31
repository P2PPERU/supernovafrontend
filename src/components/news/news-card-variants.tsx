'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Tag, TrendingUp, Newspaper, Trophy, Gift, Zap } from 'lucide-react';
import { News } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

const categoryIcons: Record<string, any> = {
  general: Newspaper,
  tournament: Trophy,
  promotion: Gift,
  update: Zap,
};

// Large Featured Card
export function NewsCardLarge({ news, horizontal = false }: { news: News; horizontal?: boolean }) {
  const CategoryIcon = categoryIcons[news.category] || Newspaper;

  return (
    <Link href={`/news/${news.id}`}>
      <Card className={`glass border-white/10 overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full ${horizontal ? '' : ''}`}>
        <div className={`${horizontal ? 'grid grid-cols-1 lg:grid-cols-2' : ''}`}>
          <div className={`relative ${horizontal ? 'h-64 lg:h-full' : 'h-64 lg:h-96'} overflow-hidden`}>
            {news.imageUrl ? (
              <>
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </>
            ) : (
              <div className="h-full bg-gradient-to-br from-poker-green/20 to-poker-purple/20 flex items-center justify-center">
                <CategoryIcon className="h-24 w-24 text-gray-600" />
              </div>
            )}
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex gap-2 mb-3">
                {news.featured && (
                  <Badge className="bg-poker-gold text-black">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Destacado
                  </Badge>
                )}
                <Badge className="glass border-white/20 backdrop-blur-sm">
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {getCategoryLabel(news.category)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className={`p-6 lg:p-8 ${horizontal ? 'flex flex-col justify-between' : ''}`}>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-poker-green transition-colors">
                {news.title}
              </h2>
              {news.summary && (
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {news.summary}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(news.publishedAt || news.createdAt)}
                </span>
                {news.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {news.readTime} min
                  </span>
                )}
                {news.views && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {news.views.toLocaleString()}
                  </span>
                )}
              </div>
              
              <motion.span 
                className="text-poker-green font-medium"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Leer más →
              </motion.span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Medium Card
export function NewsCardMedium({ news }: { news: News }) {
  const CategoryIcon = categoryIcons[news.category] || Newspaper;

  return (
    <Link href={`/news/${news.id}`}>
      <Card className="glass border-white/10 overflow-hidden h-full group hover:shadow-xl transition-all duration-300">
        {news.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="glass border-white/20 backdrop-blur-sm">
                <CategoryIcon className="h-3 w-3 mr-1" />
                {getCategoryLabel(news.category)}
              </Badge>
            </div>
          </div>
        )}
        
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-poker-green transition-colors">
            {news.title}
          </h3>
          {news.summary && (
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {news.summary}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(news.publishedAt || news.createdAt)}
              </span>
              {news.views && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {news.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Small Card
export function NewsCardSmall({ news }: { news: News }) {
  const CategoryIcon = categoryIcons[news.category] || Newspaper;

  return (
    <Link href={`/news/${news.id}`}>
      <Card className="glass border-white/10 overflow-hidden h-full group hover:shadow-lg transition-all duration-300 hover:border-poker-green/30">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              <CategoryIcon className="h-3 w-3 mr-1" />
              {getCategoryLabel(news.category)}
            </Badge>
            {news.tags && news.tags.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {news.tags[0]}
              </Badge>
            )}
          </div>
          
          <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-poker-green transition-colors">
            {news.title}
          </h3>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{formatRelativeTime(news.publishedAt || news.createdAt)}</span>
            {news.readTime && (
              <>
                <span>•</span>
                <span>{news.readTime} min</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

// List Card (Horizontal Layout)
export function NewsCardList({ news }: { news: News }) {
  const CategoryIcon = categoryIcons[news.category] || Newspaper;

  return (
    <Link href={`/news/${news.id}`}>
      <Card className="glass border-white/10 overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="flex gap-4 p-4">
          {news.imageUrl ? (
            <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={news.imageUrl}
                alt={news.title}
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
                {getCategoryLabel(news.category)}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(news.publishedAt || news.createdAt)}
              </span>
            </div>
            <h4 className="font-semibold line-clamp-2 group-hover:text-poker-green transition-colors">
              {news.title}
            </h4>
            {news.readTime && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {news.readTime} min de lectura
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
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