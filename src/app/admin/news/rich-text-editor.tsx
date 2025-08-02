'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Link,
  Heading2,
  Heading3,
  Code,
  Eye,
  Edit,
  Image as ImageIcon,
  Youtube,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Maximize,
  X,
  Check,
  Upload,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { uploadService } from '@/services/upload.service';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  preview?: boolean;
  error?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

interface ToolbarButton {
  icon: any;
  command: string;
  tooltip: string;
  value?: string;
  showDialog?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  preview = false,
  error = false,
  onImageUpload
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Toolbar principal
  const mainToolbar: ToolbarButton[] = [
    { icon: Bold, command: 'bold', tooltip: 'Negrita (Ctrl+B)' },
    { icon: Italic, command: 'italic', tooltip: 'Cursiva (Ctrl+I)' },
    { icon: Underline, command: 'underline', tooltip: 'Subrayado (Ctrl+U)' },
    { icon: null, command: 'separator', tooltip: '' },
    { icon: Heading2, command: 'formatBlock', tooltip: 'Título 2', value: 'h2' },
    { icon: Heading3, command: 'formatBlock', tooltip: 'Título 3', value: 'h3' },
    { icon: Quote, command: 'formatBlock', tooltip: 'Cita', value: 'blockquote' },
    { icon: null, command: 'separator', tooltip: '' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Lista' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Lista numerada' },
    { icon: null, command: 'separator', tooltip: '' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Alinear izquierda' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Centrar' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Alinear derecha' },
    { icon: null, command: 'separator', tooltip: '' },
    { icon: Link, command: 'createLink', tooltip: 'Enlace', showDialog: true },
    { icon: ImageIcon, command: 'insertImage', tooltip: 'Imagen', showDialog: true },
    { icon: Youtube, command: 'insertVideo', tooltip: 'Video', showDialog: true },
    { icon: Table, command: 'insertTable', tooltip: 'Tabla' },
    { icon: Code, command: 'code', tooltip: 'Código' },
    { icon: null, command: 'separator', tooltip: '' },
    { icon: Undo, command: 'undo', tooltip: 'Deshacer' },
    { icon: Redo, command: 'redo', tooltip: 'Rehacer' },
  ];

  // Actualizar contadores
  useEffect(() => {
    const text = editorRef.current?.innerText || '';
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
    setCharCount(text.length);
  }, [value]);

  // Actualizar formatos activos
  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
    if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');
    if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft');
    if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter');
    if (document.queryCommandState('justifyRight')) formats.add('justifyRight');
    
    setActiveFormats(formats);
  };

  // Ejecutar comando
  const execCommand = (command: string, value?: string) => {
    if (command === 'separator') return;

    if (command === 'createLink') {
      const selection = window.getSelection();
      setSelectedText(selection?.toString() || '');
      setShowLinkDialog(true);
      return;
    }

    if (command === 'insertImage') {
      setShowImageDialog(true);
      return;
    }

    if (command === 'insertVideo') {
      setShowVideoDialog(true);
      return;
    }

    if (command === 'insertTable') {
      insertTable();
      return;
    }

    if (command === 'code') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const code = document.createElement('code');
        code.className = 'bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm';
        code.textContent = selection.toString();
        range.deleteContents();
        range.insertNode(code);
      }
      return;
    }

    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  };

  // Insertar tabla
  const insertTable = () => {
    const table = `
      <table class="w-full border-collapse border border-gray-700 my-4">
        <thead>
          <tr class="bg-gray-800">
            <th class="border border-gray-700 p-2">Encabezado 1</th>
            <th class="border border-gray-700 p-2">Encabezado 2</th>
            <th class="border border-gray-700 p-2">Encabezado 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-700 p-2">Celda 1</td>
            <td class="border border-gray-700 p-2">Celda 2</td>
            <td class="border border-gray-700 p-2">Celda 3</td>
          </tr>
        </tbody>
      </table>
    `;
    document.execCommand('insertHTML', false, table);
  };

  // Insertar enlace
  const insertLink = () => {
    if (linkUrl) {
      const html = selectedText 
        ? `<a href="${linkUrl}" target="_blank" class="text-poker-green hover:underline">${linkText || selectedText}</a>`
        : `<a href="${linkUrl}" target="_blank" class="text-poker-green hover:underline">${linkText || linkUrl}</a>`;
      
      document.execCommand('insertHTML', false, html);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      editorRef.current?.focus();
    }
  };

  // Insertar imagen
  const insertImage = () => {
    if (imageUrl) {
      const html = `
        <figure class="my-4">
          <img src="${imageUrl}" alt="${imageAlt}" class="w-full rounded-lg" />
          ${imageAlt ? `<figcaption class="text-sm text-gray-400 mt-2 text-center">${imageAlt}</figcaption>` : ''}
        </figure>
      `;
      document.execCommand('insertHTML', false, html);
      setShowImageDialog(false);
      setImageUrl('');
      setImageAlt('');
      editorRef.current?.focus();
    }
  };

  // Insertar video
  const insertVideo = () => {
    if (videoUrl) {
      let videoId = '';
      
      // Extraer ID de YouTube
      const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        videoId = youtubeMatch[1];
        const html = `
          <div class="my-4 relative pb-[56.25%] h-0 overflow-hidden">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              class="absolute top-0 left-0 w-full h-full rounded-lg"
              frameborder="0" 
              allowfullscreen
            ></iframe>
          </div>
        `;
        document.execCommand('insertHTML', false, html);
      }
      
      setShowVideoDialog(false);
      setVideoUrl('');
      editorRef.current?.focus();
    }
  };

  // Manejar cambios en el editor
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateActiveFormats();
    }
  };

  // Manejar pegado con soporte para imágenes
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    let imageHandled = false;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            await handleImageFile(file);
            imageHandled = true;
            break;
          }
        }
      }
    }

    if (!imageHandled) {
      // Pegado normal de texto
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    }
  };

  // Manejar archivo de imagen
  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(0);

    try {
      let url: string;

      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      if (onImageUpload) {
        url = await onImageUpload(file);
      } else {
        url = await uploadService.uploadImage(file);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Insertar la imagen en el editor
      const html = `
        <figure class="my-4">
          <img src="${url}" alt="${file.name}" class="w-full rounded-lg" />
        </figure>
      `;
      document.execCommand('insertHTML', false, html);
      handleInput();

      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Subir imagen desde archivo
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageFile(file);
    }
  };

  // Manejar drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      await handleImageFile(imageFile);
    }
  };

  if (preview) {
    return (
      <Card className="p-6">
        <article 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </Card>
    );
  }

  return (
    <div className={cn("relative", isFullscreen && "fixed inset-0 z-50 bg-background p-4")}>
      <Tabs defaultValue="editor" className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="editor">
              <Edit className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Vista previa
            </TabsTrigger>
          </TabsList>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <X className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>

        <TabsContent value="editor" className="flex-1 flex flex-col space-y-2">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
            {mainToolbar.map((tool, index) => {
              if (tool.command === 'separator') {
                return <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />;
              }

              const Icon = tool.icon;
              const isActive = activeFormats.has(tool.command);

              return (
                <Button
                  key={index}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => execCommand(tool.command, tool.value)}
                  title={tool.tooltip}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>

          {/* Progress bar for image upload */}
          {isUploadingImage && (
            <div className="px-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Subiendo imagen...</span>
                <span className="ml-auto">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 mt-2" />
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 border rounded-lg overflow-hidden relative">
            <div
              ref={editorRef}
              contentEditable
              className={cn(
                "min-h-[400px] p-4 focus:outline-none",
                "prose prose-lg dark:prose-invert max-w-none",
                error && "border-red-500",
                isFullscreen && "min-h-full"
              )}
              onInput={handleInput}
              onPaste={handlePaste}
              onMouseUp={updateActiveFormats}
              onKeyUp={updateActiveFormats}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              dangerouslySetInnerHTML={{ __html: value }}
              data-placeholder={placeholder}
            />
            {/* Mostrar placeholder cuando está vacío */}
            {!value && placeholder && (
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            )}
            {/* Input oculto para subir imágenes */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Footer con estadísticas */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
            <div className="flex items-center gap-4">
              <span>{wordCount} palabras</span>
              <span>{charCount} caracteres</span>
              <span>~{Math.ceil(wordCount / 200)} min de lectura</span>
            </div>
            <span>Puedes arrastrar, pegar o subir imágenes</span>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 overflow-auto">
          <Card className="p-6 h-full">
            <article 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para enlaces */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insertar enlace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkText">Texto del enlace</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder={selectedText || "Texto del enlace"}
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={insertLink}>
              Insertar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para imágenes actualizado */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insertar imagen</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Subir archivo</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Seleccionar imagen
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, GIF o WebP. Máximo 5MB.
                </p>
              </div>
              <div>
                <Label htmlFor="imageAltUpload">Texto alternativo (alt)</Label>
                <Input
                  id="imageAltUpload"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Descripción de la imagen"
                />
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">URL de la imagen</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div>
                <Label htmlFor="imageAltUrl">Texto alternativo (alt)</Label>
                <Input
                  id="imageAltUrl"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Descripción de la imagen"
                />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={insertImage} disabled={!imageUrl && isUploadingImage}>
              {isUploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                'Insertar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para videos */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insertar video de YouTube</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoUrl">URL del video</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={insertVideo}>
              Insertar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}