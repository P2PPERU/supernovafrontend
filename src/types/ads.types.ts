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
  priority: number;
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
  rotationInterval?: number;
}

// Extensión para ads con placeholder
export interface AdWithPlaceholder extends Ad {
  placeholderData?: {
    text: string;
    bgColor: string;
    textColor: string;
  };
}