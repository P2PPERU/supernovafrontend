'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Plus, 
  Search, 
  Upload,
  Download,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Filter,
  FileSpreadsheet,
  Users,
  Target,
  Gamepad2,
  DollarSign,
  BarChart3,
  TrendingUp,
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  useAdminRankings,
  useUpdatePlayerRanking,
  useImportRankings,
  useToggleRankingVisibility,
  useDeleteRanking,
  useRecalculatePositions,
  useDownloadTemplate,
  useRankingStats
} from '@/hooks/useRankings';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const RANKING_TYPES = {
  points: { label: 'Puntos', icon: Target, color: 'text-purple-500' },
  hands_played: { label: 'Manos Jugadas', icon: Gamepad2, color: 'text-blue-500' },
  tournaments: { label: 'Torneos', icon: Trophy, color: 'text-yellow-500' },
  rake: { label: 'Rake', icon: DollarSign, color: 'text-green-500' }
};

export default function AdminRankingsPage() {
  const [filters, setFilters] = useState({
    type: '',
    season: '2025-01',
    period: 'all_time',
    search: '',
    page: 1,
    limit: 25,
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [createForm, setCreateForm] = useState({
    playerId: '',
    playerName: '',
    isExternal: false,
    externalPlayerName: '',
    externalPlayerEmail: '',
    type: 'points',
    points: 0,
    handsPlayed: 0,
    tournamentsPlayed: 0,
    totalRake: 0,
    wins: 0,
    losses: 0,
    season: '2025-01',
    isVisible: true,
  });

  // Hooks
  const { data, isLoading } = useAdminRankings(filters);
  const { data: statsData } = useRankingStats({ season: filters.season });
  const updateRanking = useUpdatePlayerRanking();
  const importRankings = useImportRankings();
  const toggleVisibility = useToggleRankingVisibility();
  const deleteRanking = useDeleteRanking();
  const recalculate = useRecalculatePositions();
  const downloadTemplate = useDownloadTemplate();

  const rankings = data?.rankings || [];
  const totalPages = data?.totalPages || 1;
  const stats = statsData?.stats;

  const handleCreateRanking = async () => {
    try {
      const playerId = createForm.isExternal 
        ? createForm.externalPlayerName 
        : createForm.playerId;

      const data = {
        type: createForm.type,
        points: createForm.points,
        handsPlayed: createForm.handsPlayed,
        tournamentsPlayed: createForm.tournamentsPlayed,
        totalRake: createForm.totalRake,
        wins: createForm.wins,
        losses: createForm.losses,
        season: createForm.season,
        isVisible: createForm.isVisible,
        ...(createForm.isExternal && {
          externalPlayerName: createForm.externalPlayerName,
          externalPlayerEmail: createForm.externalPlayerEmail,
        }),
      };

      await updateRanking.mutateAsync({ playerId, data });
      setShowCreateDialog(false);
      resetCreateForm();
    } catch (error) {
      console.error('Error creating ranking:', error);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Selecciona un archivo para importar');
      return;
    }

    try {
      await importRankings.mutateAsync(importFile);
      setShowImportDialog(false);
      setImportFile(null);
    } catch (error) {
      console.error('Error importing rankings:', error);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      playerId: '',
      playerName: '',
      isExternal: false,
      externalPlayerName: '',
      externalPlayerEmail: '',
      type: 'points',
      points: 0,
      handsPlayed: 0,
      tournamentsPlayed: 0,
      totalRake: 0,
      wins: 0,
      losses: 0,
      season: '2025-01',
      isVisible: true,
    });
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
          <h1 className="text-3xl font-bold">Gestión de Rankings</h1>
          <p className="text-muted-foreground">
            Administra los rankings de jugadores y estadísticas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => downloadTemplate.mutate()}>
            <Download className="mr-2 h-4 w-4" />
            Descargar Plantilla
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importar Excel
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Ranking
          </Button>
        </div>
      </motion.div>

      {/* Estadísticas */}
      {stats && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.playersByType?.map((stat: any) => {
            const config = RANKING_TYPES[stat.type as keyof typeof RANKING_TYPES];
            if (!config) return null;
            
            const Icon = config.icon;
            return (
              <Card key={stat.type}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                      <p className="text-2xl font-bold">{stat.players}</p>
                    </div>
                    <Icon className={cn("h-8 w-8 opacity-50", config.color)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}

      {/* Herramientas */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Herramientas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                onClick={() => recalculate.mutate({})}
                disabled={recalculate.isPending}
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", recalculate.isPending && "animate-spin")} />
                Recalcular Posiciones
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/rankings" target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Página Pública
                </Link>
              </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value, page: 1 })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {Object.entries(RANKING_TYPES).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="season">Temporada</Label>
                <Select
                  value={filters.season}
                  onValueChange={(value) => setFilters({ ...filters, season: value, page: 1 })}
                >
                  <SelectTrigger id="season">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-01">2025-01</SelectItem>
                    <SelectItem value="2024-12">2024-12</SelectItem>
                    <SelectItem value="2024-11">2024-11</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="period">Período</Label>
                <Select
                  value={filters.period}
                  onValueChange={(value) => setFilters({ ...filters, period: value, page: 1 })}
                >
                  <SelectTrigger id="period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_time">Todo el tiempo</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="daily">Diario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla de rankings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>Cargando rankings...</span>
                </div>
              </div>
            ) : rankings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-2">No hay rankings</p>
                <p>Crea el primer ranking o importa datos desde Excel</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posición</TableHead>
                    <TableHead>Jugador</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estadística Principal</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Temporada</TableHead>
                    <TableHead>Visibilidad</TableHead>
                    <TableHead>Última Actualización</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((ranking: any, index: number) => {
                    const config = RANKING_TYPES[ranking.ranking_type as keyof typeof RANKING_TYPES];
                    const Icon = config?.icon || Target;
                    
                    const getMainStat = () => {
                      switch (ranking.ranking_type) {
                        case 'points':
                          return ranking.points?.toLocaleString() || 0;
                        case 'hands_played':
                          return ranking.hands_played?.toLocaleString() || 0;
                        case 'tournaments':
                          return ranking.tournaments_played || 0;
                        case 'rake':
                          return formatCurrency(ranking.total_rake || 0);
                        default:
                          return ranking.points?.toLocaleString() || 0;
                      }
                    };

                    return (
                      <motion.tr
                        key={ranking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {ranking.position <= 3 && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="font-semibold">#{ranking.position}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={ranking.player?.profile?.avatar} />
                              <AvatarFallback>
                                {ranking.displayName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{ranking.displayName}</p>
                              <p className="text-sm text-muted-foreground">
                                {ranking.displayEmail}
                              </p>
                              {ranking.is_external && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  Externo
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-4 w-4", config?.color)} />
                            <span>{config?.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{getMainStat()}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{ranking.win_rate}%</span>
                            {ranking.win_rate >= 60 && (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ranking.season}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={ranking.is_visible}
                              onCheckedChange={() => 
                                toggleVisibility.mutate({
                                  rankingId: ranking.id,
                                  isVisible: !ranking.is_visible
                                })
                              }
                            />
                            {ranking.is_visible ? (
                              <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{formatDate(ranking.updated_at)}</p>
                            {ranking.updatedBy && (
                              <p className="text-xs text-muted-foreground">
                                por {ranking.updatedBy.username}
                              </p>
                            )}
                          </div>
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
                              <DropdownMenuItem
                                onClick={() => {
                                  // Llenar formulario con datos existentes
                                  setCreateForm({
                                    ...createForm,
                                    playerId: ranking.player_id || '',
                                    playerName: ranking.displayName,
                                    isExternal: ranking.is_external,
                                    externalPlayerName: ranking.external_player_name || '',
                                    externalPlayerEmail: ranking.external_player_email || '',
                                    type: ranking.ranking_type,
                                    points: ranking.points || 0,
                                    handsPlayed: ranking.hands_played || 0,
                                    tournamentsPlayed: ranking.tournaments_played || 0,
                                    totalRake: ranking.total_rake || 0,
                                    wins: ranking.wins || 0,
                                    losses: ranking.losses || 0,
                                    season: ranking.season,
                                    isVisible: ranking.is_visible,
                                  });
                                  setSelectedRanking(ranking);
                                  setShowCreateDialog(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deleteRanking.mutate(ranking.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Paginación */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={filters.page === pageNum ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: pageNum })}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Dialog para crear/editar ranking */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRanking ? 'Editar Ranking' : 'Crear Ranking'}
            </DialogTitle>
            <DialogDescription>
              {selectedRanking 
                ? 'Modifica los datos del ranking seleccionado'
                : 'Agrega un nuevo jugador al ranking'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tipo de jugador */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={createForm.isExternal}
                onCheckedChange={(checked) => 
                  setCreateForm({ ...createForm, isExternal: checked })
                }
              />
              <Label>Jugador externo (sin cuenta en el sistema)</Label>
            </div>

            {/* Datos del jugador */}
            {createForm.isExternal ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="externalPlayerName">Nombre del jugador</Label>
                  <Input
                    id="externalPlayerName"
                    value={createForm.externalPlayerName}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      externalPlayerName: e.target.value 
                    })}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="externalPlayerEmail">Email (opcional)</Label>
                  <Input
                    id="externalPlayerEmail"
                    type="email"
                    value={createForm.externalPlayerEmail}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      externalPlayerEmail: e.target.value 
                    })}
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="playerId">ID del jugador registrado</Label>
                <Input
                  id="playerId"
                  value={createForm.playerId}
                  onChange={(e) => setCreateForm({ 
                    ...createForm, 
                    playerId: e.target.value 
                  })}
                  placeholder="Username o ID del usuario"
                />
              </div>
            )}

            {/* Configuración del ranking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de ranking</Label>
                <Select
                  value={createForm.type}
                  onValueChange={(value) => setCreateForm({ ...createForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RANKING_TYPES).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Temporada</Label>
                <Select
                  value={createForm.season}
                  onValueChange={(value) => setCreateForm({ ...createForm, season: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-01">2025-01</SelectItem>
                    <SelectItem value="2024-12">2024-12</SelectItem>
                    <SelectItem value="2024-11">2024-11</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="space-y-4">
              <h4 className="font-semibold">Estadísticas del jugador</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="points">Puntos</Label>
                  <Input
                    id="points"
                    type="number"
                    value={createForm.points}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      points: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handsPlayed">Manos jugadas</Label>
                  <Input
                    id="handsPlayed"
                    type="number"
                    value={createForm.handsPlayed}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      handsPlayed: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournamentsPlayed">Torneos jugados</Label>
                  <Input
                    id="tournamentsPlayed"
                    type="number"
                    value={createForm.tournamentsPlayed}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      tournamentsPlayed: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalRake">Rake total</Label>
                  <Input
                    id="totalRake"
                    type="number"
                    step="0.01"
                    value={createForm.totalRake}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      totalRake: parseFloat(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wins">Victorias</Label>
                  <Input
                    id="wins"
                    type="number"
                    value={createForm.wins}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      wins: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="losses">Derrotas</Label>
                  <Input
                    id="losses"
                    type="number"
                    value={createForm.losses}
                    onChange={(e) => setCreateForm({ 
                      ...createForm, 
                      losses: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>
              </div>

              {/* Win rate calculado */}
              {(createForm.wins > 0 || createForm.losses > 0) && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Win Rate calculado: {
                      createForm.wins + createForm.losses > 0 
                        ? ((createForm.wins / (createForm.wins + createForm.losses)) * 100).toFixed(1)
                        : 0
                    }%
                  </p>
                </div>
              )}
            </div>

            {/* Visibilidad */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={createForm.isVisible}
                onCheckedChange={(checked) => 
                  setCreateForm({ ...createForm, isVisible: checked })
                }
              />
              <Label>Visible en rankings públicos</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setSelectedRanking(null);
                resetCreateForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRanking}
              disabled={updateRanking.isPending}
            >
              {updateRanking.isPending ? 'Guardando...' : (selectedRanking ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para importar */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Rankings desde Excel</DialogTitle>
            <DialogDescription>
              Sube un archivo Excel con los datos de rankings. Descarga la plantilla si necesitas el formato.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="importFile">Archivo Excel</Label>
              <Input
                id="importFile"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
            </div>

            {importFile && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="text-sm font-medium">{importFile.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(importFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Formato del archivo:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>La primera fila debe contener los encabezados</li>
                <li>Columnas requeridas: username/playerName, points, hands_played, etc.</li>
                <li>Para jugadores externos usar "playerName" en lugar de "username"</li>
                <li>El sistema calculará automáticamente las posiciones</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => downloadTemplate.mutate()}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar Plantilla
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowImportDialog(false);
                setImportFile(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importFile || importRankings.isPending}
            >
              {importRankings.isPending ? 'Importando...' : 'Importar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}