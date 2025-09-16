'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useCreateUser, useAvailableAffiliates } from '@/hooks/admin/useUsers';
import { ArrowLeft, Eye, EyeOff, UserPlus, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'agent', 'editor', 'client']),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  balance: z.string().optional(),
  // Campos de afiliado
  affiliateId: z.string().optional(),
  affiliateCode: z.string().optional(),
  assignToDirectTable: z.boolean().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'agent' | 'editor' | 'client'>('client');
  const [useDirectTable, setUseDirectTable] = useState(false);
  
  const createUser = useCreateUser();
  const { data: affiliatesData, isLoading: loadingAffiliates } = useAvailableAffiliates();
  const availableAffiliates = affiliatesData?.affiliates || [];

  // Transformar los datos para compatibilidad
  const transformedAffiliates = availableAffiliates.map((affiliate: any) => ({
    id: affiliate.id,
    username: affiliate.username,
    displayName: affiliate.profile_data?.firstName && affiliate.profile_data?.lastName 
      ? `${affiliate.profile_data.firstName} ${affiliate.profile_data.lastName}`
      : affiliate.username,
    affiliateCode: affiliate.affiliateProfile?.affiliate_code || 'N/A',
    customUrl: affiliate.affiliateProfile?.custom_url
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'client',
      balance: '0',
      assignToDirectTable: false,
    },
  });

  const watchedRole = watch('role');
  const watchedAffiliateId = watch('affiliateId');
  const watchedAffiliateCode = watch('affiliateCode');

  useEffect(() => {
    setSelectedRole(watchedRole);
  }, [watchedRole]);

  // Si es agente, se crea automáticamente su perfil de afiliado
  const isCreatingAgent = selectedRole === 'agent';
  
  // Solo los clientes necesitan asignación a agente (opcional)
  const needsAffiliateAssignment = selectedRole === 'client';

  const onSubmit = (data: CreateUserFormData) => {
    // Preparar datos según el rol y configuración
    const submitData = {
      ...data,
      balance: parseFloat(data.balance || '0'),
      // Solo incluir datos de afiliado para clientes
      ...(needsAffiliateAssignment && !useDirectTable && {
        affiliateId: data.affiliateId,
        affiliateCode: data.affiliateCode,
      }),
    };

    createUser.mutate(submitData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Usuario</h1>
          <p className="text-muted-foreground">
            Registra un nuevo usuario en el sistema
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Cuenta</CardTitle>
              <CardDescription>
                Datos de acceso al sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    {...register('username')}
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      {...register('password')}
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol *</Label>
                  <Select
                    defaultValue="client"
                    onValueChange={(value) => setValue('role', value as any)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <span>Administrador</span>
                          <Badge variant="destructive" className="text-xs">Admin</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="agent">
                        <div className="flex items-center gap-2">
                          <span>Agente</span>
                          <Badge variant="default" className="text-xs">Afiliado</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex items-center gap-2">
                          <span>Editor</span>
                          <Badge variant="secondary" className="text-xs">Contenido</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="client">
                        <div className="flex items-center gap-2">
                          <span>Cliente</span>
                          <Badge variant="outline" className="text-xs">Usuario</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Datos personales del usuario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (Opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    {...register('phone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">Balance Inicial</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      S/
                    </span>
                    <Input
                      id="balance"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('balance')}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Assignment (only for clients) */}
          {needsAffiliateAssignment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Asignación de Agente
                </CardTitle>
                <CardDescription>
                  Configura si el cliente será asignado a un agente o irá a la tabla directa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="direct-table">Tabla Directa</Label>
                    <p className="text-sm text-muted-foreground">
                      El cliente no será asignado a ningún agente
                    </p>
                  </div>
                  <Switch
                    id="direct-table"
                    checked={useDirectTable}
                    onCheckedChange={(checked) => {
                      setUseDirectTable(checked);
                      if (checked) {
                        setValue('affiliateId', '');
                        setValue('affiliateCode', '');
                      }
                    }}
                  />
                </div>

                {!useDirectTable && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Puedes asignar un agente seleccionándolo de la lista o ingresando su código de afiliado.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="affiliateId">Seleccionar Agente</Label>
                        <Select
                          value={watchedAffiliateId || ''}
                          onValueChange={(value) => {
                            setValue('affiliateId', value);
                            if (value) setValue('affiliateCode', '');
                          }}
                          disabled={loadingAffiliates}
                        >
                          <SelectTrigger id="affiliateId">
                            <SelectValue placeholder={loadingAffiliates ? "Cargando..." : "Seleccionar agente"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Sin agente asignado</SelectItem>
                            {transformedAffiliates.map((affiliate) => (
                              <SelectItem key={affiliate.id} value={affiliate.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{affiliate.displayName || affiliate.username}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {affiliate.affiliateCode}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="affiliateCode">O Código de Afiliado</Label>
                        <Input
                          id="affiliateCode"
                          placeholder="INKAS1234"
                          {...register('affiliateCode')}
                          disabled={!!watchedAffiliateId}
                          onChange={(e) => {
                            setValue('affiliateCode', e.target.value);
                            if (e.target.value) setValue('affiliateId', '');
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Deja vacío para no asignar agente
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Agent Information */}
          {isCreatingAgent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Perfil de Agente</CardTitle>
                <CardDescription>
                  Se creará automáticamente un perfil de afiliado para este usuario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Información importante:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Se generará automáticamente un código de afiliado único</li>
                      <li>La tasa de comisión inicial será del 10%</li>
                      <li>Podrá gestionar sus propios clientes y códigos de afiliado</li>
                      <li>Aparecerá en la lista de agentes disponibles para nuevos registros</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/users">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? (
                <>Creando...</>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}