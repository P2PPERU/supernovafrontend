// src/app/admin/clubs/create/page.tsx - Corregido
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCreateClub } from '@/hooks/useClubs';
import { ArrowLeft, Plus, X, Upload, Building2, Globe, Users, Clock, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateClubData } from '@/types/club.types';
import { toast } from 'sonner';

const createClubSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  shortDescription: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  contactEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  features: z.array(z.string()),
  gameTypes: z.array(z.string()),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  order: z.number(),
  // Location
  locationCountry: z.string().optional(),
  locationCity: z.string().optional(),
  locationAddress: z.string().optional(),
  // Requirements
  minAge: z.number().min(18),
  verificationRequired: z.boolean(),
  minDeposit: z.number().min(0).optional(),
  // Schedule
  timeZone: z.string().optional(),
  openHours: z.string().optional(),
  tournamentDays: z.array(z.string()),
  // Social Links
  facebook: z.string().url('URL inválida').optional().or(z.literal('')),
  twitter: z.string().url('URL inválida').optional().or(z.literal('')),
  instagram: z.string().url('URL inválida').optional().or(z.literal('')),
  telegram: z.string().optional(),
  discord: z.string().optional(),
});

type CreateClubFormFields = z.infer<typeof createClubSchema>;

const gameTypeOptions = [
  'Texas Hold\'em',
  'Omaha',
  'Seven Card Stud',
  'Mixed Games',
  'Tournaments',
  'Cash Games',
  'Sit & Go',
  'Spin & Go'
];

const featureOptions = [
  'Rakeback Alto',
  'Bonos de Bienvenida',
  'Freerolls Diarios',
  'Soporte 24/7',
  'App Móvil',
  'Torneos VIP',
  'Programa de Lealtad',
  'Streaming de Mesas'
];

const dayOptions = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

export default function CreateClubPage() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createClub = useCreateClub();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateClubFormFields>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      features: [],
      gameTypes: [],
      tournamentDays: [],
      isActive: true,
      isFeatured: false,
      order: 0,
      minAge: 18,
      verificationRequired: true,
    },
  });

  const watchedFeatures = watch('features') || [];
  const watchedGameTypes = watch('gameTypes') || [];
  const watchedTournamentDays = watch('tournamentDays') || [];

  const validateImage = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 5MB.');
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Solo JPEG, PNG y WebP.');
      return false;
    }
    
    return true;
  };

  const handleImageUpload = (file: File, type: 'logo' | 'banner') => {
    if (!file || !validateImage(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(result);
      } else {
        setBannerFile(file);
        setBannerPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleArrayItem = (array: string[], item: string, setValue: Function, fieldName: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setValue(fieldName, newArray);
  };

  const onSubmit: SubmitHandler<CreateClubFormFields> = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('📝 Submitting club data:', data);
      
      // Construir los datos del club
      const clubData: CreateClubData = {
        name: data.name.trim(),
        description: data.description.trim(),
        shortDescription: data.shortDescription?.trim() || undefined,
        website: data.website || undefined,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone?.trim() || undefined,
        features: data.features || [],
        gameTypes: data.gameTypes || [],
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        order: data.order || 0,
        
        // Location
        location: (data.locationCountry || data.locationCity || data.locationAddress) ? {
          country: data.locationCountry || '',
          city: data.locationCity || undefined,
          address: data.locationAddress || undefined,
        } : undefined,
        
        // Requirements
        requirements: {
          minAge: data.minAge,
          verificationRequired: data.verificationRequired,
          minDeposit: data.minDeposit || undefined,
        },
        
        // Schedule
        schedule: (data.timeZone || data.openHours || data.tournamentDays.length > 0) ? {
          timeZone: data.timeZone || '',
          openHours: data.openHours || '',
          tournamentDays: data.tournamentDays || [],
        } : undefined,
        
        // Social Links
        socialLinks: (data.facebook || data.twitter || data.instagram || data.telegram || data.discord) ? {
          facebook: data.facebook || undefined,
          twitter: data.twitter || undefined,
          instagram: data.instagram || undefined,
          telegram: data.telegram || undefined,
          discord: data.discord || undefined,
        } : undefined,
        
        // Files
        logo: logoFile || undefined,
        banner: bannerFile || undefined,

      };

      console.log('🏗️ Final club data structure:', clubData);
      
      await createClub.mutateAsync(clubData);
      
    } catch (error: any) {
      console.error('❌ Error submitting club:', error);
      toast.error(error.message || 'Error al crear el club');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/clubs">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Club</h1>
          <p className="text-muted-foreground">
            Registra un nuevo club de poker
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información Básica
            </CardTitle>
            <CardDescription>
              Datos principales del club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Club *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Poker Palace Lima"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descripción Corta</Label>
                <Input
                  id="shortDescription"
                  placeholder="Descripción breve para listados (opcional)"
                  {...register('shortDescription')}
                />
                <p className="text-xs text-muted-foreground">
                  Se mostrará en las tarjetas de clubs
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción Completa *</Label>
              <Textarea
                id="description"
                placeholder="Descripción detallada del club, servicios, características especiales..."
                rows={4}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logo del Club</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {logoPreview ? (
                    <div className="space-y-2">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="mx-auto h-20 w-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview('');
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div>
                        <Button type="button" variant="outline" size="sm" asChild>
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            Subir Logo
                          </label>
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'logo');
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG o WebP. Máx 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Banner del Club</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {bannerPreview ? (
                    <div className="space-y-2">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="mx-auto h-20 w-full object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBannerFile(null);
                          setBannerPreview('');
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div>
                        <Button type="button" variant="outline" size="sm" asChild>
                          <label htmlFor="banner-upload" className="cursor-pointer">
                            Subir Banner
                          </label>
                        </Button>
                        <input
                          id="banner-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'banner');
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Imagen horizontal. JPEG, PNG o WebP. Máx 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://ejemplo.com"
                  {...register('website')}
                />
                {errors.website && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.website.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contacto</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contacto@club.com"
                  {...register('contactEmail')}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
              <Input
                id="contactPhone"
                placeholder="+51 999 999 999"
                {...register('contactPhone')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Características y Juegos */}
        <Card>
          <CardHeader>
            <CardTitle>Características y Tipos de Juego</CardTitle>
            <CardDescription>
              Selecciona las características y tipos de juego que ofrece el club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              <Label>Características</Label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((feature) => (
                  <Badge
                    key={feature}
                    variant={watchedFeatures.includes(feature) ? 'default' : 'outline'}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleArrayItem(watchedFeatures, feature, setValue, 'features')}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selecciona las características que mejor describan el club
              </p>
            </div>

            {/* Game Types */}
            <div className="space-y-3">
              <Label>Tipos de Juego</Label>
              <div className="flex flex-wrap gap-2">
                {gameTypeOptions.map((gameType) => (
                  <Badge
                    key={gameType}
                    variant={watchedGameTypes.includes(gameType) ? 'default' : 'outline'}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleArrayItem(watchedGameTypes, gameType, setValue, 'gameTypes')}
                  >
                    {gameType}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Indica qué tipos de juegos de poker se ofrecen
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
            <CardDescription>
              Información geográfica del club (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationCountry">País</Label>
                <Input
                  id="locationCountry"
                  placeholder="Perú"
                  {...register('locationCountry')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationCity">Ciudad</Label>
                <Input
                  id="locationCity"
                  placeholder="Lima"
                  {...register('locationCity')}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="locationAddress">Dirección</Label>
              <Input
                id="locationAddress"
                placeholder="Dirección completa (opcional)"
                {...register('locationAddress')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Requisitos */}
        <Card>
          <CardHeader>
            <CardTitle>Requisitos de Membresía</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAge">Edad Mínima *</Label>
                <Input
                  id="minAge"
                  type="number"
                  min="18"
                  max="21"
                  {...register('minAge', { valueAsNumber: true })}
                />
                {errors.minAge && (
                  <p className="text-sm text-red-500">{errors.minAge.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minDeposit">Depósito Mínimo (S/)</Label>
                <Input
                  id="minDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register('minDeposit', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="verificationRequired">Verificación Requerida</Label>
                <p className="text-sm text-muted-foreground">
                  ¿Se requiere verificación de identidad?
                </p>
              </div>
              <Switch
                id="verificationRequired"
                {...register('verificationRequired')}
                checked={watch('verificationRequired')}
                onCheckedChange={(checked) => setValue('verificationRequired', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios y Programación
            </CardTitle>
            <CardDescription>
              Información sobre horarios de operación (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeZone">Zona Horaria</Label>
                <Input
                  id="timeZone"
                  placeholder="America/Lima"
                  {...register('timeZone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openHours">Horario de Atención</Label>
                <Input
                  id="openHours"
                  placeholder="24/7 o Lun-Dom 9:00-23:00"
                  {...register('openHours')}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Días de Torneos</Label>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map((day) => (
                  <Badge
                    key={day}
                    variant={watchedTournamentDays.includes(day) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem(watchedTournamentDays, day, setValue, 'tournamentDays')}
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
            <CardDescription>
              Enlaces a redes sociales del club (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  type="url"
                  placeholder="https://facebook.com/club"
                  {...register('facebook')}
                />
                {errors.facebook && (
                  <p className="text-sm text-red-500">{errors.facebook.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/club"
                  {...register('twitter')}
                />
                {errors.twitter && (
                  <p className="text-sm text-red-500">{errors.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="https://instagram.com/club"
                  {...register('instagram')}
                />
                {errors.instagram && (
                  <p className="text-sm text-red-500">{errors.instagram.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  placeholder="@club_telegram"
                  {...register('telegram')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discord">Discord</Label>
              <Input
                id="discord"
                placeholder="Servidor de Discord"
                {...register('discord')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Publicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive">Club Activo</Label>
                <p className="text-sm text-muted-foreground">
                  Si está activo, será visible para los usuarios
                </p>
              </div>
              <Switch
                id="isActive"
                {...register('isActive')}
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Club Destacado</Label>
                <p className="text-sm text-muted-foreground">
                  Aparecerá en la sección de clubs destacados
                </p>
              </div>
              <Switch
                id="isFeatured"
                {...register('isFeatured')}
                checked={watch('isFeatured')}
                onCheckedChange={(checked) => setValue('isFeatured', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Orden de Visualización</Label>
              <Input
                id="order"
                type="number"
                min="0"
                placeholder="0"
                {...register('order', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                Número menor = mayor prioridad en listados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <Button variant="outline" asChild disabled={isSubmitting}>
            <Link href="/admin/clubs">Cancelar</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || createClub.isPending}
            className="min-w-[120px]"
          >
            {isSubmitting || createClub.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Creando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Crear Club
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}