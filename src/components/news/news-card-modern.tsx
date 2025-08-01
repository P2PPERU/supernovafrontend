// src/components/news/news-card-modern.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Sparkles, Zap, Gift, Trophy, Megaphone } from 'lucide-react';
import { News } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

// Configuración de categorías con colores e iconos
const categoryConfig = {
  general: {
    label: 'General',
    icon: Megaphone,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  tournament: {
    label: 'Torneo',
    icon: Trophy,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  promotion: {
    label: 'Promoción',
    icon: Gift,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  update: {
    label: 'Actualización',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
};

interface NewsCardModernProps {
  news: News;
  variant?: 'hero' | 'featured' | 'default' | 'compact';
  index?: number;
}

export function NewsCardModern({ news, variant = 'default', index = 0 }: NewsCardModernProps) {
  const config = categoryConfig[news.category as keyof typeof categoryConfig] || categoryConfig.general;
  const CategoryIcon = config.icon;

  // Renderizar según la variante
  switch (variant) {
    case 'hero':
      return <HeroCard news={news} config={config} />;
    case 'featured':
      return <FeaturedCard news={news} config={config} index={index} />;
    case 'compact':
      return <CompactCard news={news} config={config} index={index} />;
    default:
      return <DefaultCard news={news} config={config} index={index} />;
  }
}

// Tarjeta Hero - Para la noticia principal
function HeroCard({ news, config }: { news: News; config: any }) {
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <Link href={`/news/${news.id}`}>
        <Card className="relative h-[500px] overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-gray-800">
          {/* Imagen de fondo */}
          {news.imageUrl ? (
            <>
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <CategoryIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 text-white/5" />
            </div>
          )}

          {/* Contenido */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
            {/* Badge de categoría */}
            <div className="mb-4">
              <Badge className={`${config.bgColor} ${config.borderColor} border backdrop-blur-sm`}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>

            {/* Título */}
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 line-clamp-3">
              {news.title}
            </h2>

            {/* Resumen */}
            {news.summary && (
              <p className="text-lg text-gray-200 mb-6 line-clamp-2 max-w-3xl">
                {news.summary}
              </p>
            )}

            {/* Fecha */}
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatRelativeTime(news.publishedAt || news.createdAt)}</span>
            </div>

            {/* Efecto de hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// Tarjeta Featured - Para noticias destacadas
function FeaturedCard({ news, config, index }: { news: News; config: any; index: number }) {
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/news/${news.id}`}>
        <Card className="h-full overflow-hidden border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          {/* Imagen */}
          <div className="relative h-48 overflow-hidden">
            {news.imageUrl ? (
              <>
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </>
            ) : (
              <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <CategoryIcon className="h-16 w-16 text-white/10" />
              </div>
            )}

            {/* Badge flotante */}
            <div className="absolute top-4 left-4">
              <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 shadow-lg`}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-poker-green transition-colors">
              {news.title}
            </h3>
            
            {news.summary && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {news.summary}
              </p>
            )}

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeTime(news.publishedAt || news.createdAt)}</span>
            </div>
          </div>

          {/* Indicador de hover */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-poker-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </Link>
    </motion.div>
  );
}

// Tarjeta Default - Para grid general
function DefaultCard({ news, config, index }: { news: News; config: any; index: number }) {
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/news/${news.id}`}>
        <Card className="overflow-hidden border-0 bg-gray-900/30 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300">
          <div className="flex gap-4 p-4">
            {/* Imagen thumbnail */}
            <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
              {news.imageUrl ? (
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <CategoryIcon className="h-8 w-8 text-white/20" />
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`text-xs ${config.borderColor} ${config.bgColor}`}>
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>

              <h3 className="font-semibold line-clamp-2 group-hover:text-poker-green transition-colors mb-2">
                {news.title}
              </h3>

              <span className="text-xs text-gray-500">
                {formatRelativeTime(news.publishedAt || news.createdAt)}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// Tarjeta Compact - Para listas compactas
function CompactCard({ news, config, index }: { news: News; config: any; index: number }) {
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/news/${news.id}`}>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900/30 transition-all duration-200">
          {/* Icono de categoría */}
          <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
            <CategoryIcon className="h-4 w-4" />
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium line-clamp-1 group-hover:text-poker-green transition-colors">
              {news.title}
            </h4>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(news.publishedAt || news.createdAt)}
            </span>
          </div>

          {/* Indicador de hover */}
          <div className="w-1 h-8 bg-gradient-to-b from-transparent via-poker-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </Link>
    </motion.div>
  );
}