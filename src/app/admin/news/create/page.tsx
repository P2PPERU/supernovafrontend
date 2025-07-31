'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewsForm } from '../news-form';
import { useCreateNews, useAdminNewsDetail } from '@/hooks/admin/useNews';
import { 
  ArrowLeft, 
  Newspaper, 
  Loader2,
  Home,
  ChevronRight 
} from 'lucide-react';

export default function CreateNewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createNews = useCreateNews();
  
  // Verificar si estamos duplicando una noticia
  const duplicateId = searchParams.get('duplicate');
  const { data: duplicateData, isLoading: isDuplicateLoading } = useAdminNewsDetail(duplicateId || '');

  const handleSubmit = (data: any) => {
    createNews.mutate(data);
  };

  const handleCancel = () => {
    router.push('/admin/news');
  };

  // Preparar datos para duplicación
  const duplicateNews = duplicateId && duplicateData?.news ? (() => {
    const { id, ...newsWithoutId } = duplicateData.news;
    return {
      id: '', // Provide a dummy id for the form
      ...newsWithoutId,
      title: `${duplicateData.news.title} (Copia)`,
      status: 'draft' as const,
    };
  })() : undefined;

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
        <span className="text-foreground font-medium">
          {duplicateId ? 'Duplicar Noticia' : 'Nueva Noticia'}
        </span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
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
              {duplicateId ? 'Duplicar Noticia' : 'Nueva Noticia'}
            </h1>
            <p className="text-muted-foreground">
              {duplicateId 
                ? 'Crea una nueva noticia basada en una existente'
                : 'Crea una nueva noticia para el blog'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg">
          {isDuplicateLoading ? (
            <CardContent className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-poker-green mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando noticia a duplicar...</p>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="border-b bg-muted/50">
                <CardTitle>
                  {duplicateId ? 'Información de la Noticia Duplicada' : 'Información de la Noticia'}
                </CardTitle>
                <CardDescription>
                  Completa todos los campos requeridos para crear la noticia.
                  {duplicateId && ' Los datos han sido copiados de la noticia original.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <NewsForm
                  news={duplicateNews}
                  onSubmit={handleSubmit}
                  isLoading={createNews.isPending}
                  mode="create"
                />
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4"
      >
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Consejos para crear buenas noticias
        </h3>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>• Usa títulos descriptivos y atractivos (máximo 200 caracteres)</li>
          <li>• El resumen debe captar la atención en pocas palabras</li>
          <li>• Incluye imágenes de alta calidad (máximo 5MB)</li>
          <li>• Etiqueta correctamente para mejorar la búsqueda</li>
          <li>• Revisa el contenido antes de publicar</li>
        </ul>
      </motion.div>
    </div>
  );
}