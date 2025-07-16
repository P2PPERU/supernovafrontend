'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
import { 
  useAdminPendingValidations, 
  useValidateUser, 
  useValidateBatch,
  useValidationHistory 
} from '@/hooks/admin/useRoulette';
import { PendingValidation } from '@/services/admin/roulette.service';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck,
  AlertCircle,
  Filter,
  History,
  Search,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminValidationsPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationAction, setValidationAction] = useState<'approve' | 'reject'>('approve');
  const [validationNotes, setValidationNotes] = useState('');
  const [selectedUser, setSelectedUser] = useState<PendingValidation | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [historyFilters, setHistoryFilters] = useState({
    action: 'all',
    startDate: '',
    endDate: '',
  });

  const { data: pendingData, isLoading: pendingLoading } = useAdminPendingValidations({ page, limit: 10 });
  const { data: historyData, isLoading: historyLoading } = useValidationHistory({
    ...historyFilters,
    action: historyFilters.action === 'all' ? undefined : historyFilters.action,
  });
  
  const validateUser = useValidateUser();
  const validateBatch = useValidateBatch();

  const pendingValidations = pendingData?.validations || [];
  const validationHistory = historyData?.history || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(pendingValidations.map((v: PendingValidation) => v.user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleIndividualValidation = (validation: PendingValidation, action: 'approve' | 'reject') => {
    setSelectedUser(validation);
    setValidationAction(action);
    setShowValidationDialog(true);
  };

  const handleBatchValidation = (action: 'approve' | 'reject') => {
    if (selectedUsers.length === 0) {
      toast.error('Selecciona al menos un usuario');
      return;
    }
    setSelectedUser(null);
    setValidationAction(action);
    setShowValidationDialog(true);
  };

  const executeValidation = () => {
    if (selectedUser) {
      // Validación individual
      validateUser.mutate(
        {
          userId: selectedUser.user.id,
          data: { action: validationAction, notes: validationNotes },
        },
        {
          onSuccess: () => {
            setShowValidationDialog(false);
            setValidationNotes('');
            setSelectedUser(null);
          },
        }
      );
    } else {
      // Validación en lote
      validateBatch.mutate(
        {
          userIds: selectedUsers,
          action: validationAction,
          notes: validationNotes,
        },
        {
          onSuccess: () => {
            setShowValidationDialog(false);
            setValidationNotes('');
            setSelectedUsers([]);
          },
        }
      );
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Validaciones de Ruleta</h1>
        <p className="text-muted-foreground">
          Gestiona las validaciones pendientes de usuarios
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{pendingData?.total || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprobadas Hoy</p>
                <p className="text-2xl font-bold">
                  {historyData?.stats?.approvedToday || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rechazadas Hoy</p>
                <p className="text-2xl font-bold">
                  {historyData?.stats?.rejectedToday || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa Aprobación</p>
                <p className="text-2xl font-bold">
                  {historyData?.stats?.approvalRate || 0}%
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pendientes ({pendingData?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* Validaciones Pendientes */}
          <TabsContent value="pending" className="space-y-4">
            {pendingValidations.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Acciones en Lote</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedUsers.length} seleccionados
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBatchValidation('approve')}
                        disabled={selectedUsers.length === 0}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBatchValidation('reject')}
                        disabled={selectedUsers.length === 0}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            <Card>
              <CardContent className="p-0">
                {pendingLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Cargando validaciones...</span>
                    </div>
                  </div>
                ) : pendingValidations.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay validaciones pendientes
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedUsers.length === pendingValidations.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Premio Demo</TableHead>
                        <TableHead>Fecha de Giro</TableHead>
                        <TableHead>Días Esperando</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingValidations.map((validation: PendingValidation, index: number) => (
                        <motion.tr
                          key={validation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(validation.user.id)}
                              onCheckedChange={(checked) => 
                                handleSelectUser(validation.user.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {validation.user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{validation.user.username}</p>
                                <p className="text-xs text-muted-foreground">
                                  {validation.user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {validation.demoPrize.icon || '🎁'}
                              </span>
                              <span className="font-medium">
                                {validation.demoPrize.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{formatDate(validation.spinDate)}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatRelativeTime(validation.spinDate)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={validation.daysWaiting > 7 ? 'destructive' : 'secondary'}
                            >
                              {validation.daysWaiting} días
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleIndividualValidation(validation, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleIndividualValidation(validation, 'reject')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Paginación */}
            {pendingData && pendingData.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Página {page} de {pendingData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pendingData.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Historial */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="action">Acción</Label>
                    <Select
                      value={historyFilters.action}
                      onValueChange={(value) => 
                        setHistoryFilters({ ...historyFilters, action: value })
                      }
                    >
                      <SelectTrigger id="action">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="approve">Aprobadas</SelectItem>
                        <SelectItem value="reject">Rechazadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Desde</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={historyFilters.startDate}
                      onChange={(e) => 
                        setHistoryFilters({ ...historyFilters, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Hasta</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={historyFilters.endDate}
                      onChange={(e) => 
                        setHistoryFilters({ ...historyFilters, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                {historyLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Cargando historial...</span>
                    </div>
                  </div>
                ) : validationHistory.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No hay registros en el historial
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Premio</TableHead>
                        <TableHead>Acción</TableHead>
                        <TableHead>Validado por</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationHistory.map((record: any, index: number) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {record.user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{record.user.username}</p>
                                <p className="text-xs text-muted-foreground">
                                  {record.user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {record.prize.icon || '🎁'}
                              </span>
                              <span>{record.prize.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={record.action === 'approve' ? 'default' : 'destructive'}
                            >
                              {record.action === 'approve' ? 'Aprobado' : 'Rechazado'}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.validatedBy.username}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{formatDate(record.validatedAt)}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatRelativeTime(record.validatedAt)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.notes ? (
                              <span className="text-sm">{record.notes}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog de validación */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {validationAction === 'approve' ? 'Aprobar' : 'Rechazar'} Validación
            </DialogTitle>
            <DialogDescription>
              {selectedUser ? (
                <>
                  {validationAction === 'approve' 
                    ? 'El usuario recibirá el giro real para obtener su premio.'
                    : 'El usuario no recibirá el giro real.'}
                </>
              ) : (
                <>
                  Estás a punto de {validationAction === 'approve' ? 'aprobar' : 'rechazar'} 
                  {' '}{selectedUsers.length} validaciones.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium mb-2">Información del Usuario</h4>
                <div className="space-y-1 text-sm">
                  <p>Usuario: <span className="font-medium">{selectedUser.user.username}</span></p>
                  <p>Email: <span className="font-medium">{selectedUser.user.email}</span></p>
                  <p>Premio Demo: <span className="font-medium">{selectedUser.demoPrize.name}</span></p>
                  <p>Esperando: <span className="font-medium">{selectedUser.daysWaiting} días</span></p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Agregar notas sobre esta validación..."
              value={validationNotes}
              onChange={(e) => setValidationNotes(e.target.value)}
              rows={3}
            />
          </div>

          {validationAction === 'approve' && (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-700 dark:text-green-300">
                <p className="font-medium">Al aprobar:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>El usuario recibirá un giro real</li>
                  <li>Podrá obtener un premio real</li>
                  <li>Se marcará como validado en el sistema</li>
                </ul>
              </div>
            </div>
          )}

          {validationAction === 'reject' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium">Al rechazar:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>El usuario NO recibirá el giro real</li>
                  <li>Se eliminará de las validaciones pendientes</li>
                  <li>Se guardará un registro del rechazo</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowValidationDialog(false);
                setValidationNotes('');
                setSelectedUser(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={executeValidation}
              disabled={validateUser.isPending || validateBatch.isPending}
              variant={validationAction === 'approve' ? 'default' : 'destructive'}
            >
              {(validateUser.isPending || validateBatch.isPending) ? (
                <>Procesando...</>
              ) : (
                <>
                  {validationAction === 'approve' ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprobar
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Rechazar
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}