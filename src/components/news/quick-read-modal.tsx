'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  ExternalLink,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { News } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface QuickReadModalProps {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasNavigation?: boolean;
}

export function QuickReadModal({ 
  news, 
  isOpen, 
  onClose, 
  onNavigate,
  hasNavigation = false 
}: QuickReadModalProps) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!isOpen || !news) return;

    const handleScroll = (e: any) => {
      const element = e.target;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setReadingProgress(progress);
    };

    return () => setReadingProgress(0);
  }, [isOpen, news]);

  if (!news) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 glass border-white/10 overflow-hidden">
            {/* Progress Bar */}
            <Progress value={readingProgress} className="absolute top-0 left-0 right-0 h-1 z-50" />

            {/* Header */}
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(news.category)}
                    </Badge>
                    {news.featured && (
                      <Badge className="bg-poker-gold text-black text-xs">
                        Destacado
                      </Badge>
                    )}
                  </div>
                  <DialogTitle className="text-2xl font-bold pr-8">
                    {news.title}
                  </DialogTitle>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{news.author?.username || 'Admin'}</span>
                </div>
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
                    {news.views.toLocaleString()}
                  </span>
                )}
              </div>
            </DialogHeader>

            {/* Content */}
            <ScrollArea 
              className="flex-1 px-6 py-4"
              onScroll={(e) => {
                const element = e.currentTarget;
                const scrollTop = element.scrollTop;
                const scrollHeight = element.scrollHeight - element.clientHeight;
                const progress = (scrollTop / scrollHeight) * 100;
                setReadingProgress(progress);
              }}
            >
              {news.imageUrl && (
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {news.summary && (
                <div className="mb-6 p-4 rounded-lg bg-white/5 border-l-4 border-poker-green">
                  <p className="text-lg leading-relaxed">{news.summary}</p>
                </div>
              )}

              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasNavigation && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate?.('prev')}
                        className="glass border-white/20"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate?.('next')}
                        className="glass border-white/20"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Vista rápida
                  </span>
                  <Button asChild className="bg-poker-green hover:bg-poker-darkGreen text-black">
                    <Link href={`/news/${news.id}`}>
                      Leer artículo completo
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
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