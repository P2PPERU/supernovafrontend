// src/services/admin/dashboard.service.ts
import { api } from '@/lib/axios';

interface DashboardStats {
  users: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    byRole: Array<{ role: string; count: number }>;
    recentUsers: Array<{
      id: string;
      username: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    lastMonthUsers?: number;
  };
  bonus: {
    active: number;
    claimed: number;
    pending: number;
    expired: number;
    totalValue: number;
    monthlyRevenue?: number;
  };
  roulette: {
    todaySpins: number;
    pendingValidations: number;
    todayRevenue: number;
    activeUsers: number;
    topPrize: string;
    conversionRate: number;
    totalPrizes: number;
    biggestWin: number;
    monthlyRevenue?: number;
    hourlyActivity?: Array<{
      hour: number;
      spins: number;
      revenue: number;
    }>;
    prizeDistribution?: Array<{
      type: string;
      count: number;
      totalValue: number;
    }>;
    topWinners?: Array<{
      userId: string;
      username: string;
      totalWins: number;
      biggestWin: number;
      totalSpins?: number;
      wins?: number;
    }>;
  };
  news: {
    totalNews: number;
    byStatus: Array<{ status: string; count: number }>;
    byCategory: Array<{ 
      category: string; 
      count: number; 
      totalViews: number;
      avgViews: number;
    }>;
    topNews: Array<{
      id: string;
      title: string;
      views: number;
      category: string;
    }>;
    totalViews: number;
  };
  rankings: {
    totalPlayers: number;
    activeThisWeek: number;
    topPlayer: string;
    byType?: Array<{
      type: string;
      count: number;
    }>;
  };
  tournaments?: {
    active: number;
    pending: number;
    completed: number;
    totalParticipants: number;
    totalPrizePool: number;
  };
}

interface RevenueData {
  daily: Array<{
    date: string;
    ruleta: number;
    bonos: number;
    total: number;
  }>;
  weekly: Array<{
    week: string;
    ruleta: number;
    bonos: number;
    total: number;
  }>;
  monthly: Array<{
    month: string;
    ruleta: number;
    bonos: number;
    total: number;
  }>;
}

export const dashboardService = {
  // Obtener todas las estadísticas del dashboard
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Hacer todas las llamadas en paralelo para mejor performance
      const [
        usersResponse,
        bonusResponse,
        rouletteResponse,
        newsResponse,
        rankingsResponse
      ] = await Promise.allSettled([
        api.get('/users/stats'),
        api.get('/bonus/stats'),
        api.get('/roulette/stats'),
        api.get('/news/stats/overview'),
        api.get('/rankings/stats')
      ]);

      // Procesar respuestas con valores por defecto en caso de error
      const usersData = usersResponse.status === 'fulfilled' 
        ? usersResponse.value.data.stats 
        : getDefaultUserStats();
      
      const bonusData = bonusResponse.status === 'fulfilled'
        ? bonusResponse.value.data.stats
        : getDefaultBonusStats();
      
      const rouletteData = rouletteResponse.status === 'fulfilled'
        ? rouletteResponse.value.data.stats
        : getDefaultRouletteStats();
      
      const newsData = newsResponse.status === 'fulfilled'
        ? newsResponse.value.data.stats
        : getDefaultNewsStats();
      
      const rankingsData = rankingsResponse.status === 'fulfilled'
        ? rankingsResponse.value.data.stats
        : getDefaultRankingsStats();

      return {
        users: usersData,
        bonus: bonusData,
        roulette: rouletteData,
        news: newsData,
        rankings: rankingsData,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Obtener datos de ingresos
  getRevenueData: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<RevenueData> => {
    try {
      const response = await api.get('/stats/revenue', {
        params: { period }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Retornar datos por defecto en caso de error
      return getDefaultRevenueData();
    }
  },

  // Obtener actividad reciente
  getRecentActivity: async (limit: number = 10): Promise<any[]> => {
    try {
      const response = await api.get('/activity/recent', {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // Obtener métricas de performance
  getPerformanceMetrics: async (): Promise<any> => {
    try {
      const response = await api.get('/stats/performance');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return getDefaultPerformanceMetrics();
    }
  }
};

// Funciones para valores por defecto
function getDefaultUserStats() {
  return {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    byRole: [],
    recentUsers: []
  };
}

function getDefaultBonusStats() {
  return {
    active: 0,
    claimed: 0,
    pending: 0,
    expired: 0,
    totalValue: 0
  };
}

function getDefaultRouletteStats() {
  return {
    todaySpins: 0,
    pendingValidations: 0,
    todayRevenue: 0,
    activeUsers: 0,
    topPrize: 'N/A',
    conversionRate: 0,
    totalPrizes: 0,
    biggestWin: 0,
    hourlyActivity: [],
    prizeDistribution: [],
    topWinners: []
  };
}

function getDefaultNewsStats() {
  return {
    totalNews: 0,
    byStatus: [],
    byCategory: [],
    topNews: [],
    totalViews: 0
  };
}

function getDefaultRankingsStats() {
  return {
    totalPlayers: 0,
    activeThisWeek: 0,
    topPlayer: 'N/A'
  };
}

function getDefaultRevenueData(): RevenueData {
  return {
    daily: [],
    weekly: [],
    monthly: [
      { month: 'Ene', ruleta: 0, bonos: 0, total: 0 },
      { month: 'Feb', ruleta: 0, bonos: 0, total: 0 },
      { month: 'Mar', ruleta: 0, bonos: 0, total: 0 },
      { month: 'Abr', ruleta: 0, bonos: 0, total: 0 },
      { month: 'May', ruleta: 0, bonos: 0, total: 0 },
      { month: 'Jun', ruleta: 0, bonos: 0, total: 0 },
    ]
  };
}

function getDefaultPerformanceMetrics() {
  return {
    userScore: 0,
    revenueScore: 0,
    rouletteScore: 0,
    bonusScore: 0,
    newsScore: 0,
    overallScore: 0
  };
}