// src/services/ads.service.ts
import { Ad } from '@/types/ads.types';

// Extender el tipo Ad para incluir datos de placeholder
export interface AdWithPlaceholder extends Ad {
  placeholderData?: {
    text: string;
    bgColor: string;
    textColor: string;
  };
}

// Mock data con placeholders locales
const mockAds: AdWithPlaceholder[] = [
  {
    id: '1',
    title: 'PokerStars - Bono de Bienvenida',
    imageUrl: '', // Vacío para usar placeholder
    linkUrl: 'https://pokerstars.com',
    type: 'banner',
    position: 'top',
    size: { width: 728, height: 90 },
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    placeholderData: {
      text: 'PokerStars Bono 200%',
      bgColor: '#1a1a1a',
      textColor: '#22c55e',
    }
  },
  {
    id: '2',
    title: 'GGPoker - Torneo Millonario',
    imageUrl: '',
    linkUrl: 'https://ggpoker.com',
    type: 'banner',
    position: 'top',
    size: { width: 728, height: 90 },
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    placeholderData: {
      text: 'GGPoker $1M GTD',
      bgColor: '#1a1a1a',
      textColor: '#f59e0b',
    }
  },
  {
    id: '3',
    title: '888poker - Spins Gratis',
    imageUrl: '',
    linkUrl: 'https://888poker.com',
    type: 'sidebar',
    size: { width: 300, height: 250 },
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    placeholderData: {
      text: '888poker Spins',
      bgColor: '#1a1a1a',
      textColor: '#8b5cf6',
    }
  },
  {
    id: '4',
    title: 'PartyPoker - Rakeback 40%',
    imageUrl: '',
    linkUrl: 'https://partypoker.com',
    type: 'sidebar',
    size: { width: 300, height: 600 },
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    placeholderData: {
      text: 'PartyPoker Rakeback',
      bgColor: '#1a1a1a',
      textColor: '#ef4444',
    }
  },
  {
    id: '5',
    title: 'Academia de Poker Pro',
    imageUrl: '',
    linkUrl: 'https://academiapokerpro.com',
    type: 'native',
    size: { width: 320, height: 100 },
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    placeholderData: {
      text: 'Academia Poker',
      bgColor: '#1a1a1a',
      textColor: '#3b82f6',
    }
  },
];

export const adsService = {
  getAdsByType: async (type: 'banner' | 'sidebar' | 'native'): Promise<AdWithPlaceholder[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockAds
      .filter(ad => ad.type === type && ad.isActive)
      .sort((a, b) => a.priority - b.priority);
  },

  getAdById: async (id: string): Promise<AdWithPlaceholder | null> => {
    const ad = mockAds.find(a => a.id === id);
    return ad || null;
  },

  recordImpression: async (adId: string): Promise<void> => {
    console.log('Ad impression recorded:', adId);
  },

  recordClick: async (adId: string): Promise<void> => {
    console.log('Ad click recorded:', adId);
  },
};