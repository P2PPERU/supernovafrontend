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
import { ImageUpload } from './image-upload';
import { RichTextEditor } from './rich-text-editor';
import { News } from '@/types';
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

// Schema de validación - CORREGIDO
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
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(news?.imageUrl || null);
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

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
      setCurrentImageUrl(news.imageUrl || null);
    }
  }, [news, reset]);

  const handleFormSubmit = (data: NewsFormData) => {
    // Solo incluir la imagen si hay una nueva
    const submitData: any = {
      ...data,
    };
    
    if (image) {
      submitData.image = image;
    }
    
    onSubmit(submitData);
  };

  const handleSaveAsDraft = () => {
    setValue('status', 'draft');
    handleSubmit(handleFormSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    handleSubmit(handleFormSubmit)();
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !watchedValues.tags.includes(trimmedTag)) {
      setValue('tags', [...watchedValues.tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchedValues.tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      // Si hay una nueva imagen, no mostrar la actual
      setCurrentImageUrl(null);
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Contenido *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? 'Editar' : 'Vista previa'}
                  </Button>
                </div>
                <RichTextEditor
                  value={watchedValues.content}
                  onChange={(value) => setValue('content', value)}
                  placeholder="Escribe el contenido de la noticia..."
                  preview={previewMode}
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
                value={image}
                currentImageUrl={currentImageUrl}
                onChange={handleImageChange}
                onRemove={() => {
                  setImage(null);
                  setCurrentImageUrl(null);
                }}
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
                <Input
                  placeholder="Nueva etiqueta..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
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
          <div className="text-sm text-muted-foreground">
            {mode === 'edit' 
              ? `Editando: ${news?.title}` 
              : 'Los campos marcados con * son obligatorios'
            }
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