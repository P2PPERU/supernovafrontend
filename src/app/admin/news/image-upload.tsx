'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  value: File | null;
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  onRemove: () => void;
  maxSize?: number; // en MB
  acceptedFormats?: string[];
}

export function ImageUpload({
  value,
  currentImageUrl,
  onChange,
  onRemove,
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`El archivo es muy grande. Máximo ${maxSize}MB`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Formato de archivo no válido');
      } else {
        setError('Error al subir el archivo');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Simular progreso de carga
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onChange(file);
    }
  }, [onChange, maxSize]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => ({ ...acc, [format]: [] }), {}),
    maxSize: maxSize * 1024 * 1024, // Convertir MB a bytes
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(null);
    setUploadProgress(0);
    setError(null);
    onRemove();
  };

  const hasImage = value || currentImageUrl;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!hasImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-all duration-200
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'}
                ${isDragReject ? 'border-red-500 bg-red-500/5' : ''}
                ${error ? 'border-red-500' : ''}
                hover:border-primary hover:bg-primary/5
              `}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-4">
                <div className={`
                  p-4 rounded-full
                  ${isDragActive ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}
                  ${isDragReject ? 'bg-red-100 dark:bg-red-900/20' : ''}
                `}>
                  <Upload className={`
                    h-8 w-8
                    ${isDragActive ? 'text-primary' : 'text-gray-400'}
                    ${isDragReject ? 'text-red-500' : ''}
                  `} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {isDragActive
                      ? 'Suelta la imagen aquí'
                      : 'Arrastra una imagen o haz clic para seleccionar'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, GIF o WebP. Máximo {maxSize}MB
                  </p>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full max-w-xs">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                ) : currentImageUrl ? (
                  <Image
                    src={currentImageUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={handleRemove}
                  className="bg-black/50 hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {value ? 'Nueva imagen cargada' : 'Imagen actual'}
                  </span>
                </div>
                {value && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {value.name} - {(value.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ImageIcon className="h-3 w-3" />
          <span>Formatos: JPG, PNG, GIF, WebP</span>
        </div>
        <div className="flex items-center gap-1">
          <Upload className="h-3 w-3" />
          <span>Tamaño máximo: {maxSize}MB</span>
        </div>
      </div>
    </div>
  );
}