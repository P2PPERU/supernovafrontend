// src/types/ads.types.ts
export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  type: 'banner' | 'sidebar' | 'native';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'inline';
  size?: {
    width: number;
    height: number;
  };
  isActive: boolean;
  priority: number; // Para ordenar qué anuncios mostrar primero
  impressions?: number;
  clicks?: number;
  createdAt: string;
  expiresAt?: string;
}

export interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'native';
  position?: string;
  className?: string;
  maxAds?: number;
  rotationInterval?: number; // en segundos
}