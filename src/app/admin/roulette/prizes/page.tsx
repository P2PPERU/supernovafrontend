'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useAdminPrizes, useDeletePrize, useTogglePrizeStatus } from '@/hooks/admin/useRoulette';
import { RoulettePrize } from '@/services/admin/roulette.service';
import { formatCurrency } from '@/lib/utils';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  AlertCircle,
  Gamepad2,
  TrendingUp,
  Gift,
  Coins,
  Zap,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPrizesPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<RoulettePrize | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const { data, isLoading } = useAdminPrizes({ isActive: showInactive ? undefined : true });
  const deletePrize = useDeletePrize();
  const toggleStatus = useTogglePrizeStatus();

  const prizes = data?.prizes || [];

  // Calcular suma total de probabilidades
  const totalProbability = prizes
    .filter((p: RoulettePrize) => p.isActive)
    .reduce((sum: number, prize: RoulettePrize) => sum + prize.probability, 0);

  const getPrizeIcon = (type: string) => {
    switch (type) {
      case 'cash':
        return <Coins className="h-5 w-5" />;
      case 'bonus':
        return <Gift className="h-5 w-5" />;
      case 'points':
        return <Star className="h-5 w-5" />;
      case 'spin':
        return <Zap className="h-5 w-5" />;
      default:
        return <Gamepad2 className="h-5 w-5" />;
    }
  };

  const getPrizeTypeColor = (type: string) => {
    switch (type) {
      case 'cash':
        return 'bg-green-500';
      case 'bonus':
        return 'bg-purple-500';
      case 'points':
        return 'bg-blue-500';
      case 'spin':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDelete = () => {
    if (!selectedPrize) return;
    
    deletePrize.mutate(selectedPrize.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedPrize(null);
      },
    });
  };

  const handleToggleStatus = (prize: RoulettePrize) => {
    toggleStatus.mutate({ id: prize.id, isActive: !prize.isActive });
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Premios de Ruleta</h1>
          <p className="text-muted-foreground">
            Configura los premios y sus probabilidades
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/roulette/prizes/create">
            <Plus className="mr-2 h-4 w-4" />
            Crear Premio
          </Link>
        </Button>
      </motion.div>

      {/* Probabilidades */}
      <motion.div variants={itemVariants}>
        <Card className={totalProbability !== 100 ? 'border-red-500' : ''}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Probabilidades Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Suma de probabilidades activas
                  </span>
                  <span className={`text-sm font-bold ${
                    totalProbability === 100 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {totalProbability}%
                  </span>
                </div>
                <Progress 
                  value={totalProbability} 
                  className={totalProbability !== 100 ? 'bg-red-100' : ''}
                />
              </div>
              
              {totalProbability !== 100 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-600">
                      ¡Atención! La suma de probabilidades debe ser exactamente 100%
                    </p>
                    <p className="text-red-600/80 mt-1">
                      Actualmente: {totalProbability}% | Diferencia: {100 - totalProbability}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <label
                htmlFor="show-inactive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mostrar premios inactivos
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla de premios */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>Cargando premios...</span>
                </div>
              </div>
            ) : prizes.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay premios configurados. Crea el primer premio.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Premio</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Probabilidad</TableHead>
                    <TableHead>Comportamiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prizes.map((prize: RoulettePrize, index: number) => (
                    <motion.tr
                      key={prize.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={!prize.isActive ? 'opacity-50' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: prize.color + '20' }}
                          >
                            {prize.icon ? (
                              <span className="text-xl">{prize.icon}</span>
                            ) : (
                              getPrizeIcon(prize.prize_type)
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{prize.name}</p>
                            {prize.description && (
                              <p className="text-xs text-muted-foreground">
                                {prize.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPrizeTypeColor(prize.prize_type)} text-white`}>
                          {prize.prize_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {prize.prize_type === 'cash' ? (
                          <span className="font-medium">{formatCurrency(prize.prize_value)}</span>
                        ) : prize.prize_type === 'bonus' ? (
                          <span className="font-medium">{prize.prize_value}%</span>
                        ) : prize.prize_type === 'points' ? (
                          <span className="font-medium">{prize.prize_value} pts</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress value={prize.probability} />
                          </div>
                          <span className="text-sm font-medium">{prize.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {prize.prize_behavior}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={prize.isActive}
                          onCheckedChange={() => handleToggleStatus(prize)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/roulette/prizes/${prize.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPrize(prize);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar premio?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el premio "{selectedPrize?.name}"? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}