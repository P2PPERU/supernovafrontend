'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useValidateCode } from '@/hooks/useRoulette';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Gift, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface CodeModalProps {
  open: boolean;
  onClose: () => void;
}

export function CodeModal({ open, onClose }: CodeModalProps) {
  const [code, setCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const validateMutation = useValidateCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Por favor ingresa un código');
      return;
    }

    try {
      await validateMutation.mutateAsync(code.toUpperCase());
      setShowSuccess(true);
      setCode('');
      
      // Cerrar modal después de mostrar éxito
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  const handleClose = () => {
    if (!validateMutation.isPending) {
      setCode('');
      setShowSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-poker-gold" />
            Ingresar Código Promocional
          </DialogTitle>
          <DialogDescription>
            Ingresa tu código para obtener giros adicionales
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4 mt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <div className="relative">
                  <Input
                    id="code"
                    type="text"
                    placeholder="Ej: ABC123"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    disabled={validateMutation.isPending}
                    className="pr-10 uppercase font-mono text-lg tracking-wider"
                    maxLength={20}
                  />
                  {code && (
                    <button
                      type="button"
                      onClick={() => setCode('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={validateMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Los códigos no distinguen mayúsculas/minúsculas
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={validateMutation.isPending}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!code.trim() || validateMutation.isPending}
                  className="flex-1 bg-poker-green hover:bg-poker-darkGreen"
                >
                  {validateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    'Validar Código'
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">¡Código Válido!</h3>
              <p className="text-muted-foreground">
                Tienes un nuevo giro disponible
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}