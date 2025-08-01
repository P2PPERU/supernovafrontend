import { Room } from '@/types/rooms.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Users, Trophy, DollarSign, Activity, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomStatsProps {
  room: Room;
}

export function RoomStats({ room }: RoomStatsProps) {
  const stats = [
    {
      icon: Users,
      label: 'Jugadores Totales',
      value: room.stats.totalPlayers.toLocaleString(),
      change: '+12%',
      trend: 'up',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Trophy,
      label: 'Torneos Diarios',
      value: room.stats.dailyTournaments.toLocaleString(),
      suffix: '/día',
      color: 'from-purple-600 to-purple-700',
    },
    {
      icon: Activity,
      label: 'Mesas Disponibles',
      value: room.stats.tablesAvailable.toLocaleString(),
      change: '+8%',
      trend: 'up',
      color: 'from-green-600 to-green-700',
    },
    {
      icon: DollarSign,
      label: 'Pot Promedio',
      value: `$${room.stats.avgPotSize}`,
      change: '+15%',
      trend: 'up',
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      icon: Trophy,
      label: 'Mayor Ganancia',
      value: `$${room.stats.biggestWin.toLocaleString()}`,
      badge: 'Record',
      color: 'from-poker-gold to-yellow-600',
    },
    {
      icon: Activity,
      label: 'Uptime',
      value: `${room.stats.uptime}%`,
      badge: 'Excelente',
      color: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-transparent via-background/50 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4">
            <BarChart3 className="h-3 w-3 mr-1" />
            Estadísticas en Vivo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Números que <span className="gradient-text">Hablan</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Datos en tiempo real de la actividad en {room.name}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass h-full hover:shadow-xl transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        'p-3 rounded-lg bg-gradient-to-br',
                        stat.color
                      )}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {stat.badge && (
                        <Badge variant="outline" className="text-xs">
                          {stat.badge}
                        </Badge>
                      )}
                      {stat.change && (
                        <div className={cn(
                          'flex items-center gap-1 text-sm font-medium',
                          stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        )}>
                          {stat.trend === 'up' ? '↑' : '↓'}
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl md:text-3xl font-bold mb-1 group-hover:text-poker-green transition-colors">
                      {stat.value}
                      {stat.suffix && <span className="text-lg font-normal text-gray-400">{stat.suffix}</span>}
                    </div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-poker-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-poker-green"></span>
                  </span>
                  Actividad en Vivo
                </CardTitle>
                <Badge variant="outline">Actualizado en tiempo real</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Nuevo torneo iniciado', detail: 'Buy-in $100 - 234 jugadores', time: 'Hace 2 min' },
                  { action: 'Jackpot ganado', detail: 'Usuario123 ganó $5,430', time: 'Hace 5 min' },
                  { action: 'Mesa cash abierta', detail: 'NL Hold\'em $2/$5', time: 'Hace 7 min' },
                  { action: 'Torneo finalizado', detail: 'Winner_Pro se llevó $12,000', time: 'Hace 15 min' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-400">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}