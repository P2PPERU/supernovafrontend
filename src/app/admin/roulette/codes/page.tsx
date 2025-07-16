'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminRouletteCodes, useCreateRouletteCode } from '@/hooks/admin/useRoulette';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  Plus,
  Search,
  Code2,
  Copy,
  Check,
  Clock,
  Users,
  AlertCircle,
  Filter,
  Download,
  QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface RouletteCode {
  id: string;
  code: string;
  status: 'active' | 'used' | 'expired';
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  createdBy: {
    id: string;
    username: string;
  };
  createdAt: string;
  usedBy?: Array<{
    id: string;
    username: string;
    usedAt: string;
  }>;
}

export default function AdminRouletteCodesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10,
  });
  const [newCode, setNewCode] = useState({
    code: '',
    maxUses: 1,
    expiresAt: '',
  });

  const { data, isLoading } = useAdminRouletteCodes({
    ...filters,
    status: filters.status === 'all' ? undefined : filters.status,
  });
  const createCode = useCreateRouletteCode();

  const codes = data?.codes || [];
  const totalPages = data?.totalPages || 1;

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode({ ...newCode, code });
  };

  const handleCreateCode = () => {
    if (!newCode.code) {
      toast.error('El código es requerido');
      return;
    }

    createCode.mutate(
      {
        code: newCode.code,
        maxUses: newCode.maxUses,
        expiresAt: newCode.expiresAt || undefined,
      },
      {
        onSuccess: () => {
          setShowCreateDialog(false);
          setNewCode({ code: '', maxUses: 1, expiresAt: '' });
        },
      }
    );
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Código copiado al portapapeles');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Activo</Badge>;
      case 'used':
        return <Badge variant="secondary">Usado</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-gray-500">Expirado</Badge>;
      default:
        return null;
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

  // Stats
  const stats = {
    totalCodes: data?.total || 0,
    activeCodes: codes.filter((c: RouletteCode) => c.status === 'active').length,
    usedCodes: codes.filter((c: RouletteCode) => c.status === 'used').length,
    expiredCodes: codes.filter((c: RouletteCode) => c.status === 'expired').length,
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
          <h1 className="text-3xl font-bold">Códigos de Ruleta</h1>
          <p className="text-muted-foreground">
            Gestiona los códigos promocionales para giros adicionales
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Código
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Códigos</p>
                <p className="text-2xl font-bold">{stats.totalCodes}</p>
              </div>
              <Code2 className="h-8 w-8 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCodes}</p>
              </div>
              <Check className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.usedCodes}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold text-gray-600">{stats.expiredCodes}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400 opacity-50" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search">Buscar código</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por código..."
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
                    <SelectItem value="used">Usados</SelectItem>
                    <SelectItem value="expired">Expirados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla de códigos */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>Cargando códigos...</span>
                </div>
              </div>
            ) : codes.length === 0 ? (
              <div className="p-8 text-center">
                <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay códigos con los filtros aplicados
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Expira</TableHead>
                    <TableHead>Creado por</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code: RouletteCode, index: number) => (
                    <motion.tr
                      key={code.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm">
                            {code.code}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            {copiedCode === code.code ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(code.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{code.currentUses}</span>
                          <span className="text-muted-foreground">/ {code.maxUses}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {code.expiresAt ? (
                          <div>
                            <p className="text-sm">{formatDate(code.expiresAt)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(code.expiresAt)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sin expiración</span>
                        )}
                      </TableCell>
                      <TableCell>{code.createdBy?.username ?? '—'}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatDate(code.createdAt)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(code.createdAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // Aquí podrías implementar ver detalles del código
                            console.log('Ver detalles:', code);
                          }}
                        >
                          Ver detalles
                        </Button>
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
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-3 text-sm">
            Página {filters.page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Dialog para crear código */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Código</DialogTitle>
            <DialogDescription>
              Genera un código promocional para giros adicionales
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="Ej: SPIN2024"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                  className="font-mono uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomCode}
                >
                  Generar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                El código debe ser único en el sistema
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses">Máximo de usos</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                value={newCode.maxUses}
                onChange={(e) => setNewCode({ ...newCode, maxUses: parseInt(e.target.value) || 1 })}
              />
              <p className="text-xs text-muted-foreground">
                Número de veces que se puede usar este código
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Fecha de expiración (opcional)</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={newCode.expiresAt}
                onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Deja vacío para que no expire
              </p>
            </div>

            {/* Vista previa */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Vista previa:</h4>
              <div className="space-y-1 text-sm">
                <p>Código: <span className="font-mono font-bold">{newCode.code || 'SIN CÓDIGO'}</span></p>
                <p>Usos permitidos: <span className="font-medium">{newCode.maxUses}</span></p>
                <p>Expira: <span className="font-medium">
                  {newCode.expiresAt ? formatDate(newCode.expiresAt) : 'Nunca'}
                </span></p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCode}
              disabled={!newCode.code || createCode.isPending}
            >
              {createCode.isPending ? 'Creando...' : 'Crear Código'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}