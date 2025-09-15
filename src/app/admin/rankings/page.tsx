'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  ChevronRight,
  Copy,
  Calendar,
  Settings,
  FolderOpen,
  UserPlus
} from 'lucide-react';
import { 
  useAdminGroups,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  useDuplicateGroup,
  useAdminGroupRankings,
  useUpdatePlayerInGroup,
  useImportToGroup,
  useToggleRankingInGroup,
  useDeleteRankingFromGroup,
  useRecalculateGroupPositions,
  useDownloadTemplate,
  useGroupStats
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
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  
  // Filtros para grupos
  const [groupFilters, setGroupFilters] = useState({
    includeHidden: true,
    type: 'all',
    status: 'all',
    page: 1,
    limit: 20,
  });

  // Filtros para rankings
  const [rankingFilters, setRankingFilters] = useState({
    includeHidden: true,
    page: 1,
    limit: 25,
  });

  // Dialogs
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showCreateRankingDialog, setShowCreateRankingDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  
  // Forms
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    ranking_type: 'points',
    start_date: '',
    end_date: '',
    is_active: true,
    is_visible: true,
    settings: {}
  });

  const [rankingForm, setRankingForm] = useState({
    playerId: '',
    isExternal: false,
    externalPlayerName: '',
    externalPlayerEmail: '',
    points: 0,
    handsPlayed: 0,
    tournamentsPlayed: 0,
    totalRake: 0,
    wins: 0,
    losses: 0,
    isVisible: true,
  });

  const [duplicateForm, setDuplicateForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    copy_rankings: false
  });

  const [importFile, setImportFile] = useState<File | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<any>(null);

  // Hooks
  const { data: groupsData, isLoading: groupsLoading } = useAdminGroups(groupFilters);
  const { data: rankingsData, isLoading: rankingsLoading } = useAdminGroupRankings(
    selectedGroup?.id || '', 
    rankingFilters
  );
  const { data: statsData } = useGroupStats(selectedGroup?.id || '');

  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();
  const duplicateGroup = useDuplicateGroup();
  const updateRanking = useUpdatePlayerInGroup();
  const importRankings = useImportToGroup();
  const toggleVisibility = useToggleRankingInGroup();
  const deleteRanking = useDeleteRankingFromGroup();
  const recalculate = useRecalculateGroupPositions();
  const downloadTemplate = useDownloadTemplate();

  const groups = groupsData?.groups || [];
  const rankings = rankingsData?.rankings || [];
  const totalGroupPages = groupsData?.totalPages || 1;
  const totalRankingPages = rankingsData?.totalPages || 1;
  const stats = statsData?.stats;

  // Handlers
  const handleCreateGroup = async () => {
    try {
      await createGroup.mutateAsync({
        ...groupForm,
        start_date: new Date(groupForm.start_date).toISOString(),
        end_date: new Date(groupForm.end_date).toISOString(),
      });
      setShowCreateGroupDialog(false);
      resetGroupForm();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleUpdateGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      await updateGroup.mutateAsync({
        groupId: selectedGroup.id,
        data: {
          ...groupForm,
          start_date: new Date(groupForm.start_date).toISOString(),
          end_date: new Date(groupForm.end_date).toISOString(),
        }
      });
      setShowCreateGroupDialog(false);
      setSelectedGroup(null);
      resetGroupForm();
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleCreateRanking = async () => {
    if (!selectedGroup) return;

    try {
      const playerId = rankingForm.isExternal 
        ? rankingForm.externalPlayerName 
        : rankingForm.playerId;

      const data = {
        points: rankingForm.points,
        handsPlayed: rankingForm.handsPlayed,
        tournamentsPlayed: rankingForm.tournamentsPlayed,
        totalRake: rankingForm.totalRake,
        wins: rankingForm.wins,
        losses: rankingForm.losses,
        isVisible: rankingForm.isVisible,
        ...(rankingForm.isExternal && {
          externalPlayerName: rankingForm.externalPlayerName,
          externalPlayerEmail: rankingForm.externalPlayerEmail,
        }),
      };

      await updateRanking.mutateAsync({
        groupId: selectedGroup.id,
        playerId,
        data
      });
      setShowCreateRankingDialog(false);
      resetRankingForm();
    } catch (error) {
      console.error('Error creating ranking:', error);
    }
  };

  const handleImport = async () => {
    if (!importFile || !selectedGroup) {
      toast.error('Selecciona un archivo y un grupo');
      return;
    }

    try {
      await importRankings.mutateAsync({
        groupId: selectedGroup.id,
        file: importFile
      });
      setShowImportDialog(false);
      setImportFile(null);
    } catch (error) {
      console.error('Error importing rankings:', error);
    }
  };

  const handleDuplicate = async () => {
    if (!selectedGroup) return;

    try {
      await duplicateGroup.mutateAsync({
        groupId: selectedGroup.id,
        data: {
          ...duplicateForm,
          start_date: new Date(duplicateForm.start_date).toISOString(),
          end_date: new Date(duplicateForm.end_date).toISOString(),
        }
      });
      setShowDuplicateDialog(false);
      resetDuplicateForm();
    } catch (error) {
      console.error('Error duplicating group:', error);
    }
  };

  const resetGroupForm = () => {
    setGroupForm({
      name: '',
      description: '',
      ranking_type: 'points',
      start_date: '',
      end_date: '',
      is_active: true,
      is_visible: true,
      settings: {}
    });
  };

  const resetRankingForm = () => {
    setRankingForm({
      playerId: '',
      isExternal: false,
      externalPlayerName: '',
      externalPlayerEmail: '',
      points: 0,
      handsPlayed: 0,
      tournamentsPlayed: 0,
      totalRake: 0,
      wins: 0,
      losses: 0,
      isVisible: true,
    });
  };

  const resetDuplicateForm = () => {
    setDuplicateForm({
      name: '',
      start_date: '',
      end_date: '',
      copy_rankings: false
    });
  };

  const getStatusBadge = (group: any) => {
    const now = new Date();
    const start = new Date(group.start_date);
    const end = new Date(group.end_date);

    if (now < start) {
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Próximo</Badge>;
    } else if (now > end) {
      return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/30">Finalizado</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Activo</Badge>;
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
          <h1 className="text-3xl font-bold">Sistema de Rankings</h1>
          <p className="text-muted-foreground">
            Gestiona grupos de rankings y jugadores
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => downloadTemplate.mutate()}>
            <Download className="mr-2 h-4 w-4" />
            Plantilla Excel
          </Button>
          <Button onClick={() => {
            setSelectedGroup(null);
            resetGroupForm();
            setShowCreateGroupDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Grupo
          </Button>
        </div>
      </motion.div>

      {/* Tabs principales */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Grupos de Rankings
            </TabsTrigger>
            <TabsTrigger 
              value="rankings" 
              disabled={!selectedGroup}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {selectedGroup ? `Jugadores - ${selectedGroup.name}` : 'Selecciona un grupo'}
            </TabsTrigger>
          </TabsList>

          {/* Tab: Grupos de Rankings */}
          <TabsContent value="groups" className="space-y-6">
            {/* Filtros para grupos */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={groupFilters.type}
                      onValueChange={(value) => setGroupFilters({ ...groupFilters, type: value, page: 1 })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {Object.entries(RANKING_TYPES).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <Select
                      value={groupFilters.status}
                      onValueChange={(value) => setGroupFilters({ ...groupFilters, status: value, page: 1 })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="upcoming">Próximos</SelectItem>
                        <SelectItem value="finished">Finalizados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={groupFilters.includeHidden}
                      onCheckedChange={(checked) => 
                        setGroupFilters({ ...groupFilters, includeHidden: checked, page: 1 })
                      }
                    />
                    <Label>Incluir ocultos</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de grupos */}
            <Card>
              <CardContent className="p-0">
                {groupsLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Cargando grupos...</span>
                    </div>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl mb-2">No hay grupos de rankings</p>
                    <p>Crea el primer grupo para comenzar</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Jugadores</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead>Visibilidad</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((group: any, index: number) => {
                        const config = RANKING_TYPES[group.ranking_type as keyof typeof RANKING_TYPES];
                        const Icon = config?.icon || Target;
                        
                        return (
                          <motion.tr
                            key={group.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "cursor-pointer hover:bg-muted/50 transition-colors",
                              selectedGroup?.id === group.id && "bg-muted"
                            )}
                            onClick={() => setSelectedGroup(group)}
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium">{group.name}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {group.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Icon className={cn("h-4 w-4", config?.color)} />
                                <span>{config?.label}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{formatDate(group.start_date)}</div>
                                <div className="text-muted-foreground">
                                  hasta {formatDate(group.end_date)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(group)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{group.playerCount || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{formatDate(group.created_at)}</div>
                                {group.creator && (
                                  <div className="text-muted-foreground">
                                    por {group.creator.username}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {group.is_visible ? (
                                  <Eye className="h-4 w-4 text-green-500" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
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
                                      setSelectedGroup(group);
                                      setActiveTab('rankings');
                                    }}
                                  >
                                    <Users className="mr-2 h-4 w-4" />
                                    Ver Jugadores
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setGroupForm({
                                        name: group.name,
                                        description: group.description || '',
                                        ranking_type: group.ranking_type,
                                        start_date: group.start_date.split('T')[0],
                                        end_date: group.end_date.split('T')[0],
                                        is_active: group.is_active,
                                        is_visible: group.is_visible,
                                        settings: group.settings || {}
                                      });
                                      setSelectedGroup(group);
                                      setShowCreateGroupDialog(true);
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedGroup(group);
                                      setDuplicateForm({
                                        name: `${group.name} - Copia`,
                                        start_date: '',
                                        end_date: '',
                                        copy_rankings: false
                                      });
                                      setShowDuplicateDialog(true);
                                    }}
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => deleteGroup.mutate(group.id)}
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

            {/* Paginación grupos */}
            {totalGroupPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGroupFilters({ ...groupFilters, page: groupFilters.page - 1 })}
                  disabled={groupFilters.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalGroupPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={groupFilters.page === pageNum ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setGroupFilters({ ...groupFilters, page: pageNum })}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGroupFilters({ ...groupFilters, page: groupFilters.page + 1 })}
                  disabled={groupFilters.page === totalGroupPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Tab: Rankings de Grupo */}
          <TabsContent value="rankings" className="space-y-6">
            {selectedGroup && (
              <>
                {/* Header del grupo seleccionado */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {(() => {
                              const config = RANKING_TYPES[selectedGroup.ranking_type as keyof typeof RANKING_TYPES];
                              const Icon = config?.icon || Target;
                              return <Icon className={cn("h-5 w-5", config?.color)} />;
                            })()}
                            {selectedGroup.name}
                          </CardTitle>
                          <CardDescription>{selectedGroup.description}</CardDescription>
                        </div>
                        {getStatusBadge(selectedGroup)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Importar Excel
                        </Button>
                        <Button onClick={() => setShowCreateRankingDialog(true)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Agregar Jugador
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Estadísticas del grupo */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Jugadores</p>
                            <p className="text-2xl font-bold">{stats.totalPlayers}</p>
                          </div>
                          <Users className="h-8 w-8 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Registrados</p>
                            <p className="text-2xl font-bold">{stats.playerDistribution.registered}</p>
                          </div>
                          <Users className="h-8 w-8 opacity-50 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Externos</p>
                            <p className="text-2xl font-bold">{stats.playerDistribution.external}</p>
                          </div>
                          <Users className="h-8 w-8 opacity-50 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Promedio</p>
                            <p className="text-2xl font-bold">
                              {stats.averages.primaryField === 'total_rake' 
                                ? formatCurrency(stats.averages.avgValue)
                                : Math.round(stats.averages.avgValue).toLocaleString()
                              }
                            </p>
                          </div>
                          <BarChart3 className="h-8 w-8 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Herramientas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Herramientas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => recalculate.mutate(selectedGroup.id)}
                        disabled={recalculate.isPending}
                      >
                        <RefreshCw className={cn("mr-2 h-4 w-4", recalculate.isPending && "animate-spin")} />
                        Recalcular Posiciones
                      </Button>
                      
                      <Button variant="outline" asChild>
                        <Link href={`/rankings`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Página Pública
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabla de rankings */}
                <Card>
                  <CardContent className="p-0">
                    {rankingsLoading ? (
                      <div className="p-8 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span>Cargando rankings...</span>
                        </div>
                      </div>
                    ) : rankings.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-xl mb-2">No hay jugadores en este grupo</p>
                        <p>Agrega el primer jugador o importa datos desde Excel</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Posición</TableHead>
                            <TableHead>Jugador</TableHead>
                            <TableHead>Estadística Principal</TableHead>
                            <TableHead>Manos</TableHead>
                            <TableHead>Torneos</TableHead>
                            <TableHead>Win Rate</TableHead>
                            <TableHead>Rake</TableHead>
                            <TableHead>Visibilidad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rankings.map((ranking: any, index: number) => {
                            const getMainStat = () => {
                              switch (selectedGroup.ranking_type) {
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
                                      <AvatarImage src={ranking.player?.profile_data?.avatar} />
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
                                  <span className="font-semibold">{getMainStat()}</span>
                                </TableCell>
                                <TableCell>{ranking.hands_played?.toLocaleString() || 0}</TableCell>
                                <TableCell>{ranking.tournaments_played || 0}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span>{ranking.win_rate}%</span>
                                    {ranking.win_rate >= 60 && (
                                      <TrendingUp className="h-3 w-3 text-green-500" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{formatCurrency(ranking.total_rake || 0)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={ranking.is_visible}
                                      onCheckedChange={() => 
                                        toggleVisibility.mutate({
                                          groupId: selectedGroup.id,
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
                                          setRankingForm({
                                            playerId: ranking.player_id || '',
                                            isExternal: ranking.is_external,
                                            externalPlayerName: ranking.external_player_name || '',
                                            externalPlayerEmail: ranking.external_player_email || '',
                                            points: ranking.points || 0,
                                            handsPlayed: ranking.hands_played || 0,
                                            tournamentsPlayed: ranking.tournaments_played || 0,
                                            totalRake: ranking.total_rake || 0,
                                            wins: ranking.wins || 0,
                                            losses: ranking.losses || 0,
                                            isVisible: ranking.is_visible,
                                          });
                                          setSelectedRanking(ranking);
                                          setShowCreateRankingDialog(true);
                                        }}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => deleteRanking.mutate({
                                          groupId: selectedGroup.id,
                                          rankingId: ranking.id
                                        })}
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

                {/* Paginación rankings */}
                {totalRankingPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRankingFilters({ ...rankingFilters, page: rankingFilters.page - 1 })}
                      disabled={rankingFilters.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalRankingPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={rankingFilters.page === pageNum ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setRankingFilters({ ...rankingFilters, page: pageNum })}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRankingFilters({ ...rankingFilters, page: rankingFilters.page + 1 })}
                      disabled={rankingFilters.page === totalRankingPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog para crear/editar grupo */}
      <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? 'Editar Grupo de Ranking' : 'Crear Grupo de Ranking'}
            </DialogTitle>
            <DialogDescription>
              {selectedGroup 
                ? 'Modifica la configuración del grupo de ranking'
                : 'Configura un nuevo grupo de ranking para organizar a los jugadores'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="font-semibold">Información básica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="groupName">Nombre del grupo</Label>
                  <Input
                    id="groupName"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                    placeholder="ej: Cash Game Ranking Enero 2025"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="groupDescription">Descripción</Label>
                  <Textarea
                    id="groupDescription"
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                    placeholder="Describe el propósito y reglas de este ranking"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupType">Tipo de ranking</Label>
                  <Select
                    value={groupForm.ranking_type}
                    onValueChange={(value) => setGroupForm({ ...groupForm, ranking_type: value })}
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
              </div>
            </div>

            {/* Configuración de fechas */}
            <div className="space-y-4">
              <h4 className="font-semibold">Período del ranking</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={groupForm.start_date}
                    onChange={(e) => setGroupForm({ ...groupForm, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={groupForm.end_date}
                    onChange={(e) => setGroupForm({ ...groupForm, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div className="space-y-4">
              <h4 className="font-semibold">Configuración</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={groupForm.is_active}
                    onCheckedChange={(checked) => 
                      setGroupForm({ ...groupForm, is_active: checked })
                    }
                  />
                  <Label>Grupo activo (acepta actualizaciones)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={groupForm.is_visible}
                    onCheckedChange={(checked) => 
                      setGroupForm({ ...groupForm, is_visible: checked })
                    }
                  />
                  <Label>Visible públicamente</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateGroupDialog(false);
                setSelectedGroup(null);
                resetGroupForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={selectedGroup ? handleUpdateGroup : handleCreateGroup}
              disabled={createGroup.isPending || updateGroup.isPending}
            >
              {(createGroup.isPending || updateGroup.isPending) ? 'Guardando...' : (selectedGroup ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear/editar ranking */}
      <Dialog open={showCreateRankingDialog} onOpenChange={setShowCreateRankingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRanking ? 'Editar Ranking' : 'Agregar Jugador'}
            </DialogTitle>
            <DialogDescription>
              {selectedRanking 
                ? 'Modifica los datos del ranking seleccionado'
                : `Agrega un nuevo jugador al ranking: ${selectedGroup?.name}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tipo de jugador */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={rankingForm.isExternal}
                onCheckedChange={(checked) => 
                  setRankingForm({ ...rankingForm, isExternal: checked })
                }
              />
              <Label>Jugador externo (sin cuenta en el sistema)</Label>
            </div>

            {/* Datos del jugador */}
            {rankingForm.isExternal ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="externalPlayerName">Nombre del jugador</Label>
                  <Input
                    id="externalPlayerName"
                    value={rankingForm.externalPlayerName}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
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
                    value={rankingForm.externalPlayerEmail}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
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
                  value={rankingForm.playerId}
                  onChange={(e) => setRankingForm({ 
                    ...rankingForm, 
                    playerId: e.target.value 
                  })}
                  placeholder="Username o ID del usuario"
                />
              </div>
            )}

            {/* Estadísticas */}
            <div className="space-y-4">
              <h4 className="font-semibold">Estadísticas del jugador</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="points">Puntos</Label>
                  <Input
                    id="points"
                    type="number"
                    value={rankingForm.points}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
                      points: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handsPlayed">Manos jugadas</Label>
                  <Input
                    id="handsPlayed"
                    type="number"
                    value={rankingForm.handsPlayed}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
                      handsPlayed: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournamentsPlayed">Torneos jugados</Label>
                  <Input
                    id="tournamentsPlayed"
                    type="number"
                    value={rankingForm.tournamentsPlayed}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
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
                    value={rankingForm.totalRake}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
                      totalRake: parseFloat(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wins">Victorias</Label>
                  <Input
                    id="wins"
                    type="number"
                    value={rankingForm.wins}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
                      wins: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="losses">Derrotas</Label>
                  <Input
                    id="losses"
                    type="number"
                    value={rankingForm.losses}
                    onChange={(e) => setRankingForm({ 
                      ...rankingForm, 
                      losses: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>
              </div>

              {/* Win rate calculado */}
              {(rankingForm.wins > 0 || rankingForm.losses > 0) && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Win Rate calculado: {
                      rankingForm.wins + rankingForm.losses > 0 
                        ? ((rankingForm.wins / (rankingForm.wins + rankingForm.losses)) * 100).toFixed(1)
                        : 0
                    }%
                  </p>
                </div>
              )}
            </div>

            {/* Visibilidad */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={rankingForm.isVisible}
                onCheckedChange={(checked) => 
                  setRankingForm({ ...rankingForm, isVisible: checked })
                }
              />
              <Label>Visible en rankings públicos</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateRankingDialog(false);
                setSelectedRanking(null);
                resetRankingForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRanking}
              disabled={updateRanking.isPending}
            >
              {updateRanking.isPending ? 'Guardando...' : (selectedRanking ? 'Actualizar' : 'Agregar')}
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
              Sube un archivo Excel con los datos de rankings para {selectedGroup?.name}.
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
                <li>Columnas requeridas: Usuario/Nombre, Email (opcional)</li>
                <li>Columnas de datos: Puntos, Manos, Torneos, Rake, Victorias, Derrotas</li>
                <li>Para jugadores externos usar nombres sin registrar</li>
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

      {/* Dialog para duplicar grupo */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicar Grupo de Ranking</DialogTitle>
            <DialogDescription>
              Crea una copia de {selectedGroup?.name} con nuevas fechas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duplicateName">Nombre del nuevo grupo</Label>
              <Input
                id="duplicateName"
                value={duplicateForm.name}
                onChange={(e) => setDuplicateForm({ 
                  ...duplicateForm, 
                  name: e.target.value 
                })}
                placeholder="Nombre para la copia"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duplicateStartDate">Fecha de inicio</Label>
                <Input
                  id="duplicateStartDate"
                  type="date"
                  value={duplicateForm.start_date}
                  onChange={(e) => setDuplicateForm({ 
                    ...duplicateForm, 
                    start_date: e.target.value 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duplicateEndDate">Fecha de fin</Label>
                <Input
                  id="duplicateEndDate"
                  type="date"
                  value={duplicateForm.end_date}
                  onChange={(e) => setDuplicateForm({ 
                    ...duplicateForm, 
                    end_date: e.target.value 
                  })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={duplicateForm.copy_rankings}
                onCheckedChange={(checked) => 
                  setDuplicateForm({ ...duplicateForm, copy_rankings: checked })
                }
              />
              <Label>Copiar jugadores existentes</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDuplicateDialog(false);
                resetDuplicateForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDuplicate}
              disabled={duplicateGroup.isPending}
            >
              {duplicateGroup.isPending ? 'Duplicando...' : 'Duplicar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}