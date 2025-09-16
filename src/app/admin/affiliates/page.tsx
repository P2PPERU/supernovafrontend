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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAffiliateProfiles, useUpdateAffiliateProfile, useAffiliationHistory } from '@/hooks/admin/useAffiliates';
import { formatDate, formatCurrency } from '@/lib/utils';
import { 
  MoreHorizontal, 
  Search, 
  Users,
  Gift,
  TrendingUp,
  Activity,
  Edit,
  Eye,
  Code,
  Copy,
  ExternalLink,
  UserCheck,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Building2,
  Hash
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Fixed interface definition to match the actual data structure
interface AffiliateProfile {
  id: string;
  user_id: string;
  affiliate_code: string;
  commission_rate: number;
  total_referrals: number;
  total_earnings: number;
  is_active: boolean;
  custom_url?: string;
  user: {
    id: string;
    username: string;
    email: string;
    profile_data: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
    created_at?: string; // Made optional since it might not always be present
  };
}

// Type for affiliation history
interface AffiliationHistory {
  id: string;
  client: {
    username: string;
    email: string;
  };
  agent: {
    username: string;
    email: string;
  };
  affiliate_code_used?: string;
  created_at: string;
  ip_address: string;
}

export default function AdminAffiliatesPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 10,
  });

  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateProfile | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    commission_rate: 0,
    custom_url: '',
    is_active: true,
  });

  // Hooks de datos
  const { data, isLoading } = useAffiliateProfiles({
    ...filters,
    status: filters.status === 'all' ? undefined : filters.status,
  });

  const { data: historyData } = useAffiliationHistory({
    page: 1,
    limit: 10,
  });

  const updateAffiliate = useUpdateAffiliateProfile();

  const affiliates = (data?.data || []) as AffiliateProfile[];
  const totalPages = data?.totalPages || 1;
  const affiliationHistory = (historyData?.data || []) as AffiliationHistory[];

  // Estadísticas - Fixed type casting and reduce functions
  const stats = {
    totalAffiliates: affiliates.length,
    activeAffiliates: affiliates.filter((a: AffiliateProfile) => a.is_active).length,
    totalReferrals: affiliates.reduce((sum: number, a: AffiliateProfile) => sum + a.total_referrals, 0),
    totalEarnings: affiliates.reduce((sum: number, a: AffiliateProfile) => sum + a.total_earnings, 0),
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handleEdit = (affiliate: AffiliateProfile) => {
    setSelectedAffiliate(affiliate);
    setEditData({
      commission_rate: affiliate.commission_rate,
      custom_url: affiliate.custom_url || '',
      is_active: affiliate.is_active,
    });
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedAffiliate) return;

    try {
      await updateAffiliate.mutateAsync({
        userId: selectedAffiliate.user_id,
        data: editData,
      });
      setShowEditDialog(false);
      setSelectedAffiliate(null);
    } catch (error) {
      console.error('Error updating affiliate:', error);
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
          <h1 className="text-3xl font-bold">Gestión de Afiliados</h1>
          <p className="text-muted-foreground">
            Administra agentes y su programa de afiliación
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <Users className="mr-2 h-4 w-4" />
            Crear Agente
          </Link>
        </Button>
      </motion.div>

      {/* Estadísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Afiliados</p>
                <p className="text-2xl font-bold">{stats.totalAffiliates}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeAffiliates}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Referidos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ganancias Totales</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="affiliates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="affiliates">Afiliados</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="codes">Códigos</TabsTrigger>
          </TabsList>

          <TabsContent value="affiliates" className="space-y-4">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Buscar por nombre, código..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        className="pl-10"
                      />
                    </div>
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

            {/* Tabla de afiliados */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Cargando afiliados...</span>
                    </div>
                  </div>
                ) : affiliates.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No se encontraron afiliados
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agente</TableHead>
                        <TableHead>Código de Afiliado</TableHead>
                        <TableHead>Comisión</TableHead>
                        <TableHead>Referidos</TableHead>
                        <TableHead>Ganancias</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {affiliates.map((affiliate: AffiliateProfile, index: number) => (
                        <motion.tr
                          key={affiliate.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={affiliate.user.profile_data?.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                  {affiliate.user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{affiliate.user.username}</p>
                                {affiliate.user.profile_data?.firstName && (
                                  <p className="text-xs text-muted-foreground">
                                    {affiliate.user.profile_data.firstName} {affiliate.user.profile_data.lastName}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">{affiliate.user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                                {affiliate.affiliate_code}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(affiliate.affiliate_code, 'Código')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {affiliate.commission_rate}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{affiliate.total_referrals}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">
                              {formatCurrency(affiliate.total_earnings)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={affiliate.is_active ? 'default' : 'secondary'}>
                              {affiliate.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
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
                                  <Link href={`/admin/users/${affiliate.user_id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(affiliate)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar afiliado
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/affiliates/${affiliate.user_id}/codes`}>
                                    <Code className="mr-2 h-4 w-4" />
                                    Gestionar códigos
                                  </Link>
                                </DropdownMenuItem>
                                {affiliate.custom_url && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(affiliate.custom_url, '_blank')}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Ver URL personalizada
                                  </DropdownMenuItem>
                                )}
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
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
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Afiliaciones</CardTitle>
                <CardDescription>
                  Registro de nuevas afiliaciones en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Agente</TableHead>
                      <TableHead>Código Usado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliationHistory.map((history: AffiliationHistory) => (
                      <TableRow key={history.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{history.client.username}</p>
                            <p className="text-xs text-muted-foreground">{history.client.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{history.agent.username}</p>
                            <p className="text-xs text-muted-foreground">{history.agent.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {history.affiliate_code_used ? (
                            <code className="px-2 py-1 bg-muted rounded text-sm">
                              {history.affiliate_code_used}
                            </code>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{formatDate(history.created_at)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">{history.ip_address}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Códigos de Afiliado</CardTitle>
                <CardDescription>
                  Gestiona los códigos personalizados de los agentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Funcionalidad de códigos en desarrollo</p>
                  <p className="text-sm">Aquí aparecerán los códigos personalizados de afiliado</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog para editar afiliado */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Afiliado</DialogTitle>
            <DialogDescription>
              Actualiza la configuración del afiliado {selectedAffiliate?.user.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Tasa de Comisión (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editData.commission_rate}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  commission_rate: parseFloat(e.target.value) || 0 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-url">URL Personalizada</Label>
              <Input
                id="custom-url"
                placeholder="https://mi-sitio.com/registro"
                value={editData.custom_url}
                onChange={(e) => setEditData({ ...editData, custom_url: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Estado Activo</Label>
              <Switch
                id="active"
                checked={editData.is_active}
                onCheckedChange={(checked) => setEditData({ ...editData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={updateAffiliate.isPending}>
              {updateAffiliate.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}