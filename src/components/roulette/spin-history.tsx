'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { rouletteService } from '@/services/roulette.service';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Filter, 
  Trophy, 
  TrendingUp,
  Gift,
  Loader2
} from 'lucide-react';

// Interfaces para los tipos de datos
interface Prize {
  name: string;
  prize_type?: string;
  type?: string;
  prize_value?: number;
  value?: number;
}

interface Spin {
  id: string;
  spin_type: string;
  is_real_prize: boolean;
  spin_date: string;
  prize_status: string;
  prize?: Prize;
}

export function SpinHistory() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['roulette-history', page],
    queryFn: () => rouletteService.getMyHistory(page, 10),
  });

  const spins: Spin[] = data?.spins || [];
  const totalPages = data?.totalPages || 1;

  // Estadísticas
  const stats = {
    totalSpins: spins.length,
    realPrizes: spins.filter((s: Spin) => s.is_real_prize).length,
    totalValue: spins.reduce((sum: number, spin: Spin) => {
      if (spin.is_real_prize && spin.prize?.prize_value) {
        return sum + spin.prize.prize_value;
      }
      return sum;
    }, 0),
  };

  const getSpinTypeColor = (type: string) => {
    switch (type) {
      case 'demo':
        return 'secondary';
      case 'welcome_real':
        return 'default';
      case 'code':
        return 'outline';
      case 'bonus':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getSpinTypeLabel = (type: string) => {
    switch (type) {
      case 'demo':
        return 'Demo';
      case 'welcome_real':
        return 'Real';
      case 'code':
        return 'Código';
      case 'bonus':
        return 'Bonus';
      default:
        return type;
    }
  };

  const getPrizeStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-green-500';
      case 'pending_validation':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      case 'demo':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPrizeStatusLabel = (status: string) => {
    switch (status) {
      case 'applied':
        return 'Aplicado';
      case 'pending_validation':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      case 'demo':
        return 'Demo';
      default:
        return status;
    }
  };

  const filteredSpins = filter === 'all' 
    ? spins 
    : spins.filter((spin: Spin) => spin.spin_type === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-poker-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Giros</p>
                  <p className="text-2xl font-bold">{stats.totalSpins}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Premios Reales</p>
                  <p className="text-2xl font-bold">{stats.realPrizes}</p>
                </div>
                <Trophy className="h-8 w-8 text-poker-gold opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">S/ {stats.totalValue}</p>
                </div>
                <Gift className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtros y tabla */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Giros</CardTitle>
              <CardDescription>
                Todos tus giros y premios obtenidos
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="welcome_real">Real</SelectItem>
                <SelectItem value="code">Código</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSpins.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'No tienes giros registrados aún'
                  : `No tienes giros de tipo ${getSpinTypeLabel(filter)}`
                }
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Premio</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSpins.map((spin: Spin, index: number) => (
                      <motion.tr
                        key={spin.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm">{formatDate(spin.spin_date)}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatRelativeTime(spin.spin_date)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSpinTypeColor(spin.spin_type) as any}>
                            {getSpinTypeLabel(spin.spin_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{spin.prize?.name || 'N/A'}</p>
                            {spin.prize?.prize_type && (
                              <p className="text-xs text-muted-foreground">
                                {spin.prize.prize_type}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {spin.prize?.prize_value ? (
                            <span className="font-medium">
                              S/ {spin.prize.prize_value}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-2 h-2 rounded-full ${getPrizeStatusColor(spin.prize_status)}`} 
                            />
                            <span className="text-sm">
                              {getPrizeStatusLabel(spin.prize_status)}
                            </span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}