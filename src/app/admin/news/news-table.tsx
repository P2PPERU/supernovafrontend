'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { News } from '@/types';
import { formatDate } from '@/lib/utils';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Archive,
  Star,
  StarOff,
  Copy,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface NewsTableProps {
  news: News[];
  isLoading?: boolean;
  onStatusChange: (id: string, status: 'draft' | 'published' | 'archived') => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export function NewsTable({
  news,
  isLoading = false,
  onStatusChange,
  onToggleFeatured,
  onDelete,
  onBulkDelete,
}: NewsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(news.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants: any = {
      general: { color: 'bg-blue-500', label: 'General' },
      tournament: { color: 'bg-purple-500', label: 'Torneo' },
      promotion: { color: 'bg-green-500', label: 'Promoción' },
      update: { color: 'bg-orange-500', label: 'Actualización' },
    };
    const variant = variants[category] || variants.general;
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      draft: { variant: 'outline' as const, label: 'Borrador' },
      published: { variant: 'default' as const, label: 'Publicado' },
      archived: { variant: 'secondary' as const, label: 'Archivado' },
    };
    const variant = variants[status] || variants.draft;
    return (
      <Badge variant={variant.variant}>
        {variant.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Cargando noticias...</span>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        No se encontraron noticias con los filtros aplicados.
      </div>
    );
  }

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-t-lg">
          <span className="text-sm font-medium">
            {selectedIds.length} noticias seleccionadas
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar seleccionadas
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === news.length && news.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Noticia</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-center">Vistas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group"
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <Link
                        href={`/news/${item.id}`}
                        target="_blank"
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                    </div>
                    {item.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getCategoryBadge(item.category)}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{item.author?.username || 'Sistema'}</div>
                  <div className="text-muted-foreground">{item.author?.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{formatDate(item.publishedAt || item.createdAt)}</div>
                  <div className="text-muted-foreground">
                    {new Date(item.publishedAt || item.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{item.views || 0}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link href={`/news/${item.id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Noticia
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/news/${item.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href={`/admin/news/create?duplicate=${item.id}`}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    {item.status !== 'published' && (
                      <DropdownMenuItem onClick={() => onStatusChange(item.id, 'published')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Publicar
                      </DropdownMenuItem>
                    )}
                    
                    {item.status === 'published' && (
                      <DropdownMenuItem onClick={() => onStatusChange(item.id, 'draft')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Cambiar a Borrador
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => onStatusChange(item.id, 'archived')}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archivar
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onToggleFeatured(item.id, !item.featured)}>
                      {item.featured ? (
                        <>
                          <StarOff className="mr-2 h-4 w-4" />
                          Quitar Destacado
                        </>
                      ) : (
                        <>
                          <Star className="mr-2 h-4 w-4" />
                          Destacar
                        </>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}