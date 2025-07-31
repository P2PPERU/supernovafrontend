'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNewsDetail } from '@/hooks/useNews';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { News } from '@/types';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Newspaper,
  TrendingUp,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Tag,
  Trophy,  // AGREGADO
  Gift,    // AGREGADO
  Zap      // AGREGADO
} from 'lucide-react';

// Icons para categorías
const categoryIcons: Record<string, any> = {
  general: Newspaper,
  tournament: Trophy,
  promotion: Gift,
  update: Zap,
};

// Reading progress bar component
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = (scrollTop / docHeight) * 100;
      setProgress(progressPercent);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-poker-green to-poker-gold"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const { data, isLoading, error } = useNewsDetail(id);
  const news: News | undefined = data?.news;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = news?.title || '';
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      // Aquí podrías mostrar un toast de confirmación
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-poker-green border-t-transparent mx-auto mb-4" />
          <p className="text-gray-400">Cargando noticia...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Noticia no encontrada</h2>
          <p className="text-gray-400 mb-6">
            La noticia que buscas no existe o fue eliminada.
          </p>
          <Button asChild>
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a noticias
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[news.category] || Newspaper;

  return (
    <>
      <ReadingProgress />
      
      <article className="min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {news.imageUrl ? (
            <>
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-poker-green/20 to-poker-purple/20" />
          )}
          
          {/* Back Button */}
          <div className="absolute top-24 left-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="glass border-white/20 backdrop-blur-sm"
              asChild
            >
              <Link href="/news">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl"
              >
                {/* Category & Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="glass border-white/20 backdrop-blur-sm">
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {getCategoryLabel(news.category)}
                  </Badge>
                  {news.featured && (
                    <Badge className="bg-poker-gold text-black">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                  {news.title}
                </h1>

                {/* Summary */}
                {news.summary && (
                  <p className="text-xl text-gray-200 mb-8 max-w-3xl">
                    {news.summary}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={news.author?.profile?.avatar} />
                      <AvatarFallback>
                        {news.author?.username?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{news.author?.username || 'Admin'}</p>
                      <p className="text-sm text-gray-400">
                        {formatRelativeTime(news.publishedAt || news.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(news.publishedAt || news.createdAt)}
                  </span>
                  {news.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {news.readTime} min de lectura
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Floating Actions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20"
            >
              <Button
                variant={liked ? 'default' : 'outline'}
                size="icon"
                className="rounded-full glass border-white/20"
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant={bookmarked ? 'default' : 'outline'}
                size="icon"
                className="rounded-full glass border-white/20"
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full glass border-white/20"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute left-full ml-2 top-0 glass rounded-lg p-2 space-y-1"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('facebook')}
                        className="w-full justify-start"
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('twitter')}
                        className="w-full justify-start"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('linkedin')}
                        className="w-full justify-start"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('copy')}
                        className="w-full justify-start"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Copiar enlace
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </motion.div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-12"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold">Etiquetas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag: string, index: number) => (  // TIPOS AGREGADOS
                    <Badge
                      key={index}
                      variant="outline"
                      className="hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mobile Actions */}
            <div className="lg:hidden mt-8 flex items-center justify-center gap-4">
              <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                Me gusta
              </Button>
              <Button
                variant={bookmarked ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? 'fill-current' : ''}`} />
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>

            <Separator className="my-12" />

            {/* Author Card */}
            <Card className="glass border-white/10 p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={news.author?.profile?.avatar} />
                  <AvatarFallback className="text-xl">
                    {news.author?.username?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {news.author?.username || 'Admin'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {news.author?.role === 'editor' ? 'Editor' : 'Administrador'}
                  </p>
                  <p className="text-gray-300">
                    Miembro del equipo editorial de Supernova. Apasionado por el poker y 
                    las últimas novedades del mundo del gaming.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </article>
    </>
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

// EXPORT DEFAULT AGREGADO
export default NewsDetailPage;