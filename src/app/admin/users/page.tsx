'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserStatsCards } from '@/components/admin/users/stats-cards';
import { UserStatusDialog } from '@/components/admin/users/status-dialog';
import { UserRoleDialog } from '@/components/admin/users/role-dialog';
import { UserBalanceDialog } from '@/components/admin/users/balance-dialog';
import { UserPasswordDialog } from '@/components/admin/users/password-dialog';
import { useAdminUsers } from '@/hooks/admin/useUsers';
import { formatDate, formatCurrency } from '@/lib/utils';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Key,
  DollarSign,
  Shield,
  Power,
  Trash2,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '@/types';

export default function AdminUsersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: 'all',
    status: 'all',
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState({
    status: false,
    role: false,
    balance: false,
    password: false,
  });

  const { data, isLoading } = useAdminUsers({
    ...filters,
    role: filters.role === 'all' ? undefined : filters.role,
    status: filters.status === 'all' ? undefined : filters.status,
  });

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const getRoleBadge = (role: string) => {
    const variants: any = {
      admin: { color: 'bg-red-500', label: 'Admin' },
      agent: { color: 'bg-blue-500', label: 'Agente' },
      editor: { color: 'bg-purple-500', label: 'Editor' },
      client: { color: 'bg-green-500', label: 'Cliente' },
    };
    const variant = variants[role] || variants.client;
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500 text-white">Activo</Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500">Inactivo</Badge>
    );
  };

  const openDialog = (type: string, user: User) => {
    setSelectedUser(user);
    setDialogOpen({ ...dialogOpen, [type]: true });
  };

  const closeDialog = (type: string) => {
    setDialogOpen({ ...dialogOpen, [type]: false });
    setTimeout(() => setSelectedUser(null), 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona todos los usuarios del sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" />
            Crear Usuario
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <UserStatsCards />

      {/* Filters */}
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
                  placeholder="Buscar por nombre, email o username..."
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
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="agent">Agente</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="client">Cliente</SelectItem>
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Cargando usuarios...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron usuarios con los filtros aplicados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profile?.avatar} alt={user.username} />
                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(user.balance)}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
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
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog('status', user)}
                          >
                            <Power className="mr-2 h-4 w-4" />
                            Cambiar Estado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog('role', user)}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Cambiar Rol
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog('balance', user)}
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Modificar Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog('password', user)}
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Restablecer Contraseña
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={filters.page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: pageNum })}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && <span>...</span>}
            {totalPages > 5 && (
              <Button
                variant={filters.page === totalPages ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters({ ...filters, page: totalPages })}
              >
                {totalPages}
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Dialogs */}
      {selectedUser && (
        <>
          <UserStatusDialog
            open={dialogOpen.status}
            onClose={() => closeDialog('status')}
            user={selectedUser}
          />
          <UserRoleDialog
            open={dialogOpen.role}
            onClose={() => closeDialog('role')}
            user={selectedUser}
          />
          <UserBalanceDialog
            open={dialogOpen.balance}
            onClose={() => closeDialog('balance')}
            user={selectedUser}
          />
          <UserPasswordDialog
            open={dialogOpen.password}
            onClose={() => closeDialog('password')}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}