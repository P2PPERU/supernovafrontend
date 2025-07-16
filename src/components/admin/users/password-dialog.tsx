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
import { useResetUserPassword } from '@/hooks/admin/useUsers';
import { User } from '@/types';
import { Eye, EyeOff, Key, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface UserPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function UserPasswordDialog({ open, onClose, user }: UserPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useGeneratedPassword, setUseGeneratedPassword] = useState(true);
  const resetPassword = useResetUserPassword();

  // Generar contraseña aleatoria
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  // Generar contraseña al abrir el diálogo
  useState(() => {
    if (open) generatePassword();
  });

  const handleConfirm = () => {
    if (password.length < 6) return;

    resetPassword.mutate(
      { id: user.id, newPassword: password },
      {
        onSuccess: () => {
          onClose();
          setPassword('');
          setShowPassword(false);
        },
      }
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success('Contraseña copiada al portapapeles');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restablecer Contraseña</DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para{' '}
            <span className="font-semibold">{user.username}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de contraseña</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={useGeneratedPassword}
                  onChange={() => {
                    setUseGeneratedPassword(true);
                    generatePassword();
                  }}
                  className="h-4 w-4"
                />
                <span className="text-sm">Usar contraseña generada automáticamente</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!useGeneratedPassword}
                  onChange={() => {
                    setUseGeneratedPassword(false);
                    setPassword('');
                  }}
                  className="h-4 w-4"
                />
                <span className="text-sm">Establecer contraseña personalizada</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                readOnly={useGeneratedPassword}
                className={useGeneratedPassword ? 'pr-20' : 'pr-10'}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {useGeneratedPassword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {!useGeneratedPassword && password && password.length < 6 && (
              <p className="text-sm text-red-500">
                La contraseña debe tener al menos 6 caracteres
              </p>
            )}
          </div>

          {useGeneratedPassword && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
              >
                <Key className="mr-2 h-4 w-4" />
                Generar otra
              </Button>
            </div>
          )}

          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Importante:</strong> Asegúrate de compartir esta contraseña con el
              usuario de forma segura. No podrás verla nuevamente después de cerrar este
              diálogo.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={resetPassword.isPending || password.length < 6}
          >
            {resetPassword.isPending ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}