'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
  X  // AGREGADO: Importar X
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

interface ModernEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

interface ImageGalleryItem {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

// AGREGADO: Tipo para toolbar items
interface ToolbarItem {
  icon?: any;
  command?: string;
  value?: string;
  tooltip?: string;
  custom?: boolean;
  type?: 'separator';
}

export function ModernEditor({ value, onChange, placeholder, error }: ModernEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageGallery, setImageGallery] = useState<ImageGalleryItem[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar contenido inicial
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Cargar galería de imágenes
  const loadImageGallery = async () => {
    try {
      console.log('Loading image gallery...');
      const response = await uploadService.getImages();
      console.log('Gallery response:', response);
      
      if (response.images && response.images.length > 0) {
        console.log('Images loaded:', response.images);
        setImageGallery(response.images);
      } else {
        console.log('No images found');
        setImageGallery([]);
      }
    } catch (error) {
      console.error('Error loading image gallery:', error);
      setImageGallery([]);
    }
  };

  // Abrir diálogo de imágenes
  const openImageDialog = () => {
    loadImageGallery();
    setShowImageDialog(true);
  };

  // Ejecutar comando de formato
  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value || undefined); // CORREGIDO: manejar undefined
    handleInput();
  };

  // Manejar cambios en el editor
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Insertar imagen
  const insertImage = () => {
    const finalUrl = selectedGalleryImage || imageUrl;
    if (finalUrl) {
      const html = `<img src="${finalUrl}" alt="${imageAlt}" class="max-w-full h-auto rounded-lg my-4" />`;
      execCommand('insertHTML', html);
      setShowImageDialog(false);
      resetImageDialog();
    }
  };

  // Resetear diálogo
  const resetImageDialog = () => {
    setImageUrl('');
    setImageAlt('');
    setSelectedGalleryImage('');
  };

  // Manejar subida de imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await uploadService.uploadImage(file);
      console.log('Image uploaded:', response);
      
      if (response.success && response.url) {
        setSelectedGalleryImage(response.url);
        await loadImageGallery(); // Recargar galería
        toast.success('Imagen subida exitosamente');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Eliminar imagen de la galería
  const handleDeleteImage = async (filename: string) => {
    try {
      await uploadService.deleteImage(filename);
      await loadImageGallery();
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.error('Error al eliminar la imagen');
    }
  };

  // Toolbar con tipo correcto
  const toolbar: ToolbarItem[] = [
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
          {/* Toolbar */}
          <Card className="p-2">
            <div className="flex flex-wrap items-center gap-1">
              {toolbar.map((tool, index) => {
                // CORREGIDO: manejar separadores
                if (tool.type === 'separator') {
                  return <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />;
                }
                
                // CORREGIDO: verificar que icon existe
                if (!tool.icon || !tool.command) return null;
                
                const Icon = tool.icon;
                return (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (tool.custom && tool.command === 'insertImage') {
                        openImageDialog();
                      } else if (tool.command === 'createLink') {
                        const url = prompt('Ingresa la URL:');
                        if (url) execCommand(tool.command, url);
                      } else if (tool.command === 'code') {
                        execCommand('formatBlock', 'PRE');
                      } else {
                        execCommand(tool.command!, tool.value); // CORREGIDO: usar ! porque ya verificamos que existe
                      }
                    }}
                    title={tool.tooltip}
                    className="h-8 w-8 p-0"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* Editor */}
          <Card>
            <div
              ref={editorRef}
              contentEditable
              className={cn(
                "min-h-[400px] p-4 focus:outline-none prose prose-sm dark:prose-invert max-w-none",
                "[&>*]:mb-4 [&>*:last-child]:mb-0",
                "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg",
                "[&_a]:text-poker-green [&_a]:underline",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-poker-green [&_blockquote]:pl-4",
                "[&_pre]:bg-gray-100 [&_pre]:dark:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg",
                "[&_ul]:list-disc [&_ul]:pl-6",
                "[&_ol]:list-decimal [&_ol]:pl-6"
              )}
              onInput={handleInput}
              data-placeholder={placeholder || "Escribe el contenido aquí..."}
              suppressContentEditableWarning
            />
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="p-6">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400">Nada que mostrar aún...</p>' }}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de imágenes */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Insertar imagen</DialogTitle>
            <DialogDescription>
              Selecciona una imagen de la galería o ingresa una URL
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="gallery" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery">Galería</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-4">
              {/* Botón de subir */}
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir nueva imagen
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Galería */}
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-4 gap-4">
                  {imageGallery.map((image) => {
                    console.log('Image URL:', image.url); // Debug para ver las URLs
                    return (
                      <div
                        key={image.filename}
                        className={cn(
                          "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                          selectedGalleryImage === image.url
                            ? "border-poker-green"
                            : "border-transparent hover:border-gray-300"
                        )}
                        onClick={() => {
                          console.log('Selected image:', image.url); // Debug
                          setSelectedGalleryImage(image.url);
                        }}
                      >
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-24 object-cover"
                          onError={(e) => {
                            console.error('Error loading image:', image.url);
                            e.currentTarget.src = '/placeholder-image.png'; // Imagen de respaldo
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.filename);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
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

          <div className="space-y-2">
            <Label htmlFor="imageAlt">Texto alternativo (Alt)</Label>
            <Input
              id="imageAlt"
              placeholder="Descripción de la imagen"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={insertImage}
              disabled={!selectedGalleryImage && !imageUrl}
            >
              Insertar imagen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}