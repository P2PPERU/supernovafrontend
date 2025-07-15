// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'agent' | 'editor' | 'client';
  balance: number;
  isActive: boolean;
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

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
}

// News types
export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: 'general' | 'tournament' | 'promotion' | 'update';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  imageUrl?: string;
  views: number;
  author: User;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Roulette types
export interface RoulettePrize {
  id: string;
  name: string;
  description?: string;
  prizeType: string;
  prizeBehavior: 'instant_cash' | 'bonus' | 'manual' | 'custom';
  prizeValue: number;
  probability: number;
  color: string;
  position: number;
  isActive: boolean;
}

export interface RouletteSpinResult {
  id: string;
  type: 'demo' | 'welcome_real' | 'code' | 'bonus';
  isReal: boolean;
  prize: RoulettePrize;
  message: string;
}

export interface SpinStatus {
  hasDemoAvailable: boolean;
  hasRealAvailable: boolean;
  demoSpinDone: boolean;
  realSpinDone: boolean;
  isValidated: boolean;
  totalSpins: number;
  availableBonusSpins: number;
  demoPrize?: RoulettePrize;
}

// Ranking types
export interface Ranking {
  id: string;
  playerId?: string;
  externalPlayerName?: string;
  externalPlayerEmail?: string;
  type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  season: string;
  period: 'all_time' | 'monthly' | 'weekly' | 'daily';
  position: number;
  points: number;
  handsPlayed: number;
  tournamentsPlayed: number;
  totalRake: number;
  wins: number;
  losses: number;
  winRate: number;
  isVisible: boolean;
  player?: User;
}

// Bonus types
export interface Bonus {
  id: string;
  name: string;
  description?: string;
  type: 'welcome' | 'deposit' | 'referral' | 'achievement' | 'custom';
  amount: number;
  percentage?: number;
  minDeposit?: number;
  maxBonus?: number;
  status: 'pending' | 'active' | 'claimed' | 'expired';
  validUntil?: string;
  assignedTo: string;
  assignedBy: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}