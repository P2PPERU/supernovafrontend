'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export function SafeImage({ src, alt, className, width, height, fill }: SafeImageProps) {
  const [error, setError] = useState(false);
  
  // Si hay error, mostrar placeholder
  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Imagen no disponible</span>
      </div>
    );
  }

  // Para imágenes externas, usar img normal
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  // Para imágenes locales, usar Next Image
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      onError={() => setError(true)}
    />
  );
}