'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useRegister, useAvailableAffiliates } from '@/hooks/useAuth';
import { Eye, EyeOff, UserPlus, AlertCircle, Info, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  // Campos de afiliado
  affiliateId: z.string().optional(),
  affiliateCode: z.string().optional(),
  directTable: z.boolean(),
  terms: z.boolean().refine(val => val === true, 'Debes aceptar los términos y condiciones'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Use the same interface as in your service
interface AvailableAffiliate {
  id: string;
  username: string;
  displayName: string;
  affiliateCode: string;
  customUrl?: string;
}

// Response type that matches your service
interface AffiliatesResponse {
  success: boolean;
  affiliates: AvailableAffiliate[];
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  
  const register = useRegister();
  const { data: affiliatesData, isLoading: loadingAffiliates } = useAvailableAffiliates();
  
  // Safe type casting with proper fallback
  const availableAffiliates: AvailableAffiliate[] = 
    (affiliatesData as AffiliatesResponse)?.affiliates || [];

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      affiliateId: '',
      affiliateCode: '',
      directTable: false,
      terms: false,
    },
    mode: 'onChange',
  });

  const watchedAffiliateId = watch('affiliateId');
  const watchedAffiliateCode = watch('affiliateCode');
  const watchedDirectTable = watch('directTable');
  const watchedTerms = watch('terms');

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['username', 'email', 'password', 'confirmPassword'];
    } else if (step === 2) {
      fieldsToValidate = ['firstName', 'lastName'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = handleSubmit(async (data: RegisterFormData) => {
    try {
      const submitData = {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        // Solo incluir datos de afiliado si no va a tabla directa
        ...((!data.directTable && data.affiliateId) && { affiliateId: data.affiliateId }),
        ...((!data.directTable && data.affiliateCode) && { affiliateCode: data.affiliateCode }),
        directTable: data.directTable,
      };

      await register.mutateAsync(submitData);
    } catch (error) {
      console.error('Error en registro:', error);
    }
  });

  const selectedAffiliate = availableAffiliates.find((a: AvailableAffiliate) => a.id === watchedAffiliateId);

  const handleDirectTableChange = (checked: boolean) => {
    setValue('directTable', checked);
    if (checked) {
      setValue('affiliateId', '');
      setValue('affiliateCode', '');
    }
  };

  const handleAffiliateSelect = (value: string) => {
    setValue('affiliateId', value);
    if (value) {
      setValue('affiliateCode', '');
    }
  };

  const handleAffiliateCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('affiliateCode', value);
    if (value) {
      setValue('affiliateId', '');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Únete a SUPERNOVA
            </CardTitle>
            <CardDescription className="text-lg">
              Los mejores acuerdos de poker te están esperando
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2 pt-4">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step >= num ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} noValidate>
              {/* Step 1: Account Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold">Información de Cuenta</h3>
                    <p className="text-muted-foreground">Crea tus credenciales de acceso</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      {...registerField('username')}
                      className={errors.username ? 'border-red-500' : ''}
                      aria-invalid={!!errors.username}
                      aria-describedby={errors.username ? 'username-error' : undefined}
                    />
                    {errors.username && (
                      <p id="username-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...registerField('email')}
                      className={errors.email ? 'border-red-500' : ''}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 6 caracteres"
                          {...registerField('password')}
                          className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                          aria-invalid={!!errors.password}
                          aria-describedby={errors.password ? 'password-error' : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p id="password-error" className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repetir contraseña"
                          {...registerField('confirmPassword')}
                          className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                          aria-invalid={!!errors.confirmPassword}
                          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                          aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p id="confirm-password-error" className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={nextStep} disabled={register.isPending}>
                      Siguiente
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold">Información Personal</h3>
                    <p className="text-muted-foreground">Completa tu perfil</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        {...registerField('firstName')}
                        className={errors.firstName ? 'border-red-500' : ''}
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? 'firstname-error' : undefined}
                      />
                      {errors.firstName && (
                        <p id="firstname-error" className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        {...registerField('lastName')}
                        className={errors.lastName ? 'border-red-500' : ''}
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? 'lastname-error' : undefined}
                      />
                      {errors.lastName && (
                        <p id="lastname-error" className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (Opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 999 999 999"
                      {...registerField('phone')}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Anterior
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={register.isPending}>
                      Siguiente
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Affiliate Selection */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold">Selección de Agente</h3>
                    <p className="text-muted-foreground">
                      Elige cómo quieres comenzar tu experiencia
                    </p>
                  </div>

                  {/* Opción de tabla directa */}
                  <Card className={`cursor-pointer transition-all ${watchedDirectTable ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">Tabla Directa</h4>
                          <p className="text-sm text-muted-foreground">
                            Juega directamente sin agente asignado
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Acceso inmediato
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Sin comisiones
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={watchedDirectTable}
                          onCheckedChange={handleDirectTableChange}
                          {...registerField('directTable')}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {!watchedDirectTable && (
                    <div className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Los agentes te brindan soporte personalizado, bonos exclusivos y mejores oportunidades de juego.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="affiliateSelect">Seleccionar Agente</Label>
                          <Select
                            value={watchedAffiliateId || ''}
                            onValueChange={handleAffiliateSelect}
                            disabled={loadingAffiliates}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={loadingAffiliates ? "Cargando agentes..." : "Selecciona un agente"} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableAffiliates.map((affiliate: AvailableAffiliate) => (
                                <SelectItem key={affiliate.id} value={affiliate.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <div>
                                      <p className="font-medium">{affiliate.displayName || affiliate.username}</p>
                                      <p className="text-xs text-muted-foreground">@{affiliate.username}</p>
                                    </div>
                                    <Badge variant="outline" className="ml-3">
                                      {affiliate.affiliateCode}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">O</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="affiliateCode">Código de Agente</Label>
                          <Input
                            id="affiliateCode"
                            placeholder="Ingresa el código de tu agente"
                            {...registerField('affiliateCode')}
                            disabled={!!watchedAffiliateId}
                            onChange={handleAffiliateCodeChange}
                          />
                          <p className="text-xs text-muted-foreground">
                            Si tienes un código de agente específico, ingrésalo aquí
                          </p>
                        </div>

                        {selectedAffiliate && (
                          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {selectedAffiliate.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                                    {selectedAffiliate.displayName || selectedAffiliate.username}
                                  </h4>
                                  <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Código: {selectedAffiliate.affiliateCode}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error de registro */}
                  {register.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {register.error.message || 'Error al crear la cuenta. Inténtalo de nuevo.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Términos y condiciones */}
                  <div className="space-y-4">
                    <Separator />
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={watchedTerms}
                        onCheckedChange={(checked) => setValue('terms', !!checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm leading-5 cursor-pointer">
                        Acepto los{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          política de privacidad
                        </Link>
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.terms.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Anterior
                    </Button>
                    <Button type="submit" disabled={register.isPending || !watchedTerms}>
                      {register.isPending ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                          Registrando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Crear Cuenta
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}