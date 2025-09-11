// src/services/clubs.service.ts
import { api } from '@/lib/axios';
import { Club, ClubFilters, CreateClubData, UpdateClubData, ClubStats } from '@/types/club.types';
import { PaginatedResponse } from '@/types';

// Transformador para normalizar las respuestas del backend
const transformClubResponse = (club: any): Club => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
  
  const buildImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      return `${baseUrl}${imagePath}`;
    }
    
    return `${baseUrl}/${imagePath}`;
  };
  
  return {
    ...club,
    logo: buildImageUrl(club.logo),
    banner: buildImageUrl(club.banner),
    features: Array.isArray(club.features) ? club.features : [],
    gameTypes: Array.isArray(club.gameTypes) ? club.gameTypes : [],
    createdAt: club.createdAt || club.created_at,
    updatedAt: club.updatedAt || club.updated_at,
  };
};

export const clubsService = {
  // Obtener lista de clubs (público)
  getClubs: async (filters: ClubFilters = {}): Promise<PaginatedResponse<Club>> => {
    const response = await api.get('/clubs', { params: filters });
    return {
      ...response.data,
      data: response.data.clubs?.map(transformClubResponse) || [],
      totalItems: response.data.totalClubs || response.data.total,
    };
  },

  // Búsqueda de clubs (público)
  searchClubs: async (query: string, filters: ClubFilters = {}): Promise<PaginatedResponse<Club>> => {
    const response = await api.get('/clubs/search', { 
      params: { ...filters, search: query } 
    });
    return {
      ...response.data,
      data: response.data.clubs?.map(transformClubResponse) || [],
      totalItems: response.data.totalClubs || response.data.total,
    };
  },

  // Obtener club por ID (público)
  getClubById: async (id: string): Promise<{ success: boolean; club: Club }> => {
    const response = await api.get(`/clubs/${id}`);
    return {
      ...response.data,
      club: transformClubResponse(response.data.club),
    };
  },

  // Obtener clubs destacados (público)
  getFeaturedClubs: async (limit = 6): Promise<{ success: boolean; clubs: Club[] }> => {
    const response = await api.get('/clubs/featured', { params: { limit } });
    return {
      ...response.data,
      clubs: response.data.clubs?.map(transformClubResponse) || [],
    };
  },
};

// Servicios de administración
export const adminClubsService = {
  // Obtener todos los clubs (admin)
  getClubs: async (filters: ClubFilters = {}): Promise<PaginatedResponse<Club>> => {
    const response = await api.get('/clubs/admin/all', { params: filters });
    return {
      ...response.data,
      data: response.data.clubs?.map(transformClubResponse) || [],
      totalItems: response.data.totalClubs || response.data.total,
    };
  },

  // Obtener club por ID (admin)
  getClubById: async (id: string): Promise<{ success: boolean; club: Club }> => {
    const response = await api.get(`/clubs/admin/${id}`);
    return {
      ...response.data,
      club: transformClubResponse(response.data.club),
    };
  },

  // Crear club
  createClub: async (data: CreateClubData): Promise<{ success: boolean; club: Club }> => {
    const formData = new FormData();
    
    // Campos básicos
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.shortDescription) formData.append('shortDescription', data.shortDescription);
    if (data.website) formData.append('website', data.website);
    if (data.contactEmail) formData.append('contactEmail', data.contactEmail);
    if (data.contactPhone) formData.append('contactPhone', data.contactPhone);
    
    // Arrays
    if (data.features?.length > 0) {
      data.features.forEach(feature => {
        if (feature.trim()) formData.append('features[]', feature.trim());
      });
    }
    
    if (data.gameTypes?.length > 0) {
      data.gameTypes.forEach(gameType => {
        if (gameType.trim()) formData.append('gameTypes[]', gameType.trim());
      });
    }
    
    // Objetos JSON
    if (data.location) {
      formData.append('location', JSON.stringify(data.location));
    }
    
    if (data.requirements) {
      formData.append('requirements', JSON.stringify(data.requirements));
    }
    
    if (data.schedule) {
      formData.append('schedule', JSON.stringify(data.schedule));
    }
    
    if (data.socialLinks) {
      formData.append('socialLinks', JSON.stringify(data.socialLinks));
    }
    
    // Flags
    formData.append('isActive', String(data.isActive ?? true));
    formData.append('isFeatured', String(data.isFeatured ?? false));
    formData.append('order', String(data.order ?? 0));
    
    // Archivos
    if (data.logo) formData.append('logo', data.logo);
    if (data.banner) formData.append('banner', data.banner);

    const response = await api.post('/clubs/admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      ...response.data,
      club: transformClubResponse(response.data.club),
    };
  },

  // Actualizar club
  updateClub: async (id: string, data: UpdateClubData): Promise<{ success: boolean; club: Club }> => {
    const formData = new FormData();
    
    // Solo agregar campos que están definidos
    if (data.name !== undefined) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.shortDescription !== undefined) formData.append('shortDescription', data.shortDescription);
    if (data.website !== undefined) formData.append('website', data.website);
    if (data.contactEmail !== undefined) formData.append('contactEmail', data.contactEmail);
    if (data.contactPhone !== undefined) formData.append('contactPhone', data.contactPhone);
    
    // Arrays
    if (data.features !== undefined && Array.isArray(data.features)) {
      data.features.forEach(feature => {
        if (feature.trim()) formData.append('features[]', feature.trim());
      });
    }
    
    if (data.gameTypes !== undefined && Array.isArray(data.gameTypes)) {
      data.gameTypes.forEach(gameType => {
        if (gameType.trim()) formData.append('gameTypes[]', gameType.trim());
      });
    }
    
    // Objetos JSON
    if (data.location !== undefined) {
      formData.append('location', JSON.stringify(data.location));
    }
    
    if (data.requirements !== undefined) {
      formData.append('requirements', JSON.stringify(data.requirements));
    }
    
    if (data.schedule !== undefined) {
      formData.append('schedule', JSON.stringify(data.schedule));
    }
    
    if (data.socialLinks !== undefined) {
      formData.append('socialLinks', JSON.stringify(data.socialLinks));
    }
    
    // Flags
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    if (data.isFeatured !== undefined) formData.append('isFeatured', String(data.isFeatured));
    if (data.order !== undefined) formData.append('order', String(data.order));
    
    // Archivos
    if (data.logo) formData.append('logo', data.logo);
    if (data.banner) formData.append('banner', data.banner);

    const response = await api.put(`/clubs/admin/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      ...response.data,
      club: transformClubResponse(response.data.club),
    };
  },

  // Cambiar estado del club
  updateClubStatus: async (id: string, isActive: boolean): Promise<{ success: boolean; club: Club }> => {
    const response = await api.put(`/clubs/admin/${id}/status`, { isActive });
    return {
      ...response.data,
      club: transformClubResponse(response.data.club),
    };
  },

  // Eliminar club
  deleteClub: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/clubs/admin/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async (): Promise<{ success: boolean; stats: ClubStats }> => {
    const response = await api.get('/clubs/admin/stats');
    return response.data;
  },
};