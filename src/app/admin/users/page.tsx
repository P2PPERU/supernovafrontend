'use client';

import { useState } from 'react';
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
import { useAdminUsers, useAdminUserStats, useUpdateUserStatus, useUpdateUserRole, useResetUserPassword, useDeleteUser } from '@/hooks/admin/useUsers';
import { adminUsersAPI } from '@/lib/api-endpoints';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Filter,
  User,
  Shield,
  Mail,
  Phone,
  Calendar,
  Activity,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Key,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Gamepad2,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'agent' | 'editor' | 'client';
  isActive: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  // Estadísticas adicionales
  totalSpins?: number;
  totalWins?: number;
  isValidated?: boolean;
  // Datos de afiliación si es cliente
  affiliate?: {
    agent: {
      username: string;
      email: string;
    };
    code_used?: string;
  };
  // Datos de agente si es agent
  affiliateProfile?: {
    affiliate_code: string;
    commission_rate: number;
    total_referrals: number;
    total_earnings: number;
  };
}

export default function AdminUsersPage() {
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    page: 1,
    limit: 10,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Hooks de datos
  const { data, isLoading, refetch, error } = useAdminUsers({
    ...filters,
    role: filters.role === 'all' ? undefined : filters.role,
    status: filters.status === 'all' ? undefined : filters.status,
  });

  // Debug logs
  console.log('🔍 Debug - Users data:', { data, isLoading, error });
  console.log('🔍 Debug - Filters:', filters);

  const { data: statsData, error: statsError } = useAdminUserStats();
  
  // Debug stats
  console.log('📊 Debug - Stats data:', { statsData, statsError });
  const updateStatus = useUpdateUserStatus();
  const updateRole = useUpdateUserRole();
  const resetPassword = useResetUserPassword();
  const deleteUser = useDeleteUser();

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  // Estadísticas del API
  const stats = {
    total: totalItems,
    active: users.filter((u: User) => u.isActive).length,
    inactive: users.filter((u: User) => !u.isActive).length,
    validated: users.filter((u: User) => u.isValidated).length,
    // Estadísticas adicionales del backend
    byRole: statsData?.stats?.byRole || [],
    newUsersToday: statsData?.stats?.newUsersToday || 0,
    growthMetrics: statsData?.stats?.growthMetrics || {
      dailyGrowth: 0,
      weeklyGrowth: 0,
      monthlyGrowth: 0,
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      agent: 'default',
      editor: 'secondary',
      client: 'outline',
    } as const;

    const labels = {
      admin: 'Administrador',
      agent: 'Agente',
      editor: 'Editor',
      client: 'Cliente',
    };

    return (
      <Badge variant={variants[role as keyof typeof variants] || 'outline'}>
        {labels[role as keyof typeof labels] || role}
      </Badge>
    );
  };

  const handleStatusToggle = async (user: User) => {
    try {
      await updateStatus.mutateAsync({
        id: user.id,
        isActive: !user.isActive,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateRole.mutateAsync({
        id: userId,
        role: newRole,
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handlePasswordReset = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      await resetPassword.mutateAsync({
        id: selectedUser.id,
        newPassword,
      });
      setShowPasswordDialog(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser.mutateAsync(selectedUser.id);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema - Total: {totalItems.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              console.log('Debug - Testing API directly...');
              try {
                const result = await adminUsersAPI.getUsers({ limit: 5, sort: 'createdAt', order: 'desc' });
                console.log('Debug - Direct API result:', result);
                toast.success(`API funciona: ${result.data?.length || 0} usuarios`);
              } catch (error) {
                console.error('Debug - Direct API error:', error);
                toast.error(`Error API: ${(error as Error)?.message || 'Error desconocido'}`);
              }
            }}
          >
            Debug API
          </Button>
          <Button asChild>
            <Link href="/admin/users/create">
              <Plus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Estadísticas mejoradas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +{stats.newUsersToday} nuevos hoy
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.active / Math.max(stats.total, 1)) * 100).toFixed(1)}% del total
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.inactive / Math.max(stats.total, 1)) * 100).toFixed(1)}% del total
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Validados</p>
                <p className="text-2xl font-bold text-purple-600">{stats.validated}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Crecimiento: +{stats.growthMetrics.monthlyGrowth}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Distribución por roles */}
      {stats.byRole.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribución por Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.byRole.map((role: any) => (
                  <div key={role.role} className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{role.count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{role.role}s</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${(role.count / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filtros */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre, email, ID..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => setFilters({ ...filters, role: value, page: 1 })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Administradores</SelectItem>
                    <SelectItem value="agent">Agentes</SelectItem>
                    <SelectItem value="editor">Editores</SelectItem>
                    <SelectItem value="client">Clientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla de usuarios */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>Cargando usuarios...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>Error al cargar usuarios: {(error as Error)?.message || 'Error desconocido'}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Intentar de nuevo
                </Button>
              </div>
            ) : !data ? (
              <div className="p-8 text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se pudieron cargar los datos</p>
                <p className="text-sm mt-2">Respuesta del servidor: {JSON.stringify(data)}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Intentar de nuevo
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron usuarios con los filtros aplicados</p>
                <p className="text-sm mt-2">Total en BD: {totalItems}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilters({ search: '', role: 'all', status: 'all', page: 1, limit: 10 })}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
                                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Estadísticas</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User, index: number) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profile?.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            {user.profile?.firstName && (
                              <p className="text-xs text-muted-foreground">
                                {user.profile.firstName} {user.profile.lastName}
                              </p>
                            )}
                            {user.affiliateProfile && (
                              <Badge variant="outline" className="text-xs">
                                {user.affiliateProfile.affiliate_code}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.profile?.phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{user.profile.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={user.role === 'admin'}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="agent">Agente</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="client">Cliente</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => handleStatusToggle(user)}
                            disabled={updateStatus.isPending}
                          />
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        {user.isValidated && (
                          <Badge variant="outline" className="text-xs mt-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Validado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Gamepad2 className="h-3 w-3 text-muted-foreground" />
                            <span>{user.totalSpins || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3 text-muted-foreground" />
                            <span>{user.totalWins || 0}</span>
                          </div>
                          {user.role === 'agent' && user.affiliateProfile && (
                            <div className="text-xs text-purple-600">
                              {user.affiliateProfile.total_referrals} referidos
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatDate(user.createdAt)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(user.createdAt)}
                          </p>
                          {user.lastLoginAt && (
                            <p className="text-xs text-muted-foreground">
                              Última conexión: {formatRelativeTime(user.lastLoginAt)}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${user.id}`}>
                                <User className="mr-2 h-4 w-4" />
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${user.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordDialog(true);
                              }}
                            >
                              <Key className="mr-2 h-4 w-4" />
                              Restablecer contraseña
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
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

      {/* Paginación */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {((filters.page - 1) * filters.limit) + 1} a {Math.min(filters.page * filters.limit, totalItems)} de {totalItems} usuarios
          </p>
          <div className="flex items-center gap-2">
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
              {totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: totalPages })}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
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
          </div>
        </motion.div>
      )}

      {/* Dialog para restablecer contraseña */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restablecer Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa una nueva contraseña para el usuario {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setNewPassword('');
                setSelectedUser(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePasswordReset}
              disabled={!newPassword || newPassword.length < 6 || resetPassword.isPending}
            >
              {resetPassword.isPending ? 'Restableciendo...' : 'Restablecer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              ¿Eliminar Usuario?
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario {selectedUser?.username}?
              Esta acción no se puede deshacer y eliminará:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Información personal del usuario</li>
                <li>Historial de transacciones</li>
                <li>Datos de afiliación (si aplica)</li>
                <li>Estadísticas y actividad</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedUser(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? 'Eliminando...' : 'Eliminar Usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}