// src/services/ads.service.ts
import { Ad } from '@/types/ads.types';

// Mock data para desarrollo - en producción vendría del backend
const mockAds: Ad[] = [
  {
    id: '1',
    title: 'PokerStars - Bono de Bienvenida',
    imageUrl: 'https://placehold.co/728x90/1a1a1a/22c55e?text=PokerStars+Bono+200%25',
    linkUrl: 'https://pokerstars.com',
    type: 'banner',
    position: 'top',
    size: { width: 728, height: 90 },
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'GGPoker - Torneo Millonario',
    imageUrl: 'https://placehold.co/728x90/1a1a1a/f59e0b?text=GGPoker+%241M+GTD',
    linkUrl: 'https://ggpoker.com',
    type: 'banner',
    position: 'top',
    size: { width: 728, height: 90 },
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '888poker - Spins Gratis',
    imageUrl: 'https://placehold.co/300x250/1a1a1a/8b5cf6?text=888poker+Spins',
    linkUrl: 'https://888poker.com',
    type: 'sidebar',
    size: { width: 300, height: 250 },
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'PartyPoker - Rakeback 40%',
    imageUrl: 'https://placehold.co/300x600/1a1a1a/ef4444?text=PartyPoker+Rakeback',
    linkUrl: 'https://partypoker.com',
    type: 'sidebar',
    size: { width: 300, height: 600 },
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Academia de Poker Pro',
    imageUrl: 'https://placehold.co/320x100/1a1a1a/3b82f6?text=Academia+Poker',
    linkUrl: 'https://academiapokerpro.com',
    type: 'native',
    size: { width: 320, height: 100 },
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
  },
];

export const adsService = {
  // Obtener anuncios por tipo
  getAdsByType: async (type: 'banner' | 'sidebar' | 'native'): Promise<Ad[]> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockAds
      .filter(ad => ad.type === type && ad.isActive)
      .sort((a, b) => a.priority - b.priority);
  },

  // Obtener un anuncio específico
  getAdById: async (id: string): Promise<Ad | null> => {
    const ad = mockAds.find(a => a.id === id);
    return ad || null;
  },

  // Registrar impresión (para futuras métricas)
  recordImpression: async (adId: string): Promise<void> => {
    // En producción, esto haría una llamada al backend
    console.log('Ad impression recorded:', adId);
  },

  // Registrar click
  recordClick: async (adId: string): Promise<void> => {
    // En producción, esto haría una llamada al backend
    console.log('Ad click recorded:', adId);
  },
};