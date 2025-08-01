// Tipos principales para las salas
export interface Room {
  id: string;
  name: string;
  slug: string;
  logo: string;
  color: string;
  gradientColors: {
    from: string;
    to: string;
  };
  description: string;
  shortDescription: string;
  rating: number;
  totalReviews: number;
  activePlayers: string;
  badge: string;
  badgeColor: string;
  featured: boolean;
  order: number;
  images: {
    hero?: string;
    gallery?: string[];
    logo?: string;
  };
  bonus: RoomBonus;
  rakeback: RoomRakeback;
  features: RoomFeature[];
  paymentMethods: PaymentMethod[];
  stats: RoomStats;
  pros: string[];
  cons: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoomBonus {
  welcome: {
    amount: number;
    currency: string;
    percentage?: number;
    maxBonus?: number;
    description: string;
  };
  deposit?: {
    percentage: number;
    maxAmount: number;
    minDeposit: number;
  };
  noDeposit?: {
    amount: number;
    description: string;
  };
  reload?: {
    percentage: number;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  specialOffers?: string[];
}

export interface RoomRakeback {
  percentage: number;
  type: 'fixed' | 'progressive' | 'vip-based';
  tiers?: {
    level: string;
    percentage: number;
    requirements: string;
  }[];
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly';
  description?: string;
}

export interface RoomFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlighted?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'deposit' | 'withdrawal' | 'both';
  processingTime?: string;
  minAmount?: number;
  maxAmount?: number;
  fees?: string;
}

export interface RoomStats {
  totalPlayers: number;
  dailyTournaments: number;
  tablesAvailable: number;
  avgPotSize: number;
  biggestWin: number;
  uptime: number; // percentage
}

export interface RoomReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  roomId: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  verifiedPlayer: boolean;
  playTime: string; // e.g., "6 meses"
  helpfulVotes: number;
  createdAt: string;
}

// Enums y constantes
export enum RoomCategory {
  PREMIUM = 'premium',
  POPULAR = 'popular',
  HIGH_RAKEBACK = 'high_rakeback',
  BEGINNERS = 'beginners',
  HIGH_STAKES = 'high_stakes'
}

export enum RoomGameType {
  TEXAS_HOLDEM = 'texas_holdem',
  OMAHA = 'omaha',
  STUD = 'stud',
  MIXED = 'mixed',
  TOURNAMENTS = 'tournaments',
  CASH_GAMES = 'cash_games'
}

// Tipos para filtros y búsqueda
export interface RoomFilters {
  search?: string;
  category?: RoomCategory;
  minRakeback?: number;
  minBonus?: number;
  gameTypes?: RoomGameType[];
  sortBy?: 'rating' | 'players' | 'bonus' | 'rakeback' | 'name';
  order?: 'asc' | 'desc';
}

// Respuesta paginada
export interface RoomsResponse {
  rooms: Room[];
  total: number;
  page: number;
  totalPages: number;
}