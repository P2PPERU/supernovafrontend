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

// News Types
export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  featuredImage?: string;
  authorId: string;
  author?: User;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
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