// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';
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
  Cell
} from 'recharts';

// Interfaces...
interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    change: number;
  };
  revenue: {
    month: number;
    today: number;
    change: number;
  };
  tournaments: {
    active: number;
    pending: number;
    participants: number;
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
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
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

      // Usar el puerto correcto del backend (3000)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      // Fetch de endpoints reales
      const [usersResponse] = await Promise.all([
        fetch(`${API_URL}/api/users`, { headers })
      ]);

      const users = await usersResponse.json();

      // Por ahora usar datos mock para los endpoints que no existen
      const consolidatedStats: DashboardStats = {
        users: {
          total: users.total || users.users?.length || 10234,
          active: Math.floor((users.total || users.users?.length || 10234) * 0.7),
          new: 234,
          change: 12.5
        },
        revenue: {
          month: 45678,
          today: 3250,
          change: 23.1
        },
        tournaments: {
          active: 12,
          pending: 5,
          participants: 234
        },
        bonus: {
          active: 156,
          claimed: 45,
          pending: 12,
          expired: 3,
          totalValue: 2450
        },
        roulette: {
          todaySpins: 145,
          pendingValidations: 8,
          todayRevenue: 3250,
          activeUsers: 42,
          topPrize: '$500 Bonus',
          conversionRate: 0.35
        }
      };

      setStats(consolidatedStats);

      // Datos para gráficos
      setRevenueData([
        { month: 'Ene', total: 12000 },
        { month: 'Feb', total: 19000 },
        { month: 'Mar', total: 15000 },
        { month: 'Abr', total: 25000 },
        { month: 'May', total: 22000 },
        { month: 'Jun', total: 30000 },
        { month: 'Jul', total: 35000 },
      ]);

      setActivityData([
        { day: 'Lun', users: 400, tournaments: 240 },
        { day: 'Mar', users: 300, tournaments: 139 },
        { day: 'Mie', users: 500, tournaments: 380 },
        { day: 'Jue', users: 278, tournaments: 390 },
        { day: 'Vie', users: 589, tournaments: 480 },
        { day: 'Sab', users: 789, tournaments: 580 },
        { day: 'Dom', users: 890, tournaments: 690 },
      ]);

      // Datos de distribución de usuarios por rol
      const roleDistribution = [
        { role: 'clientes', count: 8500 },
        { role: 'agentes', count: 1500 },
        { role: 'editores', count: 200 },
        { role: 'admins', count: 34 }
      ];

      setUserStats({ byRole: roleDistribution });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error al cargar algunos datos del dashboard');
      
      // Usar datos por defecto en caso de error
      setStats({
        users: { total: 10234, active: 7164, new: 234, change: 12.5 },
        revenue: { month: 45678, today: 3250, change: 23.1 },
        tournaments: { active: 12, pending: 5, participants: 234 },
        bonus: { active: 156, claimed: 45, pending: 12, expired: 3, totalValue: 2450 },
        roulette: {
          todaySpins: 145,
          pendingValidations: 8,
          todayRevenue: 3250,
          activeUsers: 42,
          topPrize: '$500 Bonus',
          conversionRate: 0.35
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Error al cargar los datos</p>
          <Button onClick={fetchAllData} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Resto del componente igual...
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de control. Aquí tienes un resumen de la actividad.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+{stats.users.change}%</span>
              <span className="ml-1">vs mes anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {stats.revenue.month.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+{stats.revenue.change}%</span>
              <span className="ml-1">vs mes anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Torneos Activos</CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Gamepad2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tournaments.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.tournaments.participants} participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonos Activos</CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Gift className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bonus.active}</div>
            <p className="text-xs text-muted-foreground">
              Valor: S/ {stats.bonus.totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Widgets Row */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Roulette Widget */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Dices className="h-5 w-5 text-purple-600" />
                Ruleta Hoy
              </CardTitle>
              <Link 
                href="/admin/roulette"
                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
              >
                Ver más →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Giros</p>
                  <p className="text-xl font-bold">{stats.roulette.todaySpins}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Activos</p>
                  <p className="text-xl font-bold">{stats.roulette.activeUsers}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <p className="text-xl font-bold text-green-600">
                    ${stats.roulette.todayRevenue}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversión</p>
                  <p className="text-xl font-bold text-blue-600">
                    {(stats.roulette.conversionRate * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              
              {stats.roulette.pendingValidations > 0 && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {stats.roulette.pendingValidations} validaciones pendientes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tournaments Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-blue-600" />
                Torneos Hoy
              </CardTitle>
              <Link 
                href="/admin/tournaments"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Ver más →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En progreso</span>
                <span className="font-bold text-lg">{stats.tournaments.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Por iniciar</span>
                <span className="font-bold text-lg">{stats.tournaments.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Participantes</span>
                <span className="font-bold text-lg">{stats.tournaments.participants}</span>
              </div>
              <Progress value={65} className="w-full" />
              <p className="text-xs text-gray-500">65% de capacidad</p>
            </div>
          </CardContent>
        </Card>

        {/* Bonuses Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Bonos del Día
              </CardTitle>
              <Link 
                href="/admin/bonus"
                className="text-sm text-green-600 hover:text-green-700 transition-colors"
              >
                Ver más →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reclamados</span>
                <span className="font-bold text-lg text-green-600">{stats.bonus.claimed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendientes</span>
                <span className="font-bold text-lg text-yellow-600">{stats.bonus.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expirados</span>
                <span className="font-bold text-lg text-red-600">{stats.bonus.expired}</span>
              </div>
              <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-green-700 dark:text-green-400">
                  Valor total: S/ {stats.bonus.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>Evolución de ingresos en los últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Semanal</CardTitle>
            <CardDescription>Usuarios activos y participación en torneos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Usuarios"
                />
                <Line
                  type="monotone"
                  dataKey="tournaments"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Torneos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Usuarios</CardTitle>
            <CardDescription>Por tipo de cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            {userStats?.byRole && (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={userStats.byRole}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {userStats.byRole.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {userStats.byRole.map((role: any, index: number) => (
                    <div key={role.role} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm capitalize">{role.role}</span>
                      </div>
                      <span className="text-sm font-medium">{role.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en el sistema</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/activity">
                  Ver todo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nuevo registro', user: 'johndoe', time: 'Hace 5 min', icon: Users },
                { action: 'Torneo iniciado', user: 'Torneo VIP', time: 'Hace 15 min', icon: Gamepad2 },
                { action: 'Bono reclamado', user: 'pedro456', time: 'Hace 30 min', icon: Gift },
              ].map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">Usuario: {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accede rápidamente a las funciones más usadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/users/create">
                  <Users className="mr-2 h-4 w-4" />
                  Crear Usuario
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/roulette">
                  <Dices className="mr-2 h-4 w-4 text-purple-600" />
                  Gestionar Ruleta
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/tournaments">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Torneos
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/news/create">
                  <Activity className="mr-2 h-4 w-4" />
                  Nueva Noticia
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ver Reportes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}