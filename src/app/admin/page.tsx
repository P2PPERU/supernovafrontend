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
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Datos de ejemplo - En producción vendrían del API
const stats = [
  {
    title: 'Usuarios Totales',
    value: '10,234',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Ingresos del Mes',
    value: 'S/ 45,678',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Giros de Ruleta',
    value: '3,456',
    change: '-5.4%',
    trend: 'down',
    icon: Gamepad2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Bonos Activos',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: Gift,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

const revenueData = [
  { name: 'Ene', total: 12000 },
  { name: 'Feb', total: 19000 },
  { name: 'Mar', total: 15000 },
  { name: 'Abr', total: 25000 },
  { name: 'May', total: 22000 },
  { name: 'Jun', total: 30000 },
  { name: 'Jul', total: 35000 },
];

const userActivityData = [
  { name: 'Lun', usuarios: 400, giros: 240 },
  { name: 'Mar', usuarios: 300, giros: 139 },
  { name: 'Mie', usuarios: 500, giros: 380 },
  { name: 'Jue', usuarios: 278, giros: 390 },
  { name: 'Vie', usuarios: 589, giros: 480 },
  { name: 'Sab', usuarios: 789, giros: 580 },
  { name: 'Dom', usuarios: 890, giros: 690 },
];

const roleDistribution = [
  { name: 'Clientes', value: 8500, color: '#10b981' },
  { name: 'Agentes', value: 1500, color: '#3b82f6' },
  { name: 'Editores', value: 200, color: '#f59e0b' },
  { name: 'Admins', value: 34, color: '#ef4444' },
];

const recentActivities = [
  { id: 1, type: 'user', action: 'Nuevo registro', user: 'johndoe', time: 'Hace 5 min', icon: Users },
  { id: 2, type: 'roulette', action: 'Premio ganado', user: 'maria123', amount: 'S/ 100', time: 'Hace 15 min', icon: Gamepad2 },
  { id: 3, type: 'bonus', action: 'Bono reclamado', user: 'pedro456', time: 'Hace 30 min', icon: Gift },
  { id: 4, type: 'validation', action: 'Validación pendiente', count: 5, time: 'Hace 1 hora', icon: CheckCircle },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="ml-1">vs mes anterior</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>
              Evolución de ingresos en los últimos 7 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
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

        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Semanal</CardTitle>
            <CardDescription>
              Usuarios activos y giros de ruleta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="usuarios"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="giros"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Usuarios</CardTitle>
            <CardDescription>Por tipo de cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {roleDistribution.map((role) => (
                <div key={role.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="text-sm">{role.name}</span>
                  </div>
                  <span className="text-sm font-medium">{role.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
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
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user && `Usuario: ${activity.user}`}
                          {activity.amount && ` - ${activity.amount}`}
                          {activity.count && `${activity.count} pendientes`}
                        </p>
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
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/users/create">
                  <Users className="mr-2 h-4 w-4" />
                  Crear Usuario
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/roulette/validations">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validaciones (5)
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