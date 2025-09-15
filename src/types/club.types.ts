// src/types/club.types.ts - CORREGIDO para evitar errores TypeScript
export interface Club {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
     
  // Campos del backend (nombres snake_case)
  owner_phone?: string;
  owner_name?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  website?: string;
  social_media?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
    discord?: string;
    [key: string]: string | undefined;
  };
     
  is_active: boolean;
  established_date?: string;
  member_count?: number;
  club_type?: 'casino' | 'poker_room' | 'tournament_club' | 'online' | 'mixed';
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
     
  // Settings como objeto JSON
  settings?: {
    features?: string[];
    gameTypes?: string[];
    requirements?: {
      minAge?: number;
      verificationRequired?: boolean;
      minDeposit?: number;
    };
    schedule?: {
      openHours?: string;
      tournamentDays?: string[];
      timeZone?: string;
    };
    shortDescription?: string;
    isFeatured?: boolean;
    order?: number;
  };
     
  created_by: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
     
  // Campos virtuales que pueden venir del frontend
  logo?: string;
  banner?: string;
     
  // Campos virtuales para compatibilidad con el frontend
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  features?: string[];
  gameTypes?: string[];
  requirements?: {
    minAge?: number;
    verificationRequired?: boolean;
    minDeposit?: number;
  };
  schedule?: {
    openHours?: string;
    tournamentDays?: string[];
    timeZone?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
    discord?: string;
  };

  // CAMPOS AGREGADOS PARA SOLUCIONAR ERRORES TYPESCRIPT
  rating?: number;
  totalReviews?: number;
  stats?: {
    totalMembers?: number;
    avgRating?: number;
    totalGames?: number;
  };
     
  // Relaciones
  creator?: {
    id: string;
    username: string;
  };
}

export interface ClubFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  type?: string;
  gameType?: string;
  country?: string;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface CreateClubData {
  name: string;
  description: string;
  shortDescription?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  ownerName?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  features?: string[];
  gameTypes?: string[];
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  requirements?: {
    minAge?: number;
    verificationRequired?: boolean;
    minDeposit?: number;
  };
  schedule?: {
    openHours?: string;
    tournamentDays?: string[];
    timeZone?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
    discord?: string;
  };
  logo?: File | null;
  banner?: File | null;
}

export interface UpdateClubData extends Partial<CreateClubData> {
  id?: string;
}

export interface ClubStats {
  totalClubs: number;
  activeClubs: number;
  featuredClubs: number;
  totalMembers: number;
  byStatus?: Array<{
    status: string;
    count: number;
  }>;
  byType?: Array<{
    type: string;
    count: number;
    avgMembers: number;
  }>;
  byCity?: Array<{
    city: string;
    count: number;
  }>;
  topClubs?: Array<{
    id: string;
    name: string;
    members: number;
  }>;
  byGameType?: Array<{
    gameType: string;
    count: number;
  }>;
  byCountry?: Array<{
    country: string;
    count: number;
  }>;
}