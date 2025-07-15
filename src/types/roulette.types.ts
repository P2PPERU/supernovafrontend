// Tipos específicos para el módulo de ruleta

export interface RoulettePrize {
  id?: string;
  name: string;
  description?: string;
  prize_type?: string;
  type?: string;
  prize_value?: number;
  value?: number;
  color?: string;
  position?: number;
}

export interface RouletteSpinResult {
  id?: string;
  type?: string;
  spin_type?: string;
  isReal?: boolean;
  is_real_prize?: boolean;
  prize?: RoulettePrize;
  message?: string;
}

export interface SpinHistoryItem {
  id: string;
  spin_type: string;
  is_real_prize: boolean;
  spin_date: string;
  prize_status: string;
  prize?: RoulettePrize;
}

export interface RouletteStatus {
  hasDemoAvailable: boolean;
  hasRealAvailable: boolean;
  demoSpinDone: boolean;
  realSpinDone: boolean;
  isValidated: boolean;
  totalSpins: number;
  availableBonusSpins: number;
  demoPrize?: RoulettePrize;
}

export interface RouletteHistoryResponse {
  success: boolean;
  spins: SpinHistoryItem[];
  totalPages: number;
  currentPage: number;
}

export interface RouletteStatusResponse {
  success: boolean;
  status: RouletteStatus;
}

export interface RouletteSpinResponse {
  success: boolean;
  spin: RouletteSpinResult;
}