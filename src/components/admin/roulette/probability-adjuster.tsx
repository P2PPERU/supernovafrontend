'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RoulettePrize } from '@/services/admin/roulette.service';
import { useAdjustProbabilities } from '@/hooks/admin/useRoulette';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProbabilityAdjusterProps {
  prizes: RoulettePrize[];
  open: boolean;
  onClose: () => void;
}

export function ProbabilityAdjuster({ prizes, open, onClose }: ProbabilityAdjusterProps) {
  const [adjustedPrizes, setAdjustedPrizes] = useState<Array<{ id: string; probability: number }>>([]);
  const [lockPrize, setLockPrize] = useState<string | null>(null);
  const adjustMutation = useAdjustProbabilities();

  useEffect(() => {
    setAdjustedPrizes(
      prizes.map(prize => ({
        id: prize.id,
        probability: prize.probability
      }))
    );
  }, [prizes]);

  const totalProbability = adjustedPrizes.reduce((sum, p) => sum + p.probability, 0);
  const isValid = Math.abs(totalProbability - 100) < 0.01;
  const remaining = 100 - totalProbability;

  const handleProbabilityChange = (prizeId: string, newProbability: number) => {
    setAdjustedPrizes(prev => 
      prev.map(p => p.id === prizeId ? { ...p, probability: newProbability } : p)
    );
  };

  const handleAutoDistribute = () => {
    const lockedPrize = adjustedPrizes.find(p => p.id === lockPrize);
    const lockedValue = lockedPrize?.probability || 0;
    const availableTotal = 100 - lockedValue;
    const unlockedPrizes = adjustedPrizes.filter(p => p.id !== lockPrize);
    
    if (unlockedPrizes.length === 0) return;

    const perPrize = availableTotal / unlockedPrizes.length;
    
    setAdjustedPrizes(prev =>
      prev.map(p => ({
        ...p,
        probability: p.id === lockPrize ? p.probability : parseFloat(perPrize.toFixed(2))
      }))
    );
  };

  const handleProportionalAdjust = () => {
    if (totalProbability === 0) return;
    
    const factor = 100 / totalProbability;
    
    setAdjustedPrizes(prev =>
      prev.map(p => ({
        ...p,
        probability: parseFloat((p.probability * factor).toFixed(2))
      }))
    );
  };

  const handleSave = () => {
    const probabilities = adjustedPrizes.map(p => ({
      id: p.id,
      probability: p.probability
    }));

    adjustMutation.mutate(probabilities, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const getPrizeInfo = (prizeId: string) => {
    return prizes.find(p => p.id === prizeId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajustar Probabilidades</DialogTitle>
          <DialogDescription>
            Modifica las probabilidades de cada premio. La suma total debe ser exactamente 100%.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Estado actual */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base">Suma Total de Probabilidades</Label>
              <span className={`text-2xl font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                {totalProbability.toFixed(2)}%
              </span>
            </div>
            <Progress 
              value={Math.min(totalProbability, 100)} 
              className={isValid ? 'bg-green-100' : totalProbability > 100 ? 'bg-red-100' : 'bg-yellow-100'}
            />
            {!isValid && (
              <p className="text-sm text-muted-foreground">
                {totalProbability > 100 
                  ? `Excede por ${(totalProbability - 100).toFixed(2)}%`
                  : `Faltan ${Math.abs(remaining).toFixed(2)}%`
                }
              </p>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAutoDistribute}
              disabled={lockPrize === null}
            >
              Distribuir Equitativamente
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleProportionalAdjust}
            >
              Ajustar Proporcionalmente
            </Button>
          </div>

          {/* Lista de premios */}
          <div className="space-y-4">
            {adjustedPrizes.map((adjustedPrize) => {
              const prize = getPrizeInfo(adjustedPrize.id);
              if (!prize) return null;

              const isLocked = lockPrize === prize.id;

              return (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: prize.color + '20' }}
                      >
                        {prize.icon ? (
                          <span className="text-xl">{prize.icon}</span>
                        ) : (
                          <span className="text-xs font-bold">?</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{prize.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Original: {prize.probability}%
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isLocked ? 'default' : 'outline'}
                      onClick={() => setLockPrize(isLocked ? null : prize.id)}
                    >
                      {isLocked ? 'Desbloqueado' : 'Bloquear'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[adjustedPrize.probability]}
                        onValueChange={(value) => handleProbabilityChange(prize.id, value[0])}
                        max={100}
                        step={0.1}
                        disabled={isLocked}
                        className="flex-1"
                      />
                      <div className="w-20">
                        <Input
                          type="number"
                          value={adjustedPrize.probability}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            handleProbabilityChange(prize.id, Math.min(100, Math.max(0, value)));
                          }}
                          min="0"
                          max="100"
                          step="0.1"
                          disabled={isLocked}
                          className="text-right"
                        />
                      </div>
                      <span className="text-sm font-medium w-8">%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Alertas */}
          {isValid ? (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                La configuración es válida. Las probabilidades suman exactamente 100%.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                La suma de probabilidades debe ser exactamente 100%. Ajusta los valores antes de guardar.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Consejo:</strong> Puedes bloquear un premio para mantener su probabilidad fija mientras ajustas los demás.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || adjustMutation.isPending}
          >
            {adjustMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}