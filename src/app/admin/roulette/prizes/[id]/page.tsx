'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminPrize, useUpdatePrize, useAdminPrizes } from '@/hooks/admin/useRoulette';
import { ArrowLeft, Save, Gamepad2, Info, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const updatePrizeSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  prize_type: z.enum(['cash', 'bonus', 'points', 'spin', 'special']),
  prize_behavior: z.enum(['instant_cash', 'bonus', 'manual', 'custom']),
  prize_value: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
  probability: z.number().min(0.1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color hexadecimal inválido'),
  icon: z.string().optional(),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  isActive: z.boolean(),
});

type UpdatePrizeFormData = z.infer<typeof updatePrizeSchema>;

const PRIZE_TYPES = [
  { value: 'cash', label: 'Dinero en efectivo', icon: '💰' },
  { value: 'bonus', label: 'Bonificación', icon: '🎁' },
  { value: 'points', label: 'Puntos', icon: '⭐' },
  { value: 'spin', label: 'Giro extra', icon: '🎯' },
  { value: 'special', label: 'Especial', icon: '🎪' },
];

const PRIZE_BEHAVIORS = [
  { value: 'instant_cash', label: 'Efectivo instantáneo', description: 'Se acredita automáticamente al balance' },
  { value: 'bonus', label: 'Bonificación', description: 'Se crea un bono que debe ser reclamado' },
  { value: 'manual', label: 'Manual', description: 'Requiere validación administrativa' },
  { value: 'custom', label: 'Personalizado', description: 'Comportamiento especial definido' },
];

const PRESET_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Turquoise
  '#95E1D3', // Mint
  '#C7CEEA', // Lavender
  '#A8E6CF', // Light green
  '#FECA57', // Yellow
  '#DDA0DD', // Plum
];

export default function EditPrizePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [probability, setProbability] = useState(5);
  const [showProbabilityWarning, setShowProbabilityWarning] = useState(false);
  const [originalProbability, setOriginalProbability] = useState(0);
  
  const { data: prizeData, isLoading } = useAdminPrize(params.id);
  const { data: allPrizesData } = useAdminPrizes();
  const updatePrize = useUpdatePrize();

  const allPrizes = allPrizesData?.prizes || [];
  const activePrizes = allPrizes.filter((p: any) => p.isActive && p.id !== params.id);
  const currentTotalProbability = activePrizes.reduce((sum: number, p: any) => sum + p.probability, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdatePrizeFormData>({
    resolver: zodResolver(updatePrizeSchema),
  });

  const selectedType = watch('prize_type');
  const selectedColor = watch('color');
  const isActive = watch('isActive');

  // Cargar datos del premio cuando estén disponibles
  useEffect(() => {
    if (prizeData?.prize) {
      const prize = prizeData.prize;
      reset({
        name: prize.name,
        description: prize.description || '',
        prize_type: prize.prize_type,
        prize_behavior: prize.prize_behavior,
        prize_value: prize.prize_value,
        probability: prize.probability,
        color: prize.color,
        icon: prize.icon || '',
        min_value: prize.min_value,
        max_value: prize.max_value,
        isActive: prize.isActive,
      });
      setProbability(prize.probability);
      setOriginalProbability(prize.probability);
    }
  }, [prizeData, reset]);

  // Verificar probabilidad cuando cambia
  useEffect(() => {
    if (isActive) {
      const newTotal = currentTotalProbability + probability;
      setShowProbabilityWarning(newTotal > 100 || Math.abs(newTotal - 100) > 0.01);
    } else {
      setShowProbabilityWarning(false);
    }
  }, [probability, currentTotalProbability, isActive]);

  const onSubmit = (data: UpdatePrizeFormData) => {
    // Solo validar si el premio está activo
    if (data.isActive) {
      const newTotal = currentTotalProbability + data.probability;
      
      if (newTotal > 100) {
        toast.error(
          `La suma de probabilidades sería ${newTotal.toFixed(2)}%. El máximo permitido es 100%.`,
          {
            description: `Actualmente hay ${currentTotalProbability.toFixed(2)}% asignado en otros premios.`,
            duration: 5000,
          }
        );
        return;
      }
      
      // Advertencia si no suma 100%
      if (Math.abs(newTotal - 100) > 0.01) {
        toast.warning(
          `La suma total será ${newTotal.toFixed(2)}%`,
          {
            description: 'Recuerda ajustar las probabilidades para que sumen exactamente 100%.',
            duration: 5000,
          }
        );
      }
    }
    
    updatePrize.mutate({ id: params.id, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando premio...</p>
        </div>
      </div>
    );
  }

  if (!prizeData?.prize) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Premio no encontrado</p>
        <Button className="mt-4" asChild>
          <Link href="/admin/roulette/prizes">Volver a premios</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/roulette/prizes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Premio</h1>
          <p className="text-muted-foreground">
            Modifica la configuración del premio
          </p>
        </div>
      </div>

      {/* Alerta de probabilidades */}
      {isActive && currentTotalProbability > 0 && (
        <Alert className={showProbabilityWarning ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : ''}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">
                Probabilidad total de otros premios activos: {currentTotalProbability.toFixed(2)}%
              </p>
              <p className="text-sm">
                {100 - currentTotalProbability > 0 
                  ? `Puedes asignar hasta ${(100 - currentTotalProbability).toFixed(2)}% a este premio.`
                  : 'Ya tienes el 100% asignado en otros premios. Deberás reducir otras probabilidades primero.'
                }
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* Estado del premio */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Premio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Premio activo</Label>
                  <p className="text-sm text-muted-foreground">
                    Los premios inactivos no aparecen en la ruleta
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="h-5 w-5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Premio</CardTitle>
              <CardDescription>
                Define los detalles básicos del premio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del premio *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Gran Premio S/ 100"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icono (emoji)</Label>
                  <Input
                    id="icon"
                    placeholder="Ej: 💰"
                    {...register('icon')}
                    maxLength={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    Un emoji para representar el premio
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción opcional del premio..."
                  {...register('description')}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configuración del premio */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Premio</CardTitle>
              <CardDescription>
                Define el tipo y comportamiento del premio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prize_type">Tipo de premio *</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) => setValue('prize_type', value as any)}
                  >
                    <SelectTrigger id="prize_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIZE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.prize_type && (
                    <p className="text-sm text-red-500">{errors.prize_type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prize_value">
                    Valor del premio *
                    {selectedType === 'bonus' && ' (%)'}
                    {selectedType === 'cash' && ' (S/)'}
                    {selectedType === 'points' && ' (pts)'}
                  </Label>
                  <Input
                    id="prize_value"
                    type="number"
                    step={selectedType === 'cash' ? '0.01' : '1'}
                    placeholder="0"
                    {...register('prize_value', { valueAsNumber: true })}
                    className={errors.prize_value ? 'border-red-500' : ''}
                  />
                  {errors.prize_value && (
                    <p className="text-sm text-red-500">{errors.prize_value.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prize_behavior">Comportamiento *</Label>
                <Select
                  value={watch('prize_behavior')}
                  onValueChange={(value) => setValue('prize_behavior', value as any)}
                >
                  <SelectTrigger id="prize_behavior">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIZE_BEHAVIORS.map((behavior) => (
                      <SelectItem key={behavior.value} value={behavior.value}>
                        <div>
                          <div className="font-medium">{behavior.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {behavior.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Valores mínimos y máximos (opcional) */}
              {selectedType === 'cash' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_value">Valor mínimo (opcional)</Label>
                    <Input
                      id="min_value"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...register('min_value', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_value">Valor máximo (opcional)</Label>
                    <Input
                      id="max_value"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...register('max_value', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Probabilidad y color */}
          <Card>
            <CardHeader>
              <CardTitle>Probabilidad y Apariencia</CardTitle>
              <CardDescription>
                Define la probabilidad de ganar este premio y su color
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="probability">Probabilidad de ganar</Label>
                  <span className="text-2xl font-bold text-primary">{probability}%</span>
                </div>
                <Slider
                  id="probability"
                  min={0.1}
                  max={isActive ? Math.min(50, 100 - currentTotalProbability + 0.1) : 50}
                  step={0.1}
                  value={[probability]}
                  onValueChange={(value) => {
                    setProbability(value[0]);
                    setValue('probability', value[0]);
                  }}
                  className="w-full"
                  disabled={!isActive}
                />
                {isActive ? (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.1%</span>
                    <span>Máximo: {(100 - currentTotalProbability).toFixed(1)}%</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Activa el premio para ajustar la probabilidad
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color del premio</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setValue('color', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setValue('color', e.target.value)}
                    placeholder="#FFD700"
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información importante */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Info className="h-5 w-5" />
                Información Importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li>• La suma de todas las probabilidades activas debe ser exactamente 100%</li>
                <li>• Los cambios se aplicarán inmediatamente después de guardar</li>
                <li>• Si cambias el tipo de premio, verifica el comportamiento</li>
                <li>• Desactivar un premio no lo elimina, solo lo oculta de la ruleta</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/roulette/prizes">Cancelar</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={
                updatePrize.isPending ||
                (isActive && currentTotalProbability + probability > 100)
              }
            >
              {updatePrize.isPending ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}