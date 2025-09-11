// src/types/club.types.ts
export interface Club {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  logo?: string;
  banner?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  features: string[];
  gameTypes: string[];
  location?: {
    country: string;
    city?: string;
    address?: string;
  };
  requirements?: {
    minAge: number;
    verificationRequired: boolean;
    minDeposit?: number;
  };
  schedule?: {
    timeZone: string;
    openHours: string;
    tournamentDays: string[];
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
    discord?: string;
  };
  stats?: {
    totalMembers: number;
    activePlayers: number;
    totalTournaments: number;
    avgPrizePool: number;
  };
  rating?: number;
  totalReviews?: number;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClubFilters {
  page?: number;
  limit?: number;
  search?: string;
  gameType?: string;
  country?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'rating' | 'members' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CreateClubData {
  name: string;
  description: string;
  shortDescription?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  features: string[];
  gameTypes: string[];
  location?: {
    country: string;
    city?: string;
    address?: string;
  };
  requirements?: {
    minAge: number;
    verificationRequired: boolean;
    minDeposit?: number;
  };
  schedule?: {
    timeZone: string;
    openHours: string;
    tournamentDays: string[];
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
    discord?: string;
  };
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  logo?: File | null;
  banner?: File | null;
}

// Form data type that matches the zod schema exactly
export interface CreateClubFormData {
  name: string;
  description: string;
  shortDescription?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  features: string[];
  gameTypes: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  // Location fields (flattened)
  locationCountry?: string;
  locationCity?: string;
  locationAddress?: string;
  // Requirements fields (flattened)
  minAge: number;
  verificationRequired: boolean;
  minDeposit?: number;
  // Schedule fields (flattened)
  timeZone?: string;
  openHours?: string;
  tournamentDays: string[];
  // Social Links fields (flattened)
  facebook?: string;
  twitter?: string;
  instagram?: string;
  telegram?: string;
  discord?: string;
}

export interface UpdateClubData extends Partial<CreateClubData> {}

export interface ClubStats {
  totalClubs: number;
  activeClubs: number;
  featuredClubs: number;
  totalMembers: number;
  byGameType: Array<{
    gameType: string;
    count: number;
  }>;
  byCountry: Array<{
    country: string;
    count: number;
  }>;
  topClubs: Array<{
    id: string;
    name: string;
    members: number;
    rating: number;
  }>;
}