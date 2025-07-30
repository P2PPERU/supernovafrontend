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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreatePrize, useAdminPrizes } from '@/hooks/admin/useRoulette';
import { ArrowLeft, Plus, Gamepad2, Info, Wand2, Save, Eye, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const createPrizeSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  prize_type: z.enum(['cash', 'bonus', 'points', 'spin', 'special']),
  prize_behavior: z.enum(['instant_cash', 'bonus', 'manual', 'custom']),
  prize_value: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
  probability: z.number().min(0.1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color hexadecimal inválido'),
  position: z.number().min(1).max(20),
  icon: z.string().optional(),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  custom_config: z.object({
    auto_apply: z.boolean().optional(),
    bonus_name: z.string().optional(),
    bonus_type: z.string().optional(),
    percentage: z.number().optional(),
    min_deposit: z.number().optional(),
    validity_days: z.number().optional(),
  }).optional(),
});

type CreatePrizeFormData = z.infer<typeof createPrizeSchema>;

const PRIZE_TYPES = [
  { value: 'cash', label: 'Dinero en efectivo', icon: '💰', description: 'Premio en efectivo directo' },
  { value: 'bonus', label: 'Bonificación', icon: '🎁', description: 'Bono que requiere depósito' },
  { value: 'points', label: 'Puntos', icon: '⭐', description: 'Puntos del programa de lealtad' },
  { value: 'spin', label: 'Giro extra', icon: '🎯', description: 'Giro adicional en la ruleta' },
  { value: 'special', label: 'Especial', icon: '🎪', description: 'Premio personalizado' },
];

const PRIZE_BEHAVIORS = [
  { 
    value: 'instant_cash', 
    label: 'Efectivo instantáneo', 
    description: 'Se acredita automáticamente al balance',
    compatibleTypes: ['cash', 'points']
  },
  { 
    value: 'bonus', 
    label: 'Bonificación', 
    description: 'Se crea un bono que debe ser reclamado',
    compatibleTypes: ['bonus', 'cash']
  },
  { 
    value: 'manual', 
    label: 'Manual', 
    description: 'Requiere validación administrativa',
    compatibleTypes: ['cash', 'special', 'bonus']
  },
  { 
    value: 'custom', 
    label: 'Personalizado', 
    description: 'Comportamiento especial definido',
    compatibleTypes: ['special', 'spin']
  },
];

const PRESET_COLORS = [
  { name: 'Oro', value: '#FFD700' },
  { name: 'Rojo', value: '#FF6B6B' },
  { name: 'Turquesa', value: '#4ECDC4' },
  { name: 'Menta', value: '#95E1D3' },
  { name: 'Lavanda', value: '#C7CEEA' },
  { name: 'Verde claro', value: '#A8E6CF' },
  { name: 'Amarillo', value: '#FECA57' },
  { name: 'Ciruela', value: '#DDA0DD' },
  { name: 'Naranja', value: '#FFA500' },
  { name: 'Rosa', value: '#FFB6C1' },
  { name: 'Azul', value: '#87CEEB' },
  { name: 'Verde oscuro', value: '#228B22' },
];

const EMOJI_SUGGESTIONS = [
  '💰', '💵', '💸', '🤑', '💎', '🎁', '🎉', '🎊', '🏆', '🥇',
  '⭐', '🌟', '✨', '🎯', '🎲', '🎰', '🍀', '🔥', '💫', '🌈',
  '👑', '💍', '🎪', '🎭', '🎨', '🎮', '🕹️', '🏅', '🥈', '🥉'
];

export default function CreatePrizePage() {
  const [probability, setProbability] = useState(5);
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [previewMode, setPreviewMode] = useState(false);
  const [showProbabilityWarning, setShowProbabilityWarning] = useState(false);
  const createPrize = useCreatePrize();
  const { data: existingPrizesData } = useAdminPrizes();

  const existingPrizes = existingPrizesData?.prizes || [];
  const activePrizes = existingPrizes.filter((p: any) => p.isActive);
  const currentTotalProbability = activePrizes.reduce((sum: number, p: any) => sum + p.probability, 0);
  
  const existingPositions = existingPrizes.map((p: any) => p.position);
  const availablePositions = Array.from({ length: 20 }, (_, i) => i + 1)
    .filter(pos => !existingPositions.includes(pos));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreatePrizeFormData>({
    resolver: zodResolver(createPrizeSchema),
    defaultValues: {
      prize_type: 'cash',
      prize_behavior: 'instant_cash',
      probability: 5,
      color: '#FFD700',
      position: availablePositions[0] || 1,
      custom_config: {
        auto_apply: true,
        validity_days: 30,
      }
    },
  });

  const selectedType = watch('prize_type');
  const selectedBehavior = watch('prize_behavior');
  const selectedIcon = watch('icon');
  const formValues = watch();

  // Verificar probabilidad cuando cambia
  useEffect(() => {
    const newTotal = currentTotalProbability + probability;
    setShowProbabilityWarning(newTotal > 100 || Math.abs(newTotal - 100) > 0.01);
  }, [probability, currentTotalProbability]);

  // Filtrar comportamientos compatibles con el tipo seleccionado
  const compatibleBehaviors = PRIZE_BEHAVIORS.filter(
    behavior => behavior.compatibleTypes.includes(selectedType)
  );

  const onSubmit = (data: CreatePrizeFormData) => {
    // Validar suma de probabilidades
    const newTotal = currentTotalProbability + data.probability;
    
    if (newTotal > 100) {
      toast.error(
        `La suma de probabilidades sería ${newTotal.toFixed(2)}%. El máximo permitido es 100%.`,
        {
          description: `Actualmente hay ${currentTotalProbability.toFixed(2)}% asignado. Puedes agregar máximo ${(100 - currentTotalProbability).toFixed(2)}%.`,
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
    
    // Limpiar configuración personalizada si no es necesaria
    if (data.prize_behavior !== 'custom' && data.prize_behavior !== 'bonus') {
      delete data.custom_config;
    }
    
    createPrize.mutate(data);
  };

  const handlePresetColor = (color: string) => {
    setSelectedColor(color);
    setValue('color', color);
  };

  const handleEmojiSelect = (emoji: string) => {
    setValue('icon', emoji);
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

      {/* Alerta de probabilidades */}
      {currentTotalProbability > 0 && (
        <Alert className={showProbabilityWarning ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : ''}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">
                Probabilidad actual total: {currentTotalProbability.toFixed(2)}%
              </p>
              <p className="text-sm">
                {100 - currentTotalProbability > 0 
                  ? `Puedes asignar hasta ${(100 - currentTotalProbability).toFixed(2)}% más.`
                  : 'Ya tienes el 100% asignado. Deberás reducir otras probabilidades primero.'
                }
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="config">Configuración</TabsTrigger>
              <TabsTrigger value="appearance">Apariencia</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
            </TabsList>

            {/* Información Básica */}
            <TabsContent value="basic" className="space-y-4">
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
                      <Label htmlFor="position">Posición en la ruleta *</Label>
                      <Select
                        value={watch('position')?.toString()}
                        onValueChange={(value) => setValue('position', parseInt(value))}
                      >
                        <SelectTrigger id="position" className={errors.position ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePositions.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No hay posiciones disponibles
                            </SelectItem>
                          ) : (
                            availablePositions.map((pos) => (
                              <SelectItem key={pos} value={pos.toString()}>
                                Posición {pos}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Posiciones ocupadas: {existingPositions.join(', ') || 'Ninguna'}
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

                  <div className="space-y-2">
                    <Label>Tipo de premio *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {PRIZE_TYPES.map((type) => (
                        <motion.div
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              value={type.value}
                              {...register('prize_type')}
                              className="sr-only"
                            />
                            <div className={`
                              p-4 rounded-lg border-2 transition-all
                              ${selectedType === type.value 
                                ? 'border-primary bg-primary/10' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              }
                            `}>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{type.icon}</span>
                                <div>
                                  <p className="font-medium">{type.label}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {type.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración */}
            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Premio</CardTitle>
                  <CardDescription>
                    Define el valor y comportamiento del premio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label>Comportamiento *</Label>
                      <Select
                        value={selectedBehavior}
                        onValueChange={(value) => setValue('prize_behavior', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {compatibleBehaviors.map((behavior) => (
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
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="probability">Probabilidad de ganar</Label>
                      <span className="text-2xl font-bold text-primary">{probability}%</span>
                    </div>
                    <Slider
                      id="probability"
                      min={0.1}
                      max={Math.min(50, 100 - currentTotalProbability + 0.1)}
                      step={0.1}
                      value={[probability]}
                      onValueChange={(value) => {
                        setProbability(value[0]);
                        setValue('probability', value[0]);
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.1%</span>
                      <span>Máximo: {(100 - currentTotalProbability).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Alerta si la probabilidad es muy alta */}
                  {probability > 30 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Una probabilidad del {probability}% es muy alta. Considera si es apropiado para el valor del premio.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Configuración avanzada para bonos */}
                  {(selectedBehavior === 'bonus' || selectedBehavior === 'custom') && (
                    <Card className="bg-gray-50 dark:bg-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-base">Configuración Personalizada</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedBehavior === 'bonus' && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="auto_apply">Aplicar automáticamente</Label>
                              <Switch
                                id="auto_apply"
                                checked={watch('custom_config.auto_apply')}
                                onCheckedChange={(checked) => 
                                  setValue('custom_config.auto_apply', checked)
                                }
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="bonus_name">Nombre del bono</Label>
                                <Input
                                  id="bonus_name"
                                  placeholder="Ej: Bono de Bienvenida"
                                  {...register('custom_config.bonus_name')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bonus_type">Tipo de bono</Label>
                                <Select
                                  value={watch('custom_config.bonus_type')}
                                  onValueChange={(value) => 
                                    setValue('custom_config.bonus_type', value)
                                  }
                                >
                                  <SelectTrigger id="bonus_type">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="deposit">Depósito</SelectItem>
                                    <SelectItem value="welcome">Bienvenida</SelectItem>
                                    <SelectItem value="referral">Referido</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="min_deposit">Depósito mínimo (S/)</Label>
                                <Input
                                  id="min_deposit"
                                  type="number"
                                  step="0.01"
                                  placeholder="0"
                                  {...register('custom_config.min_deposit', { valueAsNumber: true })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="validity_days">Validez (días)</Label>
                                <Input
                                  id="validity_days"
                                  type="number"
                                  placeholder="30"
                                  {...register('custom_config.validity_days', { valueAsNumber: true })}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Valores mínimos y máximos (para efectivo) */}
                  {selectedType === 'cash' && (
                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Rango de Valores (Opcional)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="min_value">Valor mínimo</Label>
                            <Input
                              id="min_value"
                              type="number"
                              step="0.01"
                              placeholder="0"
                              {...register('min_value', { valueAsNumber: true })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="max_value">Valor máximo</Label>
                            <Input
                              id="max_value"
                              type="number"
                              step="0.01"
                              placeholder="0"
                              {...register('max_value', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Si defines un rango, el premio será un valor aleatorio entre estos límites
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Apariencia */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Apariencia del Premio</CardTitle>
                  <CardDescription>
                    Personaliza cómo se verá el premio en la ruleta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selector de Emoji */}
                  <div className="space-y-2">
                    <Label>Icono del premio</Label>
                    <div className="flex items-center gap-4 mb-3">
                      <div 
                        className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-3xl"
                        style={{ backgroundColor: selectedColor + '20' }}
                      >
                        {selectedIcon || '?'}
                      </div>
                      <Input
                        placeholder="Escribe un emoji o selecciona uno"
                        value={selectedIcon || ''}
                        onChange={(e) => setValue('icon', e.target.value)}
                        className="flex-1"
                        maxLength={2}
                      />
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                      {EMOJI_SUGGESTIONS.map((emoji) => (
                        <motion.button
                          key={emoji}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`
                            p-2 rounded-lg border-2 transition-all text-2xl
                            ${selectedIcon === emoji 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }
                          `}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Selector de Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color del premio</Label>
                    <div className="flex items-center gap-3 mb-3">
                      <Input
                        id="color"
                        type="color"
                        value={selectedColor}
                        onChange={(e) => {
                          setSelectedColor(e.target.value);
                          setValue('color', e.target.value);
                        }}
                        className="w-20 h-12"
                      />
                      <Input
                        type="text"
                        value={selectedColor}
                        onChange={(e) => {
                          const color = e.target.value;
                          if (/^#[0-9A-F]{6}$/i.test(color)) {
                            setSelectedColor(color);
                            setValue('color', color);
                          }
                        }}
                        placeholder="#FFD700"
                        className="flex-1"
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_COLORS.map((color) => (
                        <motion.button
                          key={color.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePresetColor(color.value)}
                          className={`
                            h-12 rounded-lg border-2 transition-all relative overflow-hidden
                            ${selectedColor === color.value 
                              ? 'border-primary ring-2 ring-primary/50' 
                              : 'border-gray-300 dark:border-gray-600'
                            }
                          `}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {selectedColor === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="h-3 w-3 bg-white rounded-full" />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Vista previa */}
                  <div className="space-y-2">
                    <Label>Vista previa</Label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div 
                        className="h-20 w-20 rounded-lg flex items-center justify-center text-4xl shadow-lg"
                        style={{ backgroundColor: selectedColor }}
                      >
                        {selectedIcon || '🎁'}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{watch('name') || 'Nombre del premio'}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedType === 'cash' && `S/ ${watch('prize_value') || 0}`}
                          {selectedType === 'bonus' && `${watch('prize_value') || 0}%`}
                          {selectedType === 'points' && `${watch('prize_value') || 0} pts`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Probabilidad: {probability}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Avanzado */}
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración Avanzada</CardTitle>
                  <CardDescription>
                    Opciones adicionales para casos especiales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Estas opciones son para casos especiales. La mayoría de premios no las necesitan.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Premio de prueba</Label>
                        <p className="text-sm text-muted-foreground">
                          Este premio solo aparecerá en modo desarrollo
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Requiere verificación adicional</Label>
                        <p className="text-sm text-muted-foreground">
                          El usuario deberá completar pasos adicionales
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificar por email</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar email al ganar este premio
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
                <li>• Cada posición en la ruleta es única y no se puede repetir</li>
                <li>• Los premios inactivos no aparecen en la ruleta pero conservan su configuración</li>
              </ul>
            </CardContent>
          </Card>

          {/* Resumen y acciones */}
          <Card className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Resumen del Premio</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Tipo: {PRIZE_TYPES.find(t => t.value === selectedType)?.label}</span>
                    <span>•</span>
                    <span>Probabilidad: {probability}%</span>
                    <span>•</span>
                    <span>Posición: {watch('position')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {previewMode ? 'Ocultar' : 'Vista previa'}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/admin/roulette/prizes">Cancelar</Link>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={
                      createPrize.isPending || 
                      availablePositions.length === 0 ||
                      (currentTotalProbability + probability > 100)
                    }
                  >
                    {createPrize.isPending ? (
                      <>Creando...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Crear Premio
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}