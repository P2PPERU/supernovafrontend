// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Gift,
  Gamepad2,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Dices,
  AlertCircle,
  Shield,
  Newspaper,
  Trophy,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  Zap,
  Target,
  Sparkles,
  TrendingDown,
  Calendar,
  CreditCard,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

// Interfaces
interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    change: number;
    byRole: Array<{ role: string; count: number }>;
    recentUsers: Array<{ id: string; username: string; createdAt: string; role: string }>;
  };
  revenue: {
    month: number;
    today: number;
    change: number;
    lastMonth: number;
  };
  tournaments: {
    active: number;
    pending: number;
    participants: number;
    totalPrizePool: number;
  };
  bonus: {
    active: number;
    claimed: number;
    pending: number;
    expired: number;
    totalValue: number;
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
  };
  news: {
    total: number;
    published: number;
    draft: number;
    totalViews: number;
  };
  rankings: {
    totalPlayers: number;
    activeThisWeek: number;
    topPlayer: string;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      // Fetch todos los endpoints en paralelo
      const [
        usersResponse,
        bonusResponse,
        rouletteStatsResponse,
        newsStatsResponse,
        rankingsResponse
      ] = await Promise.allSettled([
        fetch(`${API_URL}/api/users/stats`, { headers }),
        fetch(`${API_URL}/api/bonus/stats`, { headers }),
        fetch(`${API_URL}/api/roulette/stats`, { headers }),
        fetch(`${API_URL}/api/news/stats/overview`, { headers }),
        fetch(`${API_URL}/api/rankings/stats`, { headers })
      ]);

      // Procesar respuestas de forma segura
      const usersData = usersResponse.status === 'fulfilled' && usersResponse.value.ok 
        ? await usersResponse.value.json() 
        : null;
      const bonusData = bonusResponse.status === 'fulfilled' && bonusResponse.value.ok 
        ? await bonusResponse.value.json() 
        : null;
      const rouletteData = rouletteStatsResponse.status === 'fulfilled' && rouletteStatsResponse.value.ok 
        ? await rouletteStatsResponse.value.json() 
        : null;
      const newsData = newsStatsResponse.status === 'fulfilled' && newsStatsResponse.value.ok 
        ? await newsStatsResponse.value.json() 
        : null;
      const rankingsData = rankingsResponse.status === 'fulfilled' && rankingsResponse.value.ok 
        ? await rankingsResponse.value.json() 
        : null;

      // Consolidar estadísticas
      const consolidatedStats: DashboardStats = {
        users: {
          total: usersData?.stats?.totalUsers || 0,
          active: usersData?.stats?.activeUsers || 0,
          new: usersData?.stats?.recentUsers?.length || 0,
          change: calculateChange(usersData?.stats?.totalUsers, usersData?.stats?.lastMonthUsers),
          byRole: usersData?.stats?.byRole || [],
          recentUsers: usersData?.stats?.recentUsers || []
        },
        revenue: {
          month: calculateMonthlyRevenue(rouletteData, bonusData),
          today: rouletteData?.stats?.todayRevenue || 0,
          change: 23.1,
          lastMonth: 0
        },
        tournaments: {
          active: 12,
          pending: 5,
          participants: 234,
          totalPrizePool: 45000
        },
        bonus: {
          active: bonusData?.stats?.active || 0,
          claimed: bonusData?.stats?.claimed || 0,
          pending: bonusData?.stats?.pending || 0,
          expired: bonusData?.stats?.expired || 0,
          totalValue: bonusData?.stats?.totalValue || 0
        },
        roulette: {
          todaySpins: rouletteData?.stats?.todaySpins || 0,
          pendingValidations: rouletteData?.stats?.pendingValidations || 0,
          todayRevenue: rouletteData?.stats?.todayRevenue || 0,
          activeUsers: rouletteData?.stats?.activeUsers || 0,
          topPrize: rouletteData?.stats?.topPrize || 'S/ 500',
          conversionRate: rouletteData?.stats?.conversionRate || 0.35,
          totalPrizes: rouletteData?.stats?.totalPrizes || 0,
          biggestWin: rouletteData?.stats?.biggestWin || 0
        },
        news: {
          total: newsData?.stats?.totalNews || 0,
          published: newsData?.stats?.byStatus?.find((s: any) => s.status === 'published')?.count || 0,
          draft: newsData?.stats?.byStatus?.find((s: any) => s.status === 'draft')?.count || 0,
          totalViews: newsData?.stats?.totalViews || 0
        },
        rankings: {
          totalPlayers: rankingsData?.stats?.totalPlayers || 0,
          activeThisWeek: rankingsData?.stats?.activeThisWeek || 0,
          topPlayer: rankingsData?.stats?.topPlayer || 'N/A'
        }
      };

      setStats(consolidatedStats);

      // Generar datos para gráficos
      generateChartData(rouletteData, bonusData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (!silent) {
        toast.error('Error al cargar algunos datos del dashboard');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateMonthlyRevenue = (rouletteData: any, bonusData: any) => {
    const rouletteRevenue = rouletteData?.stats?.monthlyRevenue || 0;
    const bonusRevenue = bonusData?.stats?.monthlyRevenue || 0;
    return rouletteRevenue + bonusRevenue;
  };

  const generateChartData = (rouletteData: any, bonusData: any) => {
    // Datos de ingresos mensuales
    setRevenueData([
      { month: 'Ene', ruleta: 12000, bonos: 3000, total: 15000 },
      { month: 'Feb', ruleta: 19000, bonos: 4000, total: 23000 },
      { month: 'Mar', ruleta: 15000, bonos: 3500, total: 18500 },
      { month: 'Abr', ruleta: 25000, bonos: 5000, total: 30000 },
      { month: 'May', ruleta: 22000, bonos: 4500, total: 26500 },
      { month: 'Jun', ruleta: 30000, bonos: 6000, total: 36000 },
      { month: 'Jul', ruleta: 35000, bonos: 7000, total: 42000 },
    ]);

    // Datos de actividad semanal
    setActivityData([
      { day: 'Lun', usuarios: 400, giros: 240, bonos: 45 },
      { day: 'Mar', usuarios: 300, giros: 139, bonos: 32 },
      { day: 'Mie', usuarios: 500, giros: 380, bonos: 67 },
      { day: 'Jue', usuarios: 278, giros: 390, bonos: 54 },
      { day: 'Vie', usuarios: 589, giros: 480, bonos: 89 },
      { day: 'Sab', usuarios: 789, giros: 580, bonos: 120 },
      { day: 'Dom', usuarios: 890, giros: 690, bonos: 145 },
    ]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Error al cargar los datos</p>
          <Button onClick={() => fetchAllData()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Header mejorado */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de vuelta. Aquí está el resumen de hoy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            Actualizado {refreshing ? 'ahora' : 'hace 30s'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchAllData()}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                Actualizando...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Actualizar
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards principales - Diseño mejorado */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Usuarios Totales"
          value={stats.users.total}
          change={stats.users.change}
          icon={Users}
          color="blue"
          subtitle={`${stats.users.active} activos`}
        />
        <MetricCard
          title="Ingresos del Mes"
          value={stats.revenue.month}
          change={stats.revenue.change}
          icon={DollarSign}
          color="green"
          prefix="S/ "
          subtitle={`Hoy: S/ ${stats.revenue.today}`}
        />
        <MetricCard
          title="Giros de Ruleta Hoy"
          value={stats.roulette.todaySpins}
          change={35}
          icon={Dices}
          color="purple"
          subtitle={`${stats.roulette.activeUsers} jugadores`}
        />
        <MetricCard
          title="Bonos Activos"
          value={stats.bonus.active}
          change={-12}
          icon={Gift}
          color="orange"
          subtitle={`Valor: S/ ${stats.bonus.totalValue}`}
        />
      </motion.div>

      {/* Sección de Estadísticas Principales con Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="roulette">Ruleta</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Widget de Ruleta mejorado */}
              <RouletteWidget stats={stats.roulette} />
              
              {/* Widget de Actividad en tiempo real */}
              <ActivityWidget />
              
              {/* Widget de Performance */}
              <PerformanceWidget stats={stats} />
            </div>

            {/* Gráficos principales */}
            <div className="grid gap-4 md:grid-cols-2">
              <RevenueChart data={revenueData} />
              <ActivityChart data={activityData} />
            </div>
          </TabsContent>

          <TabsContent value="roulette" className="space-y-4">
            <RouletteDetailedStats stats={stats.roulette} />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserDetailedStats stats={stats.users} />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <RevenueDetailedStats revenue={stats.revenue} data={revenueData} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Actions mejoradas */}
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>
    </motion.div>
  );
}

// Componente de Skeleton para loading
function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

// Componente de tarjeta métrica mejorada
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  prefix = '', 
  subtitle 
}: {
  title: string;
  value: number;
  change?: number;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange';
  prefix?: string;
  subtitle?: string;
}) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    green: 'bg-green-500/10 text-green-600 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  };

  return (
    <Card className={cn("relative overflow-hidden border", colors[color])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">
                {prefix}{value.toLocaleString()}
              </p>
              {change !== undefined && (
                <Badge 
                  variant={change > 0 ? 'default' : 'destructive'} 
                  className="text-xs"
                >
                  {change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {Math.abs(change)}%
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("rounded-full p-3", colors[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
    </Card>
  );
}

// Widget de Ruleta mejorado
function RouletteWidget({ stats }: { stats: any }) {
  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dices className="h-5 w-5 text-purple-600" />
            Ruleta - Estadísticas en Vivo
          </CardTitle>
          <Link href="/admin/roulette">
            <Button variant="ghost" size="sm">
              Ver más <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats.todaySpins}</p>
            <p className="text-xs text-muted-foreground">Giros hoy</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">S/ {stats.todayRevenue}</p>
            <p className="text-xs text-muted-foreground">Ingresos</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
            <p className="text-xs text-muted-foreground">Jugadores activos</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-600">
              {(stats.conversionRate * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Conversión</p>
          </div>
        </div>

        {stats.pendingValidations > 0 && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <p className="text-sm font-medium text-red-600">
                {stats.pendingValidations} validaciones pendientes
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Premio mayor del día</span>
            <Badge variant="outline" className="text-poker-gold">
              {stats.topPrize}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget de Actividad en tiempo real
function ActivityWidget() {
  const activities = [
    { type: 'spin', user: 'Pedro123', time: 'Hace 2 min', amount: 50, icon: Dices },
    { type: 'bonus', user: 'Maria456', time: 'Hace 5 min', amount: 100, icon: Gift },
    { type: 'register', user: 'Carlos789', time: 'Hace 8 min', icon: UserCheck },
    { type: 'win', user: 'Ana321', time: 'Hace 12 min', amount: 500, icon: Trophy },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {activities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "rounded-full p-2",
                      activity.type === 'win' ? 'bg-green-100 text-green-600' :
                      activity.type === 'spin' ? 'bg-purple-100 text-purple-600' :
                      activity.type === 'bonus' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.type === 'spin' && 'Giró la ruleta'}
                        {activity.type === 'bonus' && 'Reclamó un bono'}
                        {activity.type === 'register' && 'Se registró'}
                        {activity.type === 'win' && 'Ganó un premio'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="text-sm font-bold text-green-600">
                        +S/ {activity.amount}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Widget de Performance
function PerformanceWidget({ stats }: { stats: any }) {
  const performanceData = [
    { subject: 'Usuarios', value: 85, fullMark: 100 },
    { subject: 'Ingresos', value: 72, fullMark: 100 },
    { subject: 'Ruleta', value: 90, fullMark: 100 },
    { subject: 'Bonos', value: 65, fullMark: 100 },
    { subject: 'Noticias', value: 78, fullMark: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          Performance General
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={performanceData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Score general</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-600">
              76/100
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Gráfico de Ingresos mejorado
function RevenueChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Ingresos Mensuales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRuleta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBonos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="ruleta"
              stackId="1"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorRuleta)"
            />
            <Area
              type="monotone"
              dataKey="bonos"
              stackId="1"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorBonos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Gráfico de Actividad mejorado
function ActivityChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Actividad Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: 'none',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="usuarios" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="giros" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="bonos" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Estadísticas detalladas de Ruleta
function RouletteDetailedStats({ stats }: { stats: any }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Giros</p>
                <p className="text-3xl font-bold">{stats.todaySpins}</p>
              </div>
              <Dices className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-3xl font-bold text-green-600">S/ {stats.todayRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mayor Premio</p>
                <p className="text-3xl font-bold text-poker-gold">S/ {stats.biggestWin}</p>
              </div>
              <Trophy className="h-8 w-8 text-poker-gold opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Conversión</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(stats.conversionRate * 100).toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Premios</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Giros Gratis', value: 45 },
                  { name: 'Bonos Cash', value: 30 },
                  { name: 'Multiplicadores', value: 15 },
                  { name: 'Jackpot', value: 10 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Estadísticas detalladas de Usuarios
function UserDetailedStats({ stats }: { stats: any }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Distribución por Rol</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byRole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {stats.byRole.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {stats.recentUsers.slice(0, 5).map((user: any, i: number) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Nuevo
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Estadísticas detalladas de Ingresos
function RevenueDetailedStats({ revenue, data }: { revenue: any; data: any[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingresos Hoy</p>
              <p className="text-2xl font-bold text-green-600">S/ {revenue.today}</p>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Esta Semana</p>
              <p className="text-2xl font-bold">S/ 12,450</p>
              <Badge variant="outline" className="text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                18%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Este Mes</p>
              <p className="text-2xl font-bold">S/ {revenue.month}</p>
              <Badge variant="outline" className="text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                {revenue.change}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Proyección</p>
              <p className="text-2xl font-bold text-blue-600">S/ 52,000</p>
              <Progress value={82} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Quick Actions mejoradas
function QuickActions() {
  const actions = [
    { title: 'Ruleta', href: '/admin/roulette', icon: Shield, color: 'purple', count: 5 },
    { title: 'Crear Noticia', href: '/admin/news/create', icon: Newspaper, color: 'blue' },
    { title: 'Ver Rankings', href: '/admin/rankings', icon: Trophy, color: 'gold' },
    { title: 'Gestionar Bonos', href: '/admin/bonus', icon: Gift, color: 'green', count: 12 },
    { title: 'Reportes', href: '/admin/reports', icon: BarChart3, color: 'orange' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 p-4 hover:scale-105 transition-transform"
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    {action.count && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                        variant="destructive"
                      >
                        {action.count}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{action.title}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}