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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminPrizes, useDeletePrize, useTogglePrizeStatus, useAdjustProbabilities } from '@/hooks/admin/useRoulette';
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
  Star,
  Eye,
  BarChart3,
  Shuffle,
  Info,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { RoulettePreview } from '@/components/admin/roulette/roulette-preview';
import { ProbabilityAdjuster } from '@/components/admin/roulette/probability-adjuster';

export default function AdminPrizesPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<RoulettePrize | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [showProbabilityAdjuster, setShowProbabilityAdjuster] = useState(false);

  const { data, isLoading } = useAdminPrizes({ isActive: showInactive ? undefined : true });
  const deletePrize = useDeletePrize();
  const toggleStatus = useTogglePrizeStatus();
  const adjustProbabilities = useAdjustProbabilities();

  const prizes = data?.prizes || [];
  const activePrizes = prizes.filter((p: RoulettePrize) => p.isActive);

  // Calcular suma total de probabilidades
  const totalProbability = activePrizes.reduce((sum: number, prize: RoulettePrize) => sum + prize.probability, 0);
  const probabilityStatus = {
    isValid: Math.abs(totalProbability - 100) < 0.01,
    total: totalProbability,
    missing: 100 - totalProbability
  };

  // Estadísticas de premios
  const stats = {
    totalPrizes: prizes.length,
    activePrizes: activePrizes.length,
    inactivePrizes: prizes.length - activePrizes.length,
    cashPrizes: prizes.filter((p: RoulettePrize) => p.prize_type === 'cash').length,
    bonusPrizes: prizes.filter((p: RoulettePrize) => p.prize_type === 'bonus').length,
    totalValue: prizes
      .filter((p: RoulettePrize) => p.prize_type === 'cash' && p.isActive)
      .reduce((sum: number, p: RoulettePrize) => sum + (p.prize_value * p.probability / 100), 0)
  };

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

  const getBehaviorBadge = (behavior: string) => {
    const variants: Record<string, string> = {
      'instant_cash': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'bonus': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'manual': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'custom': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };

    const labels: Record<string, string> = {
      'instant_cash': 'Instantáneo',
      'bonus': 'Bonificación',
      'manual': 'Manual',
      'custom': 'Personalizado'
    };

    return (
      <Badge className={variants[behavior] || 'bg-gray-100'}>
        {labels[behavior] || behavior}
      </Badge>
    );
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

  const handleAutoAdjust = () => {
    const adjustedPrizes = activePrizes.map((prize: RoulettePrize) => ({
      id: prize.id,
      probability: parseFloat((prize.probability * (100 / totalProbability)).toFixed(2))
    }));

    adjustProbabilities.mutate(adjustedPrizes, {
      onSuccess: () => {
        toast.success('Probabilidades ajustadas automáticamente');
      }
    });
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

      {/* Alerta de Probabilidades */}
      {!probabilityStatus.isValid && (
        <motion.div variants={itemVariants}>
          <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 dark:text-red-100">
                    Configuración de probabilidades inválida
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    La suma de probabilidades debe ser exactamente 100%. Actualmente es {totalProbability.toFixed(2)}%
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleAutoAdjust}
                      className="border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-800"
                    >
                      <Shuffle className="mr-2 h-4 w-4" />
                      Ajustar Automáticamente
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowProbabilityAdjuster(true)}
                      className="border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-800"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Ajustar Manualmente
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Estadísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.totalPrizes}</p>
              </div>
              <Gamepad2 className="h-8 w-8 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activePrizes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efectivo</p>
                <p className="text-2xl font-bold">{stats.cashPrizes}</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bonus</p>
                <p className="text-2xl font-bold">{stats.bonusPrizes}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Esp.</p>
                <p className="text-xl font-bold">S/{stats.totalValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className={probabilityStatus.isValid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prob. Total</p>
                <p className={`text-2xl font-bold ${probabilityStatus.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {totalProbability.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className={`h-8 w-8 opacity-50 ${probabilityStatus.isValid ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Lista de Premios
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista Previa
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          {/* Lista de Premios */}
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Configuración de Premios</CardTitle>
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
                      Mostrar inactivos
                    </label>
                  </div>
                </div>
              </CardHeader>
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
                        <TableHead>Posición</TableHead>
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
                                <Progress 
                                  value={prize.probability} 
                                  className={prize.isActive ? '' : 'opacity-50'}
                                />
                              </div>
                              <span className="text-sm font-medium">{prize.probability}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getBehaviorBadge(prize.prize_behavior)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{prize.position}</Badge>
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
                                  <Link href={`/admin/roulette/prizes/${prize.id}`}>
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
          </TabsContent>

          {/* Vista Previa */}
          <TabsContent value="preview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vista Previa de la Ruleta</CardTitle>
                <CardDescription>
                  Así se verá la ruleta con los premios configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoulettePreview prizes={activePrizes} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Estadísticas */}
          <TabsContent value="stats" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribución de Probabilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activePrizes.map((prize: RoulettePrize) => (
                      <div key={prize.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-4 w-4 rounded"
                              style={{ backgroundColor: prize.color }}
                            />
                            <span className="font-medium">{prize.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {prize.probability}%
                          </span>
                        </div>
                        <Progress value={prize.probability} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Valor Esperado</CardTitle>
                  <CardDescription>
                    Cálculo del retorno promedio por giro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activePrizes
                      .filter((p: RoulettePrize) => p.prize_type === 'cash')
                      .map((prize: RoulettePrize) => (
                        <div key={prize.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-8 w-8 rounded flex items-center justify-center"
                              style={{ backgroundColor: prize.color + '20' }}
                            >
                              <Coins className="h-4 w-4" style={{ color: prize.color }} />
                            </div>
                            <div>
                              <p className="font-medium">{prize.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {prize.probability}% × {formatCurrency(prize.prize_value)}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold">
                            {formatCurrency(prize.prize_value * prize.probability / 100)}
                          </p>
                        </div>
                      ))}
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">Valor Esperado Total</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(stats.totalValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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

      {/* Modal de Ajuste de Probabilidades */}
      {showProbabilityAdjuster && (
        <ProbabilityAdjuster
          prizes={activePrizes}
          open={showProbabilityAdjuster}
          onClose={() => setShowProbabilityAdjuster(false)}
        />
      )}
    </motion.div>
  );
}