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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useCreatePrize } from '@/hooks/admin/useRoulette';
import { ArrowLeft, Plus, Gamepad2, Info } from 'lucide-react';

const createPrizeSchema = z.object({
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
});

type CreatePrizeFormData = z.infer<typeof createPrizeSchema>;

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

export default function CreatePrizePage() {
  const [probability, setProbability] = useState(5);
  const createPrize = useCreatePrize();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreatePrizeFormData>({
    resolver: zodResolver(createPrizeSchema),
    defaultValues: {
      prize_type: 'cash',
      prize_behavior: 'instant_cash',
      probability: 5,
      color: '#FFD700',
    },
  });

  const selectedType = watch('prize_type');
  const selectedColor = watch('color');

  const onSubmit = (data: CreatePrizeFormData) => {
    createPrize.mutate(data);
  };

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
          <h1 className="text-3xl font-bold">Crear Premio</h1>
          <p className="text-muted-foreground">
            Configura un nuevo premio para la ruleta
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
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
                  defaultValue="instant_cash"
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
                  max={50}
                  step={0.1}
                  value={[probability]}
                  onValueChange={(value) => {
                    setProbability(value[0]);
                    setValue('probability', value[0]);
                  }}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Define qué tan probable es que salga este premio
                </p>
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
                <li>• Los premios de tipo "efectivo instantáneo" se acreditan automáticamente</li>
                <li>• Los premios manuales requieren validación por un administrador</li>
                <li>• El color se muestra en la ruleta visual</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/roulette/prizes">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={createPrize.isPending}>
              {createPrize.isPending ? (
                <>Creando...</>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Premio
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}