'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp } from 'lucide-react';
import { News } from '@/types';
import Link from 'next/link';

interface NewsTickerProps {
  news: News[];
  speed?: number; // seconds per item
}

export function NewsTicker({ news, speed = 5 }: NewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [news.length, speed]);

  if (news.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-poker-green/10 to-poker-purple/10 backdrop-blur-sm border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Zap className="h-5 w-5 text-poker-gold animate-pulse" />
              <div className="absolute inset-0 bg-poker-gold/30 rounded-full blur-xl" />
            </div>
            <span className="font-semibold text-poker-gold">Breaking</span>
          </div>

          {/* Ticker Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <Link 
                  href={`/news/${news[currentIndex].id}`}
                  className="flex items-center gap-3 hover:text-poker-green transition-colors group"
                >
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {getCategoryLabel(news[currentIndex].category)}
                  </Badge>
                  <span className="font-medium group-hover:underline">
                    {news[currentIndex].title}
                  </span>
                  <span className="text-sm text-gray-500">
                    hace {getTimeAgo(news[currentIndex].publishedAt || news[currentIndex].createdAt)}
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex gap-1 flex-shrink-0">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? 'w-6 bg-poker-green' 
                    : 'w-1.5 bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
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

function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'unos segundos';
  if (minutes < 60) return `${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} horas`;
  const days = Math.floor(hours / 24);
  return `${days} días`;
}