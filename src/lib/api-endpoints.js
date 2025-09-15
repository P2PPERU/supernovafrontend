// src/lib/api-endpoints.js - Endpoints actualizados y mejorados

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper para hacer requests con autenticación
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Headers base
  const headers = {
    ...options.headers,
  };
  
  // Solo agregar Content-Type si no es FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Agregar token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Manejar respuestas específicas
    if (response.status === 401) {
      // Token expirado, redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
    
    if (!response.ok) {
      // Intentar obtener mensaje de error del cuerpo
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // No se pudo parsear el error, usar el mensaje por defecto
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// ========================================
// ADMIN - GESTIÓN DE USUARIOS
// ========================================

export const adminUsersAPI = {
  // Obtener todos los usuarios con filtros
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/users?${queryParams}`);
  },

  // Obtener usuario por ID
  getUser: (userId) => apiRequest(`/users/${userId}`),

  // Crear nuevo usuario
  createUser: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Actualizar estado del usuario (activar/desactivar)
  updateUserStatus: (userId, isActive) => apiRequest(`/users/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  }),

  // Actualizar rol del usuario
  updateUserRole: (userId, role) => apiRequest(`/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  }),

  // Actualizar balance del usuario
  updateUserBalance: (userId, balanceData) => apiRequest(`/users/${userId}/balance`, {
    method: 'PUT',
    body: JSON.stringify(balanceData),
  }),

  // Restablecer contraseña de usuario
  resetUserPassword: (userId, newPassword) => apiRequest(`/users/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify({ newPassword }),
  }),

  // Eliminar usuario (soft delete)
  deleteUser: (userId) => apiRequest(`/users/${userId}`, {
    method: 'DELETE',
  }),

  // Obtener estadísticas de usuarios
  getUserStats: () => apiRequest('/users/stats'),

  // Obtener usuarios recientes
  getRecentUsers: (limit = 10) => apiRequest(`/users/recent?limit=${limit}`),

  // Buscar usuarios
  searchUsers: (query) => apiRequest(`/users/search?q=${encodeURIComponent(query)}`),
};

// ========================================
// ADMIN - GESTIÓN DE CLUBS
// ========================================

export const adminClubsAPI = {
  // Obtener todos los clubs (incluye inactivos) - CORREGIDO
  getAllClubs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/clubs/admin?${queryParams}`); // Cambiado de /all a admin
  },

  // Obtener club por ID (admin)
  getClub: (clubId) => apiRequest(`/clubs/admin/${clubId}`),

  // Crear nuevo club - MEJORADO
  createClub: (clubData, logoFile = null, bannerFile = null) => {
    const formData = new FormData();
    
    // Agregar campos básicos
    formData.append('name', clubData.name);
    formData.append('description', clubData.description);
    
    // Campos opcionales
    if (clubData.shortDescription) formData.append('shortDescription', clubData.shortDescription);
    if (clubData.website) formData.append('website', clubData.website);
    if (clubData.contactEmail) formData.append('contactEmail', clubData.contactEmail);
    if (clubData.contactPhone) formData.append('contactPhone', clubData.contactPhone);
    
    // Configuración
    formData.append('isActive', clubData.isActive);
    formData.append('isFeatured', clubData.isFeatured);
    formData.append('order', clubData.order || 0);
    
    // Arrays - manejar features y gameTypes
    if (clubData.features && Array.isArray(clubData.features)) {
      clubData.features.forEach(feature => {
        formData.append('features[]', feature);
      });
    }
    
    if (clubData.gameTypes && Array.isArray(clubData.gameTypes)) {
      clubData.gameTypes.forEach(gameType => {
        formData.append('gameTypes[]', gameType);
      });
    }
    
    // Objetos complejos como JSON
    if (clubData.location) {
      formData.append('location', JSON.stringify(clubData.location));
    }
    
    if (clubData.requirements) {
      formData.append('requirements', JSON.stringify(clubData.requirements));
    }
    
    if (clubData.schedule) {
      formData.append('schedule', JSON.stringify(clubData.schedule));
    }
    
    if (clubData.socialLinks) {
      formData.append('socialLinks', JSON.stringify(clubData.socialLinks));
    }

    // Agregar archivos si existen
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    return apiRequest('/clubs/admin', {
      method: 'POST',
      body: formData
    });
  },

  // Actualizar club - MEJORADO
  updateClub: (clubId, clubData, logoFile = null, bannerFile = null) => {
    const formData = new FormData();
    
    // Solo agregar campos que han cambiado
    Object.keys(clubData).forEach(key => {
      if (clubData[key] !== undefined && clubData[key] !== null) {
        if (key === 'features' || key === 'gameTypes') {
          if (Array.isArray(clubData[key])) {
            clubData[key].forEach(item => {
              formData.append(`${key}[]`, item);
            });
          }
        } else if (typeof clubData[key] === 'object') {
          formData.append(key, JSON.stringify(clubData[key]));
        } else {
          formData.append(key, clubData[key]);
        }
      }
    });

    // Agregar archivos si existen
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    return apiRequest(`/clubs/admin/${clubId}`, {
      method: 'PUT',
      body: formData
    });
  },

  // Actualizar estado del club
  updateClubStatus: (clubId, isActive) => apiRequest(`/clubs/admin/${clubId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  }),

  // Eliminar club
  deleteClub: (clubId) => apiRequest(`/clubs/admin/${clubId}`, {
    method: 'DELETE',
  }),

  // Obtener estadísticas de clubs - CORREGIDO
  getClubStats: () => apiRequest('/clubs/admin/stats'), // Cambiar de '/clubs/stats' a '/clubs/admin/stats'
};

// ========================================
// CLUBS - GESTIÓN PÚBLICA
// ========================================

export const clubsAPI = {
  // Obtener clubs públicos (sin autenticación requerida)
  getPublicClubs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/clubs?${queryParams}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      });
  },

  // Obtener club público por ID
  getPublicClub: (clubId) => {
    return fetch(`${API_BASE_URL}/clubs/${clubId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      });
  },

  // Buscar clubs públicos
  searchClubs: (query) => {
    return fetch(`${API_BASE_URL}/clubs/search?query=${encodeURIComponent(query)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      });
  },

  // Obtener clubs destacados
  getFeaturedClubs: (limit = 6) => {
    return fetch(`${API_BASE_URL}/clubs/featured?limit=${limit}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      });
  },
};

// ========================================
// ADMIN - DASHBOARD STATS (NUEVO)
// ========================================

export const adminDashboardAPI = {
  // Obtener estadísticas generales
  getGeneralStats: () => apiRequest('/admin/stats/general'),
  
  // Obtener datos de actividad reciente
  getRecentActivity: (limit = 10) => apiRequest(`/admin/activity/recent?limit=${limit}`),
  
  // Obtener métricas de performance
  getPerformanceMetrics: () => apiRequest('/admin/stats/performance'),
  
  // Obtener datos de ingresos
  getRevenueData: (period = 'monthly') => apiRequest(`/admin/stats/revenue?period=${period}`),
  
  // Obtener usuarios pendientes de validación
  getPendingValidations: () => apiRequest('/admin/validations/pending'),
  
  // Obtener alertas del sistema
  getSystemAlerts: () => apiRequest('/admin/alerts'),
};

// ========================================
// ADMIN - GESTIÓN DE BONIFICACIONES (ACTUALIZADO)
// ========================================

export const adminBonusAPI = {
  // Obtener todas las bonificaciones
  getBonuses: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/bonus?${queryParams}`);
  },

  // Crear bonificación
  createBonus: (bonusData) => apiRequest('/bonus', {
    method: 'POST',
    body: JSON.stringify(bonusData),
  }),

  // Actualizar estado de bonificación
  updateBonusStatus: (bonusId, status) => apiRequest(`/bonus/${bonusId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  // Eliminar bonificación
  deleteBonus: (bonusId) => apiRequest(`/bonus/${bonusId}`, {
    method: 'DELETE',
  }),

  // Obtener estadísticas de bonificaciones
  getBonusStats: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/bonus/stats?${queryParams}`);
  },

  // Obtener bonificaciones de un usuario específico
  getUserBonuses: (userId) => apiRequest(`/bonus/user/${userId}`),

  // Asignar bono a usuario
  assignBonusToUser: (userId, bonusData) => apiRequest(`/bonus/assign/${userId}`, {
    method: 'POST',
    body: JSON.stringify(bonusData),
  }),
};

// ========================================
// ADMIN - GESTIÓN DE RANKINGS (ACTUALIZADO)
// ========================================

export const adminRankingsAPI = {
  // Obtener todos los rankings (incluye ocultos)
  getAllRankings: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/rankings/admin?${queryParams}`);
  },

  // Crear o actualizar ranking de jugador
  updatePlayerRanking: (playerId, rankingData) => apiRequest(`/rankings/player/${playerId}`, {
    method: 'PUT',
    body: JSON.stringify(rankingData),
  }),

  // Importar rankings desde Excel
  importRankings: (excelFile) => {
    const formData = new FormData();
    formData.append('file', excelFile);
    return apiRequest('/rankings/import', {
      method: 'POST',
      body: formData
    });
  },

  // Cambiar visibilidad de ranking
  toggleRankingVisibility: (rankingId, isVisible) => apiRequest(`/rankings/${rankingId}/visibility`, {
    method: 'PUT',
    body: JSON.stringify({ isVisible }),
  }),

  // Eliminar ranking
  deleteRanking: (rankingId) => apiRequest(`/rankings/${rankingId}`, {
    method: 'DELETE',
  }),

  // Obtener estadísticas de rankings
  getRankingStats: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/rankings/stats?${queryParams}`);
  },

  // Recalcular posiciones
  recalculatePositions: (recalcData) => apiRequest('/rankings/recalculate', {
    method: 'POST',
    body: JSON.stringify(recalcData),
  }),

  // Descargar plantilla Excel
  downloadTemplate: () => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE_URL}/rankings/template`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Buscar jugadores
  searchPlayers: (query) => apiRequest(`/rankings/search/players?query=${encodeURIComponent(query)}`),
};

// ========================================
// UTILIDADES Y HELPERS (MEJORADO)
// ========================================

export const apiUtils = {
  // Formatear errores de API
  formatError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Error desconocido en el servidor';
  },

  // Construir query params limpiando valores undefined/null
  buildQueryParams: (params) => {
    const filtered = Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return new URLSearchParams(filtered).toString();
  },

  // Formatear fechas para la API
  formatDate: (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
  },

  // Validar archivos antes de subir
  validateFile: (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
    if (!file) return false;
    
    if (file.size > maxSize) {
      throw new Error(`El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB`);
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`);
    }
    
    return true;
  },

  // Manejar respuesta con imagen
  handleImageResponse: (imageUrl, baseUrl = null) => {
    if (!imageUrl) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si empieza con /uploads, agregar la base URL
    const base = baseUrl || API_BASE_URL.replace('/api', '');
    if (imageUrl.startsWith('/uploads')) {
      return `${base}${imageUrl}`;
    }
    
    // Si no tiene prefijo, agregarlo
    return `${base}/${imageUrl}`;
  },

  // Debounce para búsquedas
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// ========================================
// CONSTANTES DE CONFIGURACIÓN
// ========================================

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30 segundos
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  REFRESH_INTERVALS: {
    DASHBOARD: 30000, // 30 segundos
    NOTIFICATIONS: 60000, // 1 minuto
    ACTIVITY: 15000, // 15 segundos
  }
};

// ========================================
// TIPOS DE DATOS PARA TYPESCRIPT/INTELLISENSE (ACTUALIZADO)
// ========================================

export const DataTypes = {
  // Tipos de usuarios
  USER_ROLES: {
    ADMIN: 'admin',
    AGENT: 'agent', 
    EDITOR: 'editor',
    CLIENT: 'client'
  },

  // Estados de usuarios
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
  },

  // Tipos de clubs
  CLUB_TYPES: {
    CASINO: 'casino',
    POKER_ROOM: 'poker_room',
    TOURNAMENT_CLUB: 'tournament_club',
    ONLINE: 'online',
    MIXED: 'mixed'
  },

  // Estados de clubs
  CLUB_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
  },

  // Tipos de bonificaciones
  BONUS_TYPES: {
    WELCOME: 'welcome',
    DEPOSIT: 'deposit',
    REFERRAL: 'referral',
    ACHIEVEMENT: 'achievement',
    CUSTOM: 'custom',
    ROULETTE_SPIN: 'roulette_spin'
  },

  // Estados de bonificaciones
  BONUS_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    CLAIMED: 'claimed',
    EXPIRED: 'expired'
  },

  // Tipos de rankings
  RANKING_TYPES: {
    POINTS: 'points',
    HANDS_PLAYED: 'hands_played',
    TOURNAMENTS: 'tournaments',
    RAKE: 'rake'
  },

  // Períodos de rankings
  RANKING_PERIODS: {
    ALL_TIME: 'all_time',
    MONTHLY: 'monthly',
    WEEKLY: 'weekly',
    DAILY: 'daily'
  }
};