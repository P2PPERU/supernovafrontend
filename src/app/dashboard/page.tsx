'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  Trophy, 
  Gift, 
  TrendingUp, 
  Users, 
  ArrowRight,
  DollarSign,
  Activity,
  Shield
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const quickActions = [
    {
      title: 'Ver Rankings',
      description: 'Consulta tu posición',
      icon: Trophy,
      color: 'text-poker-green',
      href: '/rankings',
    },
    {
      title: 'Mis Bonos',
      description: 'Gestiona tus bonificaciones',
      icon: Gift,
      color: 'text-poker-red',
      href: '/bonus',
    },
    {
      title: 'Últimas Noticias',
      description: 'Mantente informado',
      icon: Activity,
      color: 'text-blue-500',
      href: '/news',
    },
  ];

  const stats = [
    {
      label: 'Balance Total',
      value: formatCurrency(user.balance || 0),
      icon: DollarSign,
      change: '+12.5%',
      trend: 'up',
    },
    {
      label: 'Posición Ranking',
      value: '#127',
      icon: Trophy,
      change: '+5',
      trend: 'up',
    },
    {
      label: 'Puntos Totales',
      value: '2,450',
      icon: TrendingUp,
      change: '+150',
      trend: 'up',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {user.profile?.firstName || user.username}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Este es tu panel de control. Aquí puedes ver tu progreso y acceder a todas las funciones.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={cn(
                        "text-sm font-medium",
                        stat.trend === 'up' && "text-green-600",
                        stat.trend === 'down' && "text-red-600",
                        stat.trend === 'neutral' && "text-gray-600"
                      )}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center",
                    "bg-gray-100 dark:bg-gray-800"
                  )}>
                    <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.title} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-4">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group">
                    Ir ahora
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas acciones en el club</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Torneo jugado', time: 'Ayer', result: 'Posición #12' },
                { action: 'Bono reclamado', time: 'Hace 3 días', result: '+S/ 100' },
                { action: 'Ranking actualizado', time: 'Hace 5 días', result: '+5 posiciones' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <span className="text-sm font-medium text-poker-green">
                    {activity.result}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver todo el historial
            </Button>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Anuncios del Club</CardTitle>
            <CardDescription>Novedades y promociones activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-poker-green/10 rounded-lg border border-poker-green/20">
                <h4 className="font-semibold text-poker-darkGreen mb-1">
                  🎉 Torneo Especial de Navidad
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Participa del 20 al 25 de diciembre y gana hasta S/ 5,000 en premios.
                </p>
              </div>
              <div className="p-4 bg-poker-gold/10 rounded-lg border border-poker-gold/20">
                <h4 className="font-semibold text-amber-700 mb-1">
                  ⭐ Nuevo Sistema de Puntos
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Acumula puntos con cada partida y canjéalos por premios exclusivos.
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  📱 App Móvil Disponible
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Descarga nuestra nueva app y juega desde cualquier lugar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin-specific content */}
      {(user.role === 'admin' || user.role === 'editor') && (
        <Card className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-poker-gold" />
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-gray-300">
              Accede a las herramientas administrativas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Acciones Pendientes</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Noticias en borrador</span>
                    <Badge variant="secondary">3</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Reportes sin revisar</span>
                    <Badge variant="secondary">12</Badge>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Estadísticas Rápidas</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Usuarios nuevos hoy</span>
                    <span className="font-semibold">24</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Ingresos del día</span>
                    <span className="font-semibold">S/ 3,450</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Tickets activos</span>
                    <span className="font-semibold">8</span>
                  </li>
                </ul>
              </div>
            </div>
            <Button 
              size="lg"
              className="w-full bg-poker-gold hover:bg-poker-gold/90 text-black" 
              asChild
            >
              <Link href="/admin">
                <Shield className="mr-2 h-5 w-5" />
                Ir al Panel Administrativo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Role-specific content */}
      {user.role === 'agent' && (
        <Card className="mt-8 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-300">
              Panel de Agente
            </CardTitle>
            <CardDescription>Accede a tus herramientas de gestión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/agent/clients')}
                className="border-purple-300 hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-800"
              >
                <Users className="mr-2 h-4 w-4" />
                Gestionar Clientes
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/agent/stats')}
                className="border-purple-300 hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-800"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Estadísticas
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/agent/affiliate')}
                className="border-purple-300 hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-800"
              >
                <Gift className="mr-2 h-4 w-4" />
                Programa de Afiliados
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}