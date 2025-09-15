// src/types/rankings.types.ts - Actualizado para grupos

// ===== GRUPOS DE RANKINGS =====

export interface RankingGroup {
  id: string;
  name: string;
  description?: string;
  ranking_type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_visible: boolean;
  settings: any;
  created_at: string;
  updated_at: string;
  
  // Relaciones (populated en respuestas)
  creator?: {
    id: string;
    username: string;
  };
  updatedBy?: {
    id: string;
    username: string;
  };
  rankings?: Ranking[];
  
  // Campos calculados (añadidos en respuestas)
  playerCount: number;
  status: 'active' | 'upcoming' | 'finished';
  isActive: boolean;
}

export interface CreateRankingGroupData {
  name: string;
  description?: string;
  ranking_type: 'points' | 'hands_played' | 'tournaments' | 'rake';
  start_date: string;
  end_date: string;
  is_active?: boolean;
  is_visible?: boolean;
  settings?: any;
}

export interface UpdateRankingGroupData extends Partial<CreateRankingGroupData> {}

export interface DuplicateRankingGroupData {
  name?: string;
  start_date: string;
  end_date: string;
  copy_rankings?: boolean;
}

// ===== RANKINGS INDIVIDUALES =====

export interface Ranking {
  id: string;
  
  // Relación con grupo
  ranking_group_id: string;
  
  // Jugador (uno de los dos)
  player_id?: string;
  external_player_name?: string;
  external_player_email?: string;
  is_external: boolean;
  
  // Estadísticas principales
  points: number;
  hands_played: number;
  tournaments_played: number;
  total_rake: number;
  
  // Estadísticas de juego
  wins: number;
  losses: number;
  games_played: number;
  win_rate: number;
  
  // Posicionamiento
  position: number;
  is_visible: boolean;
  
  // Metadatos
  history?: RankingHistoryEntry[];
  custom_data?: any;
  last_updated_by?: string;
  last_import_date?: string;
  import_filename?: string;
  
  // Campos legacy (para compatibilidad)
  ranking_type?: string;
  season?: string;
  ranking_period?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relaciones (populated en respuestas)
  player?: {
    id: string;
    username: string;
    email: string;
    profile_data?: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
  rankingGroup?: {
    id: string;
    name: string;
    ranking_type: string;
    start_date: string;
    end_date: string;
  };
  updatedBy?: {
    username: string;
  };
  
  // Campos display (añadidos en respuestas)
  displayName: string;
  displayEmail: string;
}

export interface RankingHistoryEntry {
  date: string;
  points: number;
  position: number;
  hands_played?: number;
  tournaments_played?: number;
  total_rake?: number;
  win_rate?: number;
  updated_by?: string;
}

// ===== DATOS PARA CREAR/ACTUALIZAR RANKINGS =====

export interface CreateRankingData {
  points?: number;
  handsPlayed?: number;
  tournamentsPlayed?: number;
  totalRake?: number;
  wins?: number;
  losses?: number;
  isVisible?: boolean;
  externalPlayerName?: string;
  externalPlayerEmail?: string;
}

export interface UpdateRankingData extends Partial<CreateRankingData> {}

// ===== FILTROS =====

export interface RankingGroupFilters {
  active?: boolean;
  type?: 'points' | 'hands_played' | 'tournaments' | 'rake';
  page?: number;
  limit?: number;
}

export interface GroupRankingFilters {
  page?: number;
  limit?: number;
}

export interface AdminGroupFilters {
  includeHidden?: boolean;
  type?: 'points' | 'hands_played' | 'tournaments' | 'rake';
  status?: 'active' | 'upcoming' | 'finished';
  page?: number;
  limit?: number;
}

export interface AdminRankingFilters {
  includeHidden?: boolean;
  page?: number;
  limit?: number;
}

// Legacy filters (compatibilidad)
export interface LegacyRankingFilters {
  type?: 'points' | 'hands_played' | 'tournaments' | 'rake';
  season?: string;
  period?: 'all_time' | 'monthly' | 'weekly' | 'daily';
  search?: string;
  page?: number;
  limit?: number;
  includeHidden?: boolean;
}

// ===== RESPUESTAS DE API =====

export interface RankingGroupsResponse {
  success: boolean;
  groups: RankingGroup[];
  totalPages: number;
  currentPage: number;
  totalGroups: number;
}

export interface RankingGroupResponse {
  success: boolean;
  group: RankingGroup;
  rankings: Ranking[];
  totalPages: number;
  currentPage: number;
  totalPlayers: number;
}

export interface GroupRankingsResponse {
  success: boolean;
  group: {
    id: string;
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  rankings: Ranking[];
  totalPages: number;
  currentPage: number;
  totalPlayers: number;
}

export interface AdminGroupsResponse {
  success: boolean;
  groups: RankingGroup[];
  totalPages: number;
  currentPage: number;
  totalGroups: number;
}

export interface AdminGroupRankingsResponse {
  success: boolean;
  group: {
    id: string;
    name: string;
    type: string;
  };
  rankings: Ranking[];
  totalPages: number;
  currentPage: number;
  totalRecords: number;
}

export interface PlayerInGroupResponse {
  success: boolean;
  player: {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    isExternal?: boolean;
    profile?: any;
  };
  group: {
    id: string;
    name: string;
    type: string;
  };
  ranking: {
    position: number;
    points: number;
    handsPlayed: number;
    tournamentsPlayed: number;
    totalRake: number;
    wins: number;
    losses: number;
    winRate: number;
    history: RankingHistoryEntry[];
  };
}

// ===== ESTADÍSTICAS =====

export interface GroupStats {
  group: {
    id: string;
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  stats: {
    totalPlayers: number;
    playerDistribution: {
      registered: number;
      external: number;
    };
    averages: {
      primaryField: string;
      avgValue: number;
      avgWins: number;
      avgLosses: number;
      avgWinRate: number;
    };
    topPlayers: Ranking[];
    recentUpdates: Ranking[];
  };
}

export interface LegacyRankingStats {
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
  topPlayers: Ranking[];
  recentUpdates: Ranking[];
}

// ===== IMPORTACIÓN Y EXPORTACIÓN =====

export interface ImportResult {
  success: boolean;
  message: string;
  group?: {
    id: string;
    name: string;
    type: string;
  };
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
  group?: {
    id: string;
    name: string;
    type: string;
  };
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

// ===== RESPUESTAS LEGACY (COMPATIBILIDAD) =====

export interface LegacyRankingsResponse {
  success: boolean;
  rankings: Ranking[];
  totalPages: number;
  currentPage: number;
  totalPlayers: number;
  type: string;
  season: string;
  period: string;
}

export interface LegacyPlayerRankingResponse {
  success: boolean;
  player: {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    isExternal?: boolean;
    profile?: any;
  };
  rankings: Array<{
    groupId: string;
    groupName: string;
    type: string;
    startDate: string;
    endDate: string;
    position: number;
    points: number;
    handsPlayed: number;
    tournamentsPlayed: number;
    totalRake: number;
    winRate: number;
    history: RankingHistoryEntry[];
  }>;
}

// ===== CONSTANTES =====

export const RANKING_TYPES = {
  POINTS: 'points',
  HANDS_PLAYED: 'hands_played',
  TOURNAMENTS: 'tournaments',
  RAKE: 'rake'
} as const;

export const GROUP_STATUS = {
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  FINISHED: 'finished'
} as const;

export const RANKING_PERIODS = {
  ALL_TIME: 'all_time',
  MONTHLY: 'monthly',
  WEEKLY: 'weekly',
  DAILY: 'daily'
} as const;

// ===== HELPERS PARA VALIDACIÓN =====

export const isValidRankingType = (type: string): type is keyof typeof RANKING_TYPES => {
  return Object.values(RANKING_TYPES).includes(type as any);
};

export const isValidGroupStatus = (status: string): status is keyof typeof GROUP_STATUS => {
  return Object.values(GROUP_STATUS).includes(status as any);
};

export const getGroupStatus = (startDate: string, endDate: string): keyof typeof GROUP_STATUS => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'UPCOMING';
  if (now > end) return 'FINISHED';
  return 'ACTIVE';
};

export const isGroupActive = (startDate: string, endDate: string): boolean => {
  return getGroupStatus(startDate, endDate) === 'ACTIVE';
};

// ===== CONFIGURACIÓN DE TIPOS DE RANKING =====

export const RANKING_TYPE_CONFIG = {
  points: {
    label: 'Puntos',
    icon: 'Target',
    color: 'text-purple-500',
    description: 'Basado en puntos acumulados',
    field: 'points'
  },
  hands_played: {
    label: 'Manos Jugadas',
    icon: 'Gamepad2',
    color: 'text-blue-500',
    description: 'Cantidad de manos jugadas',
    field: 'hands_played'
  },
  tournaments: {
    label: 'Torneos',
    icon: 'Trophy',
    color: 'text-yellow-500',
    description: 'Torneos ganados y participados',
    field: 'tournaments_played'
  },
  rake: {
    label: 'Rake',
    icon: 'DollarSign',
    color: 'text-green-500',
    description: 'Rake total contribuido',
    field: 'total_rake'
  }
} as const;

export type RankingTypeKey = keyof typeof RANKING_TYPE_CONFIG;