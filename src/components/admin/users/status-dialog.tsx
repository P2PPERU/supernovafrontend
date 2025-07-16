'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUpdateUserStatus } from '@/hooks/admin/useUsers';
import { User } from '@/types';
import { AlertCircle } from 'lucide-react';

interface UserStatusDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function UserStatusDialog({ open, onClose, user }: UserStatusDialogProps) {
  const updateStatus = useUpdateUserStatus();

  const handleConfirm = () => {
    updateStatus.mutate(
      { id: user.id, isActive: !user.isActive },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Estado de Usuario</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas {user.isActive ? 'desactivar' : 'activar'} a{' '}
            <span className="font-semibold">{user.username}</span>?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            {user.isActive ? (
              <p>Al desactivar este usuario, no podrá iniciar sesión ni acceder al sistema.</p>
            ) : (
              <p>Al activar este usuario, podrá iniciar sesión y acceder al sistema nuevamente.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={updateStatus.isPending}
            variant={user.isActive ? 'destructive' : 'default'}
          >
            {updateStatus.isPending ? 'Procesando...' : user.isActive ? 'Desactivar' : 'Activar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}