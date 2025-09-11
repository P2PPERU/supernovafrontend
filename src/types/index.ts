// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'agent' | 'editor' | 'client';
  balance: number;
  isActive: boolean;
  parentAgentId?: string;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  affiliateId?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// News Types - ACTUALIZADO
export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  summary?: string; // Nuevo
  category: string;
  tags?: string[]; // Nuevo
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  featuredImage?: string;
  imageUrl?: string; // Nuevo
  authorId: string;
  author?: User;
  views?: number; // Nuevo
  readTime?: number; // Nuevo - en minutos
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Club Types
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

// Tournament Types
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type: 'sit_and_go' | 'scheduled' | 'freeroll' | 'satellite';
  gameType: 'texas_holdem' | 'omaha' | 'seven_card_stud' | 'mixed';
  buyIn: number;
  prizePool: number;
  guaranteedPrizePool?: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'upcoming' | 'registering' | 'running' | 'finished' | 'cancelled';
  startTime: string;
  endTime?: string;
  registrationDeadline?: string;
  structure: {
    blindLevels: Array<{
      level: number;
      smallBlind: number;
      bigBlind: number;
      ante?: number;
      duration: number; // en minutos
    }>;
    startingChips: number;
    payoutStructure: Array<{
      position: number;
      percentage: number;
    }>;
  };
  clubId?: string;
  club?: Club;
  createdBy: string;
  creator?: User;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tournament Registration Types
export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  tournament?: Tournament;
  playerId: string;
  player?: User;
  registeredAt: string;
  status: 'registered' | 'checked_in' | 'playing' | 'eliminated' | 'finished';
  finalPosition?: number;
  prizeWon?: number;
  eliminatedAt?: string;
}

// Ranking Types
export interface Ranking {
  id: string;
  playerId: string;
  player?: User;
  type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  points: number;
  handsPlayed: number;
  tournamentsPlayed: number;
  totalRake: number;
  wins: number;
  losses: number;
  season: string;
  period: 'all_time' | 'monthly' | 'weekly' | 'daily';
  position: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Roulette Types - ACTUALIZADO A SNAKE_CASE
export interface SpinStatus {
  has_demo_available: boolean;
  has_real_available: boolean;
  demo_spin_done: boolean;
  real_spin_done: boolean;
  is_validated: boolean;
  total_spins: number;
  available_bonus_spins: number;
  demo_prize?: RoulettePrize;
}

export interface RoulettePrize {
  id?: string;
  name: string;
  description?: string;
  prize_type: string;
  prize_value: number;
  color?: string;
  icon?: string;
}

export interface RouletteSpinResult {
  id: string;
  type: 'demo' | 'welcome_real' | 'code' | 'bonus';
  isReal: boolean;
  prize: RoulettePrize;
  message?: string;
}

// Bonus Types
export interface Bonus {
  id: string;
  name: string;
  description?: string;
  type: 'welcome' | 'deposit' | 'referral' | 'achievement' | 'custom' | 'roulette_spin';
  status: 'pending' | 'active' | 'claimed' | 'expired';
  amount?: number;
  percentage?: number;
  minDeposit?: number;
  maxBonus?: number;
  validUntil?: string;
  assignedTo: string;
  assignedBy: string;
  claimedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface Report {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  category: 'users' | 'revenue' | 'tournaments' | 'clubs' | 'roulette' | 'general';
  data: any; // JSON data del reporte
  generatedBy: string;
  generator?: User;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface SystemSettings {
  id: string;
  category: 'general' | 'security' | 'email' | 'payment' | 'tournament' | 'roulette';
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic: boolean;
  updatedBy: string;
  updater?: User;
  updatedAt: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  entity: 'user' | 'club' | 'tournament' | 'news' | 'bonus' | 'roulette' | 'system';
  entityId?: string;
  details?: any; // JSON con detalles adicionales
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  user?: User;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any; // JSON con datos adicionales
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Dashboard Statistics Types
export interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    change: number;
    byRole: Array<{ role: string; count: number }>;
    recentUsers: Array<{ id: string; username: string; createdAt: string; role: string }>;
  };
  clubs: {
    total: number;
    active: number;
    featured: number;
    totalMembers: number;
    byCountry: Array<{ country: string; count: number }>;
    topClubs: Array<{ id: string; name: string; members: number; rating: number }>;
  };
  tournaments: {
    total: number;
    active: number;
    upcoming: number;
    totalPrizePool: number;
    totalParticipants: number;
    byType: Array<{ type: string; count: number }>;
  };
  revenue: {
    month: number;
    today: number;
    change: number;
    lastMonth: number;
    bySource: Array<{ source: string; amount: number }>;
  };
  system: {
    totalNotifications: number;
    unreadNotifications: number;
    activeAlerts: number;
    systemHealth: 'good' | 'warning' | 'critical';
  };
}