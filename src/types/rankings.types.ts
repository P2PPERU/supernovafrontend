// src/types/rankings.types.ts

export interface Ranking {
  id: string;
  
  // Jugador (uno de los dos)
  player_id?: string;
  external_player_name?: string;
  external_player_email?: string;
  is_external: boolean;
  
  // Configuración del ranking
  ranking_type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  season: string; // Formato YYYY-MM
  ranking_period: 'all_time' | 'monthly' | 'weekly' | 'daily';
  
  // Estadísticas principales
  points: number;
  hands_played: number;
  tournaments_played: number;
  total_rake: number;
  
  // Estadísticas de juego
  wins: number;
  losses: number;
  games_played: number; // Calculado: wins + losses
  win_rate: number; // Calculado: (wins/games_played)*100
  
  // Posicionamiento
  position: number; // Calculado automáticamente
  is_visible: boolean;
  
  // Metadatos
  history?: RankingHistoryEntry[]; // Array de cambios históricos
  custom_data?: any; // Datos personalizados
  last_updated_by?: string; // Admin que hizo el cambio
  last_import_date?: string; // Fecha de última importación
  import_filename?: string; // Archivo de origen
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relaciones (populated en respuestas)
  player?: {
    id: string;
    username: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
  updatedBy?: {
    username: string;
  };
  
  // Campos display (añadidos en respuestas)
  displayName: string; // player.username || external_player_name
  displayEmail: string; // player.email || external_player_email
}

export interface RankingHistoryEntry {
  date: string;
  points: number;
  position: number;
  hands_played?: number;
  tournaments_played?: number;
  total_rake?: number;
  win_rate?: number;
}

export interface RankingFilters {
  type?: 'points' | 'hands_played' | 'tournaments' | 'rake';
  season?: string;
  period?: 'all_time' | 'monthly' | 'weekly' | 'daily';
  search?: string;
  page?: number;
  limit?: number;
  includeHidden?: boolean;
}

export interface CreateRankingData {
  // Tipo de ranking
  type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  
  // Estadísticas
  points?: number;
  handsPlayed?: number;
  tournamentsPlayed?: number;
  totalRake?: number;
  wins?: number;
  losses?: number;
  
  // Configuración
  season: string;
  period?: 'all_time' | 'monthly' | 'weekly' | 'daily';
  isVisible?: boolean;
  
  // Para jugadores externos
  externalPlayerName?: string;
  externalPlayerEmail?: string;
}

export interface UpdateRankingData extends Partial<CreateRankingData> {}

export interface PlayerRankingProfile {
  player: {
    id?: string;
    username?: string;
    name?: string; // Para externos
    email?: string;
    isExternal?: boolean;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
  rankings: Array<{
    type: string;
    season: string;
    period: string;
    position: number;
    points: number;
    handsPlayed: number;
    tournamentsPlayed: number;
    totalRake: number;
    winRate: number;
    history: RankingHistoryEntry[];
  }>;
}

export interface RankingStats {
  playersByType: Array<{
    type: string;
    players: number;
  }>;
  playerDistribution: {
    registered: number;
    external: number;
  };
  averages: Array<{
    type: string;
    avgPoints: number;
    avgHands: number;
    avgTournaments: number;
    avgRake: number;
  }>;
  topPlayers: Array<{
    displayName: string;
    points: number;
    position: number;
    is_external: boolean;
  }>;
  recentUpdates: Array<{
    displayName: string;
    ranking_type: string;
    updated_at: string;
    updatedBy: {
      username: string;
    };
  }>;
}

export interface RankingsResponse {
  success: boolean;
  rankings: Ranking[];
  totalPages: number;
  currentPage: number;
  totalPlayers: number;
  type: string;
  season: string;
  period: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  summary: {
    created: number;
    updated: number;
    errors: number;
    total: number;
  };
  errors?: Array<{
    row: any;
    error: string;
  }>;
}

export interface RecalculateResult {
  success: boolean;
  message: string;
  totalUpdated: number;
}

export interface SearchPlayersResult {
  success: boolean;
  results: {
    registered: Array<{
      id: string;
      username: string;
      email: string;
    }>;
    external: Array<{
      name: string;
      external_player_email: string;
    }>;
  };
}

// Constantes para tipos de datos
export const RANKING_TYPES = {
  POINTS: 'points',
  HANDS_PLAYED: 'hands_played', 
  TOURNAMENTS: 'tournaments',
  RAKE: 'rake'
} as const;

export const RANKING_PERIODS = {
  ALL_TIME: 'all_time',
  MONTHLY: 'monthly',
  WEEKLY: 'weekly',
  DAILY: 'daily'
} as const;

export const RANKING_SEASONS = [
  '2025-01', '2025-02', '2025-03', '2024-10',
  '2024-09', '2024-08', '2024-07', '2024-06'
] as const;

// Helpers para validación
export const isValidRankingType = (type: string): type is keyof typeof RANKING_TYPES => {
  return Object.values(RANKING_TYPES).includes(type as any);
};

export const isValidRankingPeriod = (period: string): period is keyof typeof RANKING_PERIODS => {
  return Object.values(RANKING_PERIODS).includes(period as any);
};

export const isValidSeason = (season: string): boolean => {
  return /^\d{4}-\d{2}$/.test(season);
};