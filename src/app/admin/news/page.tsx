'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminNews, useDeleteNews, useUpdateNewsStatus, useToggleFeatured } from '@/hooks/admin/useNews';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Archive,
  Star,
  StarOff,
  Newspaper
} from 'lucide-react';
import { motion } from 'framer-motion';
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

export default function AdminNewsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: 'all',
    status: 'all',
  });

  const [deleteNewsId, setDeleteNewsId] = useState<string | null>(null);

  const { data, isLoading } = useAdminNews({
    ...filters,
    category: filters.category === 'all' ? undefined : filters.category,
    status: filters.status === 'all' ? undefined : filters.status,
  });

  const deleteNews = useDeleteNews();
  const updateStatus = useUpdateNewsStatus();
  const toggleFeatured = useToggleFeatured();

  const news = data?.data || [];
  const totalPages = data?.totalPages || 1;

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

  const handleDelete = () => {
    if (deleteNewsId) {
      deleteNews.mutate(deleteNewsId);
      setDeleteNewsId(null);
    }
  };

  const handleStatusChange = (id: string, status: 'draft' | 'published' | 'archived') => {
    updateStatus.mutate({ id, status });
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    toggleFeatured.mutate({ id, featured: !currentFeatured });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Noticias</h1>
          <p className="text-muted-foreground">
            Gestiona las noticias y publicaciones del sitio
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Noticia
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por título..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value, page: 1 })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="tournament">Torneo</SelectItem>
                  <SelectItem value="promotion">Promoción</SelectItem>
                  <SelectItem value="update">Actualización</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Cargando noticias...</span>
              </div>
            </div>
          ) : news.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
              No se encontraron noticias con los filtros aplicados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Vistas</TableHead>
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
                      <div className="flex items-center gap-2">
                        {item.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                        <div>
                          <div className="font-medium">{item.title}</div>
                          {item.summary && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {item.summary}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(item.category)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{item.author?.username || 'Sistema'}</div>
                        <div className="text-muted-foreground">{item.author?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(item.publishedAt || item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.views || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/news/${item.id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Noticia
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/news/${item.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.status !== 'published' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(item.id, 'published')}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Publicar
                            </DropdownMenuItem>
                          )}
                          {item.status === 'published' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(item.id, 'draft')}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Cambiar a Borrador
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(item.id, 'archived')}
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Archivar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(item.id, item.featured)}
                          >
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
                            className="text-red-600"
                            onClick={() => setDeleteNewsId(item.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={filters.page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: pageNum })}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteNewsId} onOpenChange={() => setDeleteNewsId(null)}>
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
    </div>
  );
}