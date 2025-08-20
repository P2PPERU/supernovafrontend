// src/app/admin/news/enhanced-editor.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Edit,
  Upload,
  Loader2,
  X,
  Plus,
  FileImage,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

// Cambié el nombre de la interfaz para evitar conflicto
interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

// Definir tipo para toolbar items
interface ToolbarItem {
  type?: 'separator';
  icon?: any;
  command?: string;
  value?: string;
  tooltip?: string;
  custom?: boolean;
}

export function EnhancedEditor({ value, onChange, placeholder, error }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageAlignment, setImageAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [imageSize, setImageSize] = useState<'small' | 'medium' | 'large' | 'full'>('large');

  // Cargar contenido inicial
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Cargar imágenes existentes
  const loadImages = async () => {
    try {
      const response = await uploadService.getImages();
      if (response.images) {
        setUploadedImages(response.images.map(img => ({
          id: img.filename,
          url: img.url,
          filename: img.filename,
          size: img.size,
          uploadedAt: img.uploadedAt
        })));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  // Abrir diálogo de imágenes
  const openImageDialog = () => {
    loadImages();
    setShowImageDialog(true);
  };

  // Ejecutar comando de formato
  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value || undefined);
    handleInput();
  };

  // Manejar cambios en el editor
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Subir imagen al servidor
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB límite
      toast.error('La imagen no debe superar los 10MB');
      return null;
    }

    setIsUploadingImage(true);
    try {
      const response = await uploadService.uploadImage(file);
      
      if (response.success && response.url) {
        const newImage: UploadedImage = {
          id: response.filename,
          url: response.url,
          filename: response.filename,
          size: response.size,
          uploadedAt: new Date().toISOString()
        };
        
        setUploadedImages(prev => [newImage, ...prev]);
        setSelectedImage(response.url);
        toast.success('Imagen subida exitosamente');
        
        return response.url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Insertar imagen en el contenido
  const insertImage = () => {
    const finalUrl = selectedImage || imageUrl;
    if (!finalUrl) {
      toast.error('Por favor selecciona o ingresa una URL de imagen');
      return;
    }

    // Calcular clases según tamaño y alineación
    const sizeClasses = {
      small: 'max-w-xs',
      medium: 'max-w-md',
      large: 'max-w-2xl',
      full: 'w-full'
    };

    const alignClasses = {
      left: 'float-left mr-4',
      center: 'mx-auto block',
      right: 'float-right ml-4'
    };

    // Crear HTML de la imagen con estilos modernos
    const imageHtml = `
      <figure class="my-6 ${alignClasses[imageAlignment]} ${imageAlignment === 'center' ? 'text-center' : ''}">
        <img 
          src="${finalUrl}" 
          alt="${imageAlt || 'Imagen'}" 
          class="${sizeClasses[imageSize]} h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          style="max-width: 100%;"
        />
        ${imageCaption ? `
          <figcaption class="mt-2 text-sm text-gray-500 italic">
            ${imageCaption}
          </figcaption>
        ` : ''}
      </figure>
    `;

    execCommand('insertHTML', imageHtml);
    setShowImageDialog(false);
    resetImageDialog();
  };

  // Resetear diálogo
  const resetImageDialog = () => {
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setSelectedImage('');
    setImageAlignment('center');
    setImageSize('large');
  };

  // Eliminar imagen del servidor
  const handleDeleteImage = async (filename: string) => {
    try {
      await uploadService.deleteImage(filename);
      setUploadedImages(prev => prev.filter(img => img.filename !== filename));
      if (selectedImage === uploadedImages.find(img => img.filename === filename)?.url) {
        setSelectedImage('');
      }
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.error('Error al eliminar la imagen');
    }
  };

  // Manejar drag & drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const url = await handleImageUpload(imageFile);
      if (url) {
        setSelectedImage(url);
      }
    }
  };

  // Toolbar items con tipo correcto
  const toolbarItems: ToolbarItem[] = [
    { icon: Bold, command: 'bold', tooltip: 'Negrita' },
    { icon: Italic, command: 'italic', tooltip: 'Cursiva' },
    { icon: Underline, command: 'underline', tooltip: 'Subrayado' },
    { type: 'separator' },
    { icon: Heading2, command: 'formatBlock', value: 'H2', tooltip: 'Título' },
    { icon: Quote, command: 'formatBlock', value: 'BLOCKQUOTE', tooltip: 'Cita' },
    { type: 'separator' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Lista' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Lista numerada' },
    { type: 'separator' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Alinear izquierda' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Centrar' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Alinear derecha' },
    { type: 'separator' },
    { icon: Link, command: 'createLink', tooltip: 'Enlace' },
    { icon: ImageIcon, command: 'insertImage', tooltip: 'Imagen', custom: true },
    { icon: Code, command: 'code', tooltip: 'Código' },
    { type: 'separator' },
    { icon: Undo, command: 'undo', tooltip: 'Deshacer' },
    { icon: Redo, command: 'redo', tooltip: 'Rehacer' },
  ];

  return (
    <div className={cn("space-y-4", error && "ring-2 ring-red-500 rounded-lg p-1")}>
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor" onClick={() => setIsPreview(false)}>
            <Edit className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setIsPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Vista previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          {/* Toolbar mejorado */}
          <Card className="p-3 bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex flex-wrap items-center gap-1">
              {toolbarItems.map((tool, index) => {
            // Manejar separadores
            if (tool.type === 'separator') {
              return <div key={`separator-${index}`} className="w-px h-6 bg-gray-600 mx-1" />;
            }
            
            // Verificar que tenemos icon y command
            if (!tool.icon || !tool.command) return null;
            
            const Icon = tool.icon;
            const command = tool.command; // Guardar en variable local
            
            return (
              <Button
                key={`button-${index}`}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (tool.custom && command === 'insertImage') {
                openImageDialog();
                  } else if (command === 'createLink') {
                const url = prompt('Ingresa la URL:');
                if (url) execCommand(command, url);
                  } else if (command === 'code') {
                execCommand('formatBlock', 'PRE');
                  } else {
                execCommand(command, tool.value); // Ahora command está garantizado como string
                  }
                }}
                title={tool.tooltip}
                className="h-9 w-9 p-0 hover:bg-white/10 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
              })}
            </div>
          </Card>

          {/* Editor con drag & drop */}
          <Card 
            className="relative overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div
              ref={editorRef}
              contentEditable
              className={cn(
                "min-h-[500px] p-6 focus:outline-none",
                "prose prose-lg dark:prose-invert max-w-none",
                "[&>*]:mb-4 [&>*:last-child]:mb-0",
                "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-lg",
                "[&_a]:text-poker-green [&_a]:underline",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-poker-green [&_blockquote]:pl-4 [&_blockquote]:italic",
                "[&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto",
                "[&_ul]:list-disc [&_ul]:pl-6",
                "[&_ol]:list-decimal [&_ol]:pl-6"
              )}
              onInput={handleInput}
              data-placeholder={placeholder || "Escribe el contenido aquí... Puedes arrastrar imágenes directamente"}
              suppressContentEditableWarning
            />
            
            {/* Indicador de drag & drop */}
            {isUploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-poker-green mx-auto mb-2" />
                  <p className="text-white">Subiendo imagen...</p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="p-6 min-h-[500px]">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400">Nada que mostrar aún...</p>' }}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de imágenes mejorado */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Insertar imagen</DialogTitle>
            <DialogDescription>
              Sube una nueva imagen o selecciona una de la galería
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Subir
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <FileImage className="h-4 w-4 mr-2" />
                Galería
              </TabsTrigger>
              <TabsTrigger value="url">
                <Link className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-poker-green transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    await handleImageUpload(file);
                  }
                }}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-500">
                  Formatos: JPG, PNG, GIF, WebP • Máximo 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleImageUpload(file);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <ScrollArea className="h-[400px] rounded-lg border border-gray-700 p-4">
                <div className="grid grid-cols-3 gap-4">
                  <AnimatePresence>
                    {uploadedImages.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                          "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                          selectedImage === image.url
                            ? "border-poker-green shadow-lg"
                            : "border-transparent hover:border-gray-600"
                        )}
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image.url);
                            }}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(image.filename);
                            }}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-xs text-white truncate">{image.filename}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de la imagen</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Opciones de imagen */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Texto alternativo (Alt)</Label>
              <Input
                id="imageAlt"
                placeholder="Descripción de la imagen"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageCaption">Pie de foto (opcional)</Label>
              <Input
                id="imageCaption"
                placeholder="Texto descriptivo bajo la imagen"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
              />
            </div>
          </div>

          {/* Opciones de tamaño y alineación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tamaño de imagen</Label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large', 'full'] as const).map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={imageSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageSize(size)}
                    className="flex-1"
                  >
                    {size === 'small' && 'Pequeña'}
                    {size === 'medium' && 'Mediana'}
                    {size === 'large' && 'Grande'}
                    {size === 'full' && 'Completa'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alineación</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={imageAlignment === 'left' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageAlignment('left')}
                  className="flex-1"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={imageAlignment === 'center' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageAlignment('center')}
                  className="flex-1"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={imageAlignment === 'right' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setImageAlignment('right')}
                  className="flex-1"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={insertImage}
              disabled={!selectedImage && !imageUrl}
              className="bg-poker-green hover:bg-poker-darkGreen"
            >
              <Plus className="h-4 w-4 mr-2" />
              Insertar imagen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}