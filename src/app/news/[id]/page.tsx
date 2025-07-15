'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNewsDetail, useFeaturedNews } from '@/hooks/useNews';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Link as LinkIcon,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  
  const { data, isLoading, error } = useNewsDetail(newsId);
  const { data: featuredData } = useFeaturedNews(4);
  
  const news = data?.news;
  const relatedNews = featuredData?.news?.filter((item: any) => item.id !== newsId) || [];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = (platform: string) => {
    let url = '';
    const text = news ? `${news.title} - SUPERNOVA` : '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success('Enlace copiado al portapapeles');
        return;
    }
    
    if (url) window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando noticia...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="py-12">
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              No se pudo cargar la noticia.
            </p>
            <div className="text-center">
              <Button onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Inicio</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-foreground">Noticias</Link>
        <span>/</span>
        <span className="text-foreground">{news.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article>
            {/* Header */}
            <header className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={getCategoryVariant(news.category)}>
                  {getCategoryLabel(news.category)}
                </Badge>
                {news.featured && (
                  <Badge className="bg-poker-gold text-black">Destacado</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {news.title}
              </h1>
              
              {news.summary && (
                <p className="text-lg text-muted-foreground mb-4">
                  {news.summary}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>Por {news.author?.username || 'Admin'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(news.publishedAt || news.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatRelativeTime(news.publishedAt || news.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{news.views} vistas</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {news.imageUrl && (
              <div className="relative h-64 md:h-96 w-full mb-6 rounded-lg overflow-hidden">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>

            {/* Share */}
            <Separator className="my-8" />
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Compartir noticia</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Author Card */}
          {news.author && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Sobre el autor</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{news.author.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {news.author.role === 'editor' ? 'Editor' : 'Colaborador'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related News */}
          {relatedNews.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Noticias relacionadas</h3>
                <div className="space-y-4">
                  {relatedNews.slice(0, 3).map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="block group"
                    >
                      <div className="space-y-1">
                        <p className="font-medium line-clamp-2 group-hover:text-poker-green transition-colors">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatRelativeTime(item.publishedAt || item.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/news">
                    Ver todas las noticias
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* CTA Card */}
          <Card className="bg-poker-green text-white">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">¿Quieres recibir noticias?</h3>
              <p className="text-sm mb-4 opacity-90">
                Suscríbete a nuestro boletín y mantente informado de todas las novedades.
              </p>
              <Button 
                variant="secondary" 
                className="w-full bg-white text-poker-green hover:bg-gray-100"
              >
                Suscribirme
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// Helper functions (same as in news page)
function getCategoryVariant(category: string): any {
  switch (category) {
    case 'tournament':
      return 'default';
    case 'promotion':
      return 'secondary';
    case 'update':
      return 'outline';
    default:
      return 'secondary';
  }
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