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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateUserRole } from '@/hooks/admin/useUsers';
import { User } from '@/types';
import { Shield } from 'lucide-react';

interface UserRoleDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const roles = [
  { value: 'admin', label: 'Administrador', description: 'Acceso total al sistema' },
  { value: 'agent', label: 'Agente', description: 'Puede gestionar clientes y códigos' },
  { value: 'editor', label: 'Editor', description: 'Puede crear y editar contenido' },
  { value: 'client', label: 'Cliente', description: 'Usuario estándar del sistema' },
];

export function UserRoleDialog({ open, onClose, user }: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const updateRole = useUpdateUserRole();

  const handleConfirm = () => {
    if (selectedRole === user.role) {
      onClose();
      return;
    }

    updateRole.mutate(
      { id: user.id, role: selectedRole },
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
          <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
          <DialogDescription>
            Actualiza el rol de <span className="font-semibold">{user.username}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Rol actual</Label>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Shield className="h-4 w-4" />
              <span className="font-medium capitalize">{user.role}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-role">Nuevo rol</Label>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as User['role'])}>
              <SelectTrigger id="new-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {role.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={updateRole.isPending || selectedRole === user.role}
          >
            {updateRole.isPending ? 'Actualizando...' : 'Cambiar Rol'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}