'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminNewsStats } from '@/hooks/admin/useNews';
import { 
  FileText, 
  Eye, 
  TrendingUp, 
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

export function NewsStatsCards() {
  const { data, isLoading } = useAdminNewsStats();
  const stats = data?.stats;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Noticias',
      value: stats?.byStatus?.reduce((acc, item) => acc + item.count, 0) || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      detail: stats?.byStatus?.find(s => s.status === 'published')?.count || 0,
      detailLabel: 'Publicadas',
    },
    {
      title: 'Vistas Totales',
      value: stats?.byCategory?.reduce((acc, item) => acc + item.totalViews, 0) || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      detail: Math.round(
        (stats?.byCategory?.reduce((acc, item) => acc + item.avgViews * item.count, 0) || 0) /
        (stats?.byCategory?.reduce((acc, item) => acc + item.count, 0) || 1)
      ),
      detailLabel: 'Promedio',
    },
    {
      title: 'Más Popular',
      value: stats?.topNews?.[0]?.title?.substring(0, 20) + '...' || 'N/A',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      detail: stats?.topNews?.[0]?.views || 0,
      detailLabel: 'Vistas',
    },
    {
      title: 'Top Autor',
      value: stats?.topAuthors?.[0]?.author?.username || 'N/A',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      detail: stats?.topAuthors?.[0]?.newsCount || 0,
      detailLabel: 'Noticias',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.detail} {card.detailLabel}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// Gráfico de publicaciones por mes
export function NewsMonthlyChart() {
  const { data, isLoading } = useAdminNewsStats();
  const monthlyData = data?.stats?.newsByMonth || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Publicaciones por Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Publicaciones por Mes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monthlyData.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {month.month}
                </span>
                <span className="font-medium">{month.count} noticias</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(month.count / Math.max(...monthlyData.map(m => m.count))) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-poker-green to-poker-blue"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}