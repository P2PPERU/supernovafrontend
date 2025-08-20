'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload, ImageFile } from './image-upload';
import { EnhancedEditor } from './enhanced-editor';
import { News } from '@/types';
import { toast } from 'sonner';
import { 
  Save, 
  Send, 
  X, 
  Plus,
  FileText,
  Image as ImageIcon,
  Tag,
  Settings
} from 'lucide-react';

// Schema de validación
const newsFormSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  content: z
    .string()
    .min(50, 'El contenido debe tener al menos 50 caracteres'),
  summary: z
    .string()
    .max(500, 'El resumen no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  category: z.enum(['general', 'tournament', 'promotion', 'update']),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  tags: z.array(z.string()),
});

type NewsFormData = z.infer<typeof newsFormSchema>;

interface NewsFormProps {
  news?: News;
  onSubmit: (data: NewsFormData & { image?: File }) => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export function NewsForm({ news, onSubmit, isLoading = false, mode = 'create' }: NewsFormProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: news?.title || '',
      content: news?.content || '',
      summary: news?.summary || '',
      category: (news?.category || 'general') as 'general' | 'tournament' | 'promotion' | 'update',
      status: (news?.status || 'draft') as 'draft' | 'published' | 'archived',
      featured: news?.featured || false,
      tags: news?.tags || [],
    },
  });

  const watchedValues = watch();

  // Reset form cuando cambia la noticia (útil para edición)
  useEffect(() => {
    if (news) {
      reset({
        title: news.title,
        content: news.content,
        summary: news.summary || '',
        category: news.category as 'general' | 'tournament' | 'promotion' | 'update',
        status: news.status as 'draft' | 'published' | 'archived',
        featured: news.featured,
        tags: news.tags || [],
      });
      
      // Si hay una imagen existente, agregarla al array de images
      if (news.imageUrl) {
        setImages([{
          id: 'existing',
          url: news.imageUrl,
          name: 'Imagen actual',
          size: 0,
          isMain: true,
        }]);
      }
    }
  }, [news, reset]);

  const handleFormSubmit = (data: NewsFormData) => {
    const submitData: any = {
      ...data,
      status: data.status || 'draft',
    };
    
    // Si hay imágenes nuevas, tomar la primera
    const newImages = images.filter(img => img.file);
    if (newImages.length > 0 && newImages[0].file) {
      submitData.image = newImages[0].file;
    }
    
    console.log('📤 Submitting news with status:', submitData.status);
    onSubmit(submitData);
  };

  const handleSaveAsDraft = () => {
    setValue('status', 'draft');
    console.log('⚠️ Guardando como BORRADOR - No será visible en la página pública');
    handleSubmit(handleFormSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    console.log('✅ Publicando noticia - Será visible en la página pública');
    handleSubmit(handleFormSubmit)();
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    
    // Validar longitud del tag
    if (trimmedTag.length < 2) {
      toast.error('El tag debe tener al menos 2 caracteres');
      return;
    }
    
    if (trimmedTag.length > 30) {
      toast.error('El tag no puede tener más de 30 caracteres');
      return;
    }
    
    if (trimmedTag && !watchedValues.tags.includes(trimmedTag)) {
      setValue('tags', [...watchedValues.tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchedValues.tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageChange = (newImages: ImageFile[] | ((prev: ImageFile[]) => ImageFile[])) => {
    if (typeof newImages === 'function') {
      setImages(newImages);
    } else {
      setImages(newImages);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: 'General',
      tournament: 'Torneo',
      promotion: 'Promoción',
      update: 'Actualización',
    };
    return labels[category] || category;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="media">
            <ImageIcon className="h-4 w-4 mr-2" />
            Multimedia
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tag className="h-4 w-4 mr-2" />
            Etiquetas
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Tab: Contenido */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Principal</CardTitle>
              <CardDescription>
                Título, contenido y resumen de la noticia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Título de la noticia"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Resumen (Opcional)</Label>
                <Textarea
                  id="summary"
                  placeholder="Breve descripción de la noticia (máx. 500 caracteres)"
                  rows={3}
                  {...register('summary')}
                  className={errors.summary ? 'border-red-500' : ''}
                />
                {errors.summary && (
                  <p className="text-sm text-red-500">{errors.summary.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {watchedValues.summary?.length || 0} / 500 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <EnhancedEditor
                  value={watchedValues.content}
                  onChange={(value) => setValue('content', value)}
                  placeholder="Escribe el contenido de la noticia... Puedes arrastrar imágenes directamente al editor"
                  error={!!errors.content}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Multimedia */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Imagen Principal</CardTitle>
              <CardDescription>
                Sube una imagen para la noticia (JPG, PNG, GIF, WebP - máx. 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={images}
                currentImageUrl={news?.imageUrl}
                onChange={handleImageChange}
                maxFiles={1}
                allowMultiple={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Etiquetas */}
        <TabsContent value="tags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
              <CardDescription>
                Añade etiquetas para mejorar la búsqueda y categorización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Nueva etiqueta (2-30 caracteres)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className={
                      tagInput.trim().length > 0 && 
                      (tagInput.trim().length < 2 || tagInput.trim().length > 30)
                        ? 'border-red-500' 
                        : ''
                    }
                  />
                  {tagInput.trim().length > 0 && (
                    <p className="text-xs mt-1">
                      {tagInput.trim().length < 2 && (
                        <span className="text-red-500">Mínimo 2 caracteres</span>
                      )}
                      {tagInput.trim().length > 30 && (
                        <span className="text-red-500">Máximo 30 caracteres</span>
                      )}
                      {tagInput.trim().length >= 2 && tagInput.trim().length <= 30 && (
                        <span className="text-green-500">✓ Longitud válida</span>
                      )}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tagInput.trim().length < 2 || tagInput.trim().length > 30}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {watchedValues.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedValues.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configuración */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Publicación</CardTitle>
              <CardDescription>
                Define cómo y cuándo se publicará la noticia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value: 'general' | 'tournament' | 'promotion' | 'update') => setValue('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="tournament">Torneo</SelectItem>
                      <SelectItem value="promotion">Promoción</SelectItem>
                      <SelectItem value="update">Actualización</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado *</Label>
                  <Select
                    value={watchedValues.status}
                    onValueChange={(value: 'draft' | 'published' | 'archived') => setValue('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="featured">Destacar noticia</Label>
                  <p className="text-sm text-muted-foreground">
                    Las noticias destacadas aparecen en la página principal
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={watchedValues.featured}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {mode === 'edit' 
                ? `Editando: ${news?.title}` 
                : 'Los campos marcados con * son obligatorios'
              }
            </p>
            {/* Indicador del estado actual */}
            <div className="flex items-center gap-2 text-xs">
              <span>Estado actual:</span>
              <Badge variant={watchedValues.status === 'published' ? 'default' : 'outline'}>
                {watchedValues.status === 'published' ? 'Publicado' : 
                 watchedValues.status === 'draft' ? 'Borrador' : 'Archivado'}
              </Badge>
              {watchedValues.status === 'draft' && (
                <span className="text-yellow-600">⚠️ No visible en la página pública</span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleSaveAsDraft}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Borrador
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={handlePublish}
              className={watchedValues.status === 'published' ? '' : 'bg-poker-green hover:bg-poker-darkGreen'}
            >
              <Send className="mr-2 h-4 w-4" />
              {watchedValues.status === 'published' ? 'Actualizar' : 'Publicar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
