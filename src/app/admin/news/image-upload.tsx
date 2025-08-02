'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Grid,
  List as ListIcon,
  Star,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Exportar la interfaz para usar en otros componentes
export interface ImageFile {
  id: string;
  file?: File;
  url: string;
  name: string;
  size: number;
  isMain: boolean;
  uploadProgress?: number;
  error?: string;
}

type OnChange = (files: ImageFile[] | ((prev: ImageFile[]) => ImageFile[])) => void;

interface ImageUploadProps {
  value: ImageFile[];
  currentImageUrl?: string | null;
  onChange: OnChange;
  maxFiles?: number;
  maxSize?: number; // en MB
  acceptedFormats?: string[];
  allowMultiple?: boolean;
}

export function ImageUpload({
  value = [],
  currentImageUrl,
  onChange,
  maxFiles = 10,
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  allowMultiple = true,
}: ImageUploadProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Asegurar que value siempre sea un array
  const safeValue = Array.isArray(value) ? value : [];

  // Inicializar con imagen actual si existe
  useEffect(() => {
    if (currentImageUrl && safeValue.length === 0) {
      onChange([
        {
          id: 'current',
          url: currentImageUrl,
          name: 'Imagen actual',
          size: 0,
          isMain: true,
        },
      ]);
    }
  }, [currentImageUrl, safeValue.length, onChange]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Manejar archivos rechazados
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMessage = 'Error al subir el archivo';

        if (rejection.errors[0]?.code === 'file-too-large') {
          errorMessage = `El archivo es muy grande. Máximo ${maxSize}MB`;
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          errorMessage = 'Formato de archivo no válido';
        }

        // Aquí podrías mostrar un toast con errorMessage
        return;
      }

      // Verificar límite de archivos
      if (safeValue.length + acceptedFiles.length > maxFiles) {
        // Podrías mostrar un toast de que se excede el límite
        return;
      }

      // Procesar archivos aceptados
      const newFiles: ImageFile[] = acceptedFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        isMain: safeValue.length === 0 && index === 0, // Primera imagen es principal
        uploadProgress: 0,
      }));

      // Agregar nuevos archivos al estado actual
      const updatedFiles = [...safeValue, ...newFiles];
      onChange(updatedFiles);

      // Simular upload progress
      newFiles.forEach((fileInfo) => {
        const interval = setInterval(() => {
          // Obtener el estado actual directamente desde el componente padre
          onChange((prevFiles) => {
            const currentFiles = typeof prevFiles === 'function' ? safeValue : prevFiles;
            return currentFiles.map((f: ImageFile) =>
              f.id === fileInfo.id
                ? { ...f, uploadProgress: Math.min((f.uploadProgress || 0) + 10, 100) }
                : f
            );
          });
        }, 200);

        setTimeout(() => {
          clearInterval(interval);
          onChange((prevFiles) => {
            const currentFiles = typeof prevFiles === 'function' ? safeValue : prevFiles;
            return currentFiles.map((f: ImageFile) =>
              f.id === fileInfo.id ? { ...f, uploadProgress: 100 } : f
            );
          });
        }, 2000);
      });
    },
    [safeValue, onChange, maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => ({ ...acc, [format]: [] }), {} as Record<string, any>),
    maxSize: maxSize * 1024 * 1024,
    multiple: allowMultiple,
  });

  const handleRemove = (id: string) => {
    const fileToRemove = safeValue.find((f) => f.id === id);
    if (fileToRemove?.url && fileToRemove.file) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    const newFiles = safeValue.filter((f) => f.id !== id);

    // Si eliminamos la principal, hacer principal la primera
    if (fileToRemove?.isMain && newFiles.length > 0) {
      newFiles[0].isMain = true;
    }

    onChange(newFiles);
  };

  const handleSetMain = (id: string) => {
    onChange(
      safeValue.map((f) => ({
        ...f,
        isMain: f.id === id,
      }))
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {(!safeValue.length || allowMultiple) && (
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
            'transition-all duration-200',
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700',
            isDragReject ? 'border-red-500 bg-red-500/5' : '',
            'hover:border-primary hover:bg-primary/5'
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'p-4 rounded-full',
                isDragActive ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800',
                isDragReject ? 'bg-red-100 dark:bg-red-900/20' : ''
              )}
            >
              <Upload
                className={cn(
                  'h-8 w-8',
                  isDragActive ? 'text-primary' : 'text-gray-400',
                  isDragReject ? 'text-red-500' : ''
                )}
              />
            </div>

            <div>
              <p className="text-sm font-medium">
                {isDragActive
                  ? 'Suelta las imágenes aquí'
                  : allowMultiple
                  ? 'Arrastra imágenes o haz clic para seleccionar'
                  : 'Arrastra una imagen o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {allowMultiple && `Máximo ${maxFiles} imágenes • `}
                JPG, PNG, GIF o WebP • Máximo {maxSize}MB por archivo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de imágenes */}
      {safeValue.length > 0 && (
        <Card>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  Imágenes ({safeValue.length}/{maxFiles})
                </h3>
                {safeValue.some((f) => (f.uploadProgress || 0) < 100) && (
                  <span className="text-sm text-muted-foreground">Subiendo...</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-muted' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-muted' : ''}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div
              className={cn(
                'p-4',
                viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-2'
              )}
            >
              <AnimatePresence mode="popLayout">
                {safeValue.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      'relative group',
                      viewMode === 'grid' ? '' : 'flex items-center gap-4 p-3 rounded-lg hover:bg-muted'
                    )}
                  >
                    {viewMode === 'grid' ? (
                      // Vista Grid
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <Image src={file.url} alt={file.name} fill className="object-cover" />

                        {/* Overlay con acciones */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={() => handleSetMain(file.id)}
                            disabled={file.isMain}
                            className="h-8 w-8"
                          >
                            <Star
                              className={cn('h-4 w-4', file.isMain && 'fill-current')}
                            />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => handleRemove(file.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Badge principal */}
                        {file.isMain && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-poker-green text-white">
                              Principal
                            </Badge>
                          </div>
                        )}

                        {/* Progress bar */}
                        {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <Progress value={file.uploadProgress} className="h-1" />
                          </div>
                        )}
                      </div>
                    ) : (
                      // Vista Lista
                      <>
                        <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                          <Image src={file.url} alt={file.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                          {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                            <Progress value={file.uploadProgress} className="h-1 mt-1" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {file.isMain && (
                            <Badge className="bg-poker-green text-white">
                              Principal
                            </Badge>
                          )}
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSetMain(file.id)}
                            disabled={file.isMain}
                          >
                            <Star
                              className={cn(
                                'h-4 w-4',
                                file.isMain && 'fill-current text-poker-green'
                              )}
                            />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemove(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Información */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ImageIcon className="h-3 w-3" />
          <span>Formatos: JPG, PNG, GIF, WebP</span>
        </div>
        <div className="flex items-center gap-1">
          <Upload className="h-3 w-3" />
          <span>Tamaño máximo: {maxSize}MB</span>
        </div>
        {allowMultiple && (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Máximo {maxFiles} imágenes</span>
          </div>
        )}
      </div>
    </div>
  );
}