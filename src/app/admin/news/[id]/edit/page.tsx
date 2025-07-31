'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { NewsForm } from '../../news-form';
import { useAdminNewsDetail, useUpdateNews } from '@/hooks/admin/useNews';
import { 
  ArrowLeft, 
  Newspaper, 
  Loader2,
  Home,
  ChevronRight,
  AlertCircle,
  Calendar,
  User,
  Eye,
  Clock,
  ExternalLink
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data, isLoading, error } = useAdminNewsDetail(id);
  const updateNews = useUpdateNews();
  
  const news = data?.news;

  const handleSubmit = (formData: any) => {
    updateNews.mutate({ id, data: formData });
  };

  const handleCancel = () => {
    router.push('/admin/news');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Breadcrumbs */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Skeleton Header */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* Skeleton Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-muted/50">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !news) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mt-20"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al cargar la noticia</AlertTitle>
            <AlertDescription>
              {error?.message || 'La noticia que buscas no existe o fue eliminada.'}
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={handleCancel}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link 
          href="/admin" 
          className="hover:text-foreground transition-colors flex items-center"
        >
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link 
          href="/admin/news" 
          className="hover:text-foreground transition-colors"
        >
          Noticias
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium truncate max-w-xs">
          {news.title}
        </span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Newspaper className="h-8 w-8 text-poker-green" />
                Editar Noticia
              </h1>
              <p className="text-muted-foreground">
                Modifica el contenido y configuración de la noticia
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/news/${news.id}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Noticia
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="border-0 shadow-sm bg-muted/50">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(news.status)} text-white`}>
                  {news.status === 'published' ? 'Publicado' : 
                   news.status === 'draft' ? 'Borrador' : 'Archivado'}
                </Badge>
                {news.featured && (
                  <Badge className="bg-poker-gold text-black">
                    Destacado
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Autor:</span>
                <span className="font-medium text-foreground">
                  {news.author?.username || 'Sistema'}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Creado:</span>
                <span className="font-medium text-foreground">
                  {formatDate(news.createdAt)}
                </span>
              </div>
              
              {news.publishedAt && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Publicado:</span>
                  <span className="font-medium text-foreground">
                    {formatRelativeTime(news.publishedAt)}
                  </span>
                </div>
              )}
              
              {news.views !== undefined && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>Vistas:</span>
                  <span className="font-medium text-foreground">
                    {news.views.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-muted/50">
            <CardTitle>Información de la Noticia</CardTitle>
            <CardDescription>
              Actualiza el contenido y configuración. Los cambios se guardarán según el estado seleccionado.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <NewsForm
              news={news}
              onSubmit={handleSubmit}
              isLoading={updateNews.isPending}
              mode="edit"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Log (opcional) */}
      {news.updatedAt !== news.createdAt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">
              Última modificación: {formatDate(news.updatedAt)} - {formatRelativeTime(news.updatedAt)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}