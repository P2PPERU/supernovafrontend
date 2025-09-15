// src/services/clubs.service.ts - CORREGIDO para banner e imágenes
import { api } from '@/lib/axios';
import { Club, ClubFilters, CreateClubData, UpdateClubData, ClubStats } from '@/types/club.types';
import { PaginatedResponse } from '@/types';

// Transformador CORREGIDO para normalizar las respuestas del backend
const transformClubResponse = (club: any): Club => {
  if (!club) return club;
  
  // URL del backend donde están los archivos
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
  
  const buildImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Si empieza con /uploads, agregar la base URL
    if (imagePath.startsWith('/uploads')) {
      return `${backendUrl}${imagePath}`;
    }
    
    // Si no tiene prefijo, agregarlo
    return `${backendUrl}/${imagePath}`;
  };
  
  // DEBUGGING: Mostrar qué campos están llegando
  console.log('🔍 Club data received:', {
    name: club.name,
    logo_url: club.logo_url,
    banner_url: club.banner_url,
    settings: club.settings
  });
  
  // Transformar el club con mapeo correcto
  const transformedClub: Club = {
    ...club,
    // MAPEO CORRECTO de campos del backend a frontend
    logo: buildImageUrl(club.logo_url || club.logo),
    banner: buildImageUrl(club.banner_url || club.banner), // <-- ESTO ES CLAVE
    
    // Campos de contacto (mapear desde el backend)
    contactEmail: club.email || club.contactEmail,
    contactPhone: club.owner_phone || club.contactPhone,
    
    // Arrays desde settings o directamente
    features: club.settings?.features || club.features || [],
    gameTypes: club.settings?.gameTypes || club.gameTypes || [],
    
    // Estado activo
    isActive: club.is_active !== undefined ? club.is_active : club.isActive,
    isFeatured: club.settings?.isFeatured || club.isFeatured || false,
    
    // Ubicación
    location: club.location || (club.city || club.country ? {
      city: club.city,
      country: club.country,
      address: club.address
    } : undefined),
    
    // Configuraciones
    requirements: club.settings?.requirements || club.requirements,
    schedule: club.settings?.schedule || club.schedule,
    socialLinks: club.social_media || club.socialLinks,
    
    // Timestamps
    createdAt: club.createdAt || club.created_at || new Date().toISOString(),
    updatedAt: club.updatedAt || club.updated_at || new Date().toISOString(),
    
    // AGREGAR CAMPOS FALTANTES PARA TYPESCRIPT
    rating: club.rating || undefined,
    totalReviews: club.totalReviews || undefined,
    stats: club.stats || {
      totalMembers: club.member_count || 0
    }
  };
  
  console.log('✅ Club transformed:', {
    name: transformedClub.name,
    logo: transformedClub.logo,
    banner: transformedClub.banner
  });
  
  return transformedClub;
};

// Resto del código igual...
export const clubsService = {
  // Obtener lista de clubs (público)
  getClubs: async (filters: ClubFilters = {}): Promise<PaginatedResponse<Club>> => {
    try {
      const response = await api.get('/clubs', { params: filters });
      console.log('🏛️ Clubs response:', response.data);
      
      return {
        ...response.data,
        data: response.data.clubs?.map(transformClubResponse) || response.data.data?.map(transformClubResponse) || [],
        totalItems: response.data.totalClubs || response.data.total || response.data.totalItems || 0,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / (filters.limit || 10)),
        currentPage: response.data.currentPage || filters.page || 1,
        itemsPerPage: response.data.itemsPerPage || filters.limit || 10,
      };
    } catch (error) {
      console.error('❌ Error fetching clubs:', error);
      throw error;
    }
  },

  // Búsqueda de clubs (público)
  searchClubs: async (query: string, filters: ClubFilters = {}): Promise<PaginatedResponse<Club>> => {
    try {
      const response = await api.get('/clubs/search', { 
        params: { ...filters, search: query, q: query } 
      });
      
      return {
        ...response.data,
        data: response.data.clubs?.map(transformClubResponse) || response.data.data?.map(transformClubResponse) || [],
        totalItems: response.data.totalClubs || response.data.total || response.data.totalItems || 0,
      };
    } catch (error) {
      console.error('❌ Error searching clubs:', error);
      throw error;
    }
  },

  // Obtener club por ID (público)
  getClubById: async (id: string): Promise<{ success: boolean; club: Club }> => {
    try {
      const response = await api.get(`/clubs/${id}`);
      return {
        ...response.data,
        club: transformClubResponse(response.data.club || response.data.data),
      };
    } catch (error) {
      console.error('❌ Error fetching club by ID:', error);
      throw error;
    }
  },

  // Obtener clubs destacados (público)
  getFeaturedClubs: async (limit = 6): Promise<{ success: boolean; clubs: Club[] }> => {
    try {
      const response = await api.get('/clubs/featured', { params: { limit } });
      return {
        ...response.data,
        clubs: response.data.clubs?.map(transformClubResponse) || response.data.data?.map(transformClubResponse) || [],
      };
    } catch (error) {
      console.error('❌ Error fetching featured clubs:', error);
      return { success: false, clubs: [] };
    }
  },
};

// Servicios de administración
export const adminClubsService = {
  // Obtener todos los clubs (admin)
  getClubs: async (filters: ClubFilters = {}): Promise<PaginatedResponse<Club>> => {
    try {
      const response = await api.get('/clubs/admin', { params: filters });
      console.log('🏛️ Admin clubs response:', response.data);
      
      return {
        ...response.data,
        data: response.data.clubs?.map(transformClubResponse) || response.data.data?.map(transformClubResponse) || [],
        totalItems: response.data.totalClubs || response.data.total || response.data.totalItems || 0,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / (filters.limit || 10)),
        currentPage: response.data.currentPage || filters.page || 1,
        itemsPerPage: response.data.itemsPerPage || filters.limit || 10,
      };
    } catch (error) {
      console.error('❌ Error fetching admin clubs:', error);
      throw error;
    }
  },

  // Obtener club por ID (admin)
  getClubById: async (id: string): Promise<{ success: boolean; club: Club }> => {
    try {
      const response = await api.get(`/clubs/admin/${id}`);
      return {
        ...response.data,
        club: transformClubResponse(response.data.club || response.data.data),
      };
    } catch (error) {
      console.error('❌ Error fetching admin club by ID:', error);
      throw error;
    }
  },

  // Resto de métodos igual...
  createClub: async (data: CreateClubData): Promise<{ success: boolean; club: Club }> => {
    try {
      console.log('📝 Creating club with data:', data);
      
      const formData = new FormData();
      
      // CAMPOS OBLIGATORIOS
      formData.append('name', data.name.trim());
      formData.append('description', data.description || 'Descripción del club');
      
      // CAMPOS OPCIONALES DE CONTACTO
      if (data.shortDescription?.trim()) {
        formData.append('shortDescription', data.shortDescription.trim());
      }
      if (data.website?.trim()) {
        formData.append('website', data.website.trim());
      }
      if (data.contactEmail?.trim()) {
        formData.append('contactEmail', data.contactEmail.trim());
      }
      if (data.contactPhone?.trim()) {
        formData.append('contactPhone', data.contactPhone.trim());
      }
      
      // CONFIGURACIÓN BÁSICA
      formData.append('isActive', String(data.isActive ?? true));
      formData.append('isFeatured', String(data.isFeatured ?? false));
      formData.append('order', String(data.order ?? 0));
      
      // ARRAYS COMO JSON STRINGS
      if (data.features?.length) {
        formData.append('features', JSON.stringify(data.features.filter(f => f?.trim())));
      }
      
      if (data.gameTypes?.length) {
        formData.append('gameTypes', JSON.stringify(data.gameTypes.filter(g => g?.trim())));
      }
      
      // OBJETOS COMO JSON STRINGS
      if (data.location && Object.keys(data.location).length > 0) {
        formData.append('location', JSON.stringify(data.location));
      }
      
      if (data.requirements && Object.keys(data.requirements).length > 0) {
        formData.append('requirements', JSON.stringify(data.requirements));
      }
      
      if (data.schedule && Object.keys(data.schedule).length > 0) {
        formData.append('schedule', JSON.stringify(data.schedule));
      }
      
      if (data.socialLinks && Object.keys(data.socialLinks).length > 0) {
        formData.append('socialLinks', JSON.stringify(data.socialLinks));
      }

      // ARCHIVOS
      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
        console.log('📁 Logo file added:', data.logo.name);
      }
      
      if (data.banner instanceof File) {
        formData.append('banner', data.banner);
        console.log('📁 Banner file added:', data.banner.name);
      }

      // ENVIAR LA PETICIÓN
      const response = await api.post('/clubs/admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Club created successfully:', response.data);
      
      return {
        success: true,
        ...response.data,
        club: transformClubResponse(response.data.club || response.data.data),
      };
    } catch (error) {
      console.error('❌ Error creating club:', error);
      throw error;
    }
  },

  // Actualizar club
  updateClub: async (id: string, data: UpdateClubData): Promise<{ success: boolean; club: Club }> => {
    try {
      console.log('📝 Updating club with data:', data);
      
      const formData = new FormData();
      
      // Solo agregar campos que están definidos
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'features' || key === 'gameTypes') {
            if (Array.isArray(value) && value.length > 0) {
              formData.append(key, JSON.stringify(value.filter(item => item?.trim())));
            }
          } else if (key === 'logo' || key === 'banner') {
            if (value instanceof File) {
              formData.append(key, value);
            }
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            formData.append(key, String(value));
          } else if (typeof value === 'number') {
            formData.append(key, String(value));
          } else if (typeof value === 'string' && value.trim()) {
            formData.append(key, value.trim());
          }
        }
      });

      const response = await api.put(`/clubs/admin/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        ...response.data,
        club: transformClubResponse(response.data.club || response.data.data),
      };
    } catch (error) {
      console.error('❌ Error updating club:', error);
      throw error;
    }
  },

  // Cambiar estado del club
  updateClubStatus: async (id: string, isActive: boolean): Promise<{ success: boolean; club?: Club; message?: string }> => {
    try {
      const response = await api.put(`/clubs/admin/${id}/status`, { isActive });
      return {
        success: true,
        ...response.data,
        club: response.data.club ? transformClubResponse(response.data.club) : undefined,
      };
    } catch (error) {
      console.error('❌ Error updating club status:', error);
      throw error;
    }
  },

  // Eliminar club
  deleteClub: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/clubs/admin/${id}`);
      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('❌ Error deleting club:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  getStats: async (): Promise<{ success: boolean; stats: ClubStats }> => {
    try {
      let response;
      
      try {
        response = await api.get('/clubs/admin/stats');
        console.log('📊 Club stats response (admin/stats):', response.data);
      } catch (error) {
        console.warn('⚠️ /clubs/admin/stats failed, trying alternatives');
        response = await api.get('/clubs/stats');
        console.log('📊 Club stats response (stats):', response.data);
      }
      
      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('❌ Error fetching club stats:', error);
      return {
        success: false,
        stats: {
          totalClubs: 0,
          activeClubs: 0,
          featuredClubs: 0,
          totalMembers: 0,
          byGameType: [],
          byCountry: [],
          topClubs: [],
        }
      };
    }
  },
};

// Utilidades de validación
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validador de datos para crear club
const validateCreateClubData = (data: CreateClubData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) {
    errors.push('El nombre del club es requerido');
  }
  
  if (data.name && (data.name.length < 3 || data.name.length > 100)) {
    errors.push('El nombre debe tener entre 3 y 100 caracteres');
  }
  
  if (data.website?.trim() && !isValidUrl(data.website)) {
    errors.push('La URL del sitio web no es válida');
  }
  
  if (data.contactEmail?.trim() && !isValidEmail(data.contactEmail)) {
    errors.push('El email de contacto no es válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export { transformClubResponse, validateCreateClubData, isValidUrl, isValidEmail };