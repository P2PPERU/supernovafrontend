'use client';

import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
//import { useUpdateUserCredit } from '@/hooks/admin/useUsers';
import { User } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Plus, Minus, Equal } from 'lucide-react';

interface UserCreditDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function UserCreditDialog({ open, onClose, user }: UserCreditDialogProps) {
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'set' | 'add' | 'subtract'>('add');
  // const updateCredit = useUpdateUserCredit();

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) return;

    // updateCredit.mutate(
    //   { id: user.id, amount: value, operation },
    //   {
    //     onSuccess: () => {
    //       onClose();
    //       setAmount('');
    //       setOperation('add');
    //     },
    //   }
    // );

    // Por ahora solo cerramos el diálogo
    onClose();
    setAmount('');
    setOperation('add');
  };

  const getEstimatedAmount = () => {
    const value = parseFloat(amount) || 0;
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar Créditos</DialogTitle>
          <DialogDescription>
            Actualiza los créditos de <span className="font-semibold">{user.username}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Operación</Label>
            <RadioGroup value={operation} onValueChange={(v: any) => setOperation(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add" className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4 text-green-600" />
                  Agregar créditos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtract" id="subtract" />
                <Label htmlFor="subtract" className="flex items-center gap-2 cursor-pointer">
                  <Minus className="h-4 w-4 text-red-600" />
                  Restar créditos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="set" id="set" />
                <Label htmlFor="set" className="flex items-center gap-2 cursor-pointer">
                  <Equal className="h-4 w-4 text-blue-600" />
                  Establecer créditos
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                S/
              </span>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {amount && !isNaN(parseFloat(amount)) && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm font-medium">
                {operation === 'add' && 'Créditos a agregar:'}
                {operation === 'subtract' && 'Créditos a restar:'}
                {operation === 'set' && 'Créditos a establecer:'}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(getEstimatedAmount())}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              // updateCredit.isPending ||
              !amount ||
              isNaN(parseFloat(amount)) ||
              parseFloat(amount) < 0
            }
          >
            {/* {updateCredit.isPending ? 'Actualizando...' : 'Confirmar'} */}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}