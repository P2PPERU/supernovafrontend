'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { useState } from 'react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Card, CardContent } from '@/components/ui/card';

interface NewsFiltersProps {
  filters: {
    search: string;
    category: string;
    status: string;
    featured?: string;
    dateRange?: {
      from?: Date;
      to?: Date;
    };
  };
  onFiltersChange: (filters: any) => void;
  showAdvanced?: boolean;
}

export function NewsFilters({ filters, onFiltersChange, showAdvanced = false }: NewsFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showAdvanced);

  const handleReset = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      status: 'all',
      featured: 'all',
      dateRange: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.status !== 'all' || 
    filters.featured !== 'all' ||
    filters.dateRange;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Filtros principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="sr-only">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por título, contenido o autor..."
                  value={filters.search}
                  onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 1 })}
                  className="pl-10"
                />
                {filters.search && (
                  <button
                    onClick={() => onFiltersChange({ ...filters, search: '', page: 1 })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="sr-only">Categoría</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value, page: 1 })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="tournament">Torneo</SelectItem>
                  <SelectItem value="promotion">Promoción</SelectItem>
                  <SelectItem value="update">Actualización</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="sr-only">Estado</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => onFiltersChange({ ...filters, status: value, page: 1 })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros avanzados
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Filtros avanzados */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="featured" className="text-sm mb-2 block">Destacadas</Label>
                <Select
                  value={filters.featured || 'all'}
                  onValueChange={(value) => onFiltersChange({ ...filters, featured: value, page: 1 })}
                >
                  <SelectTrigger id="featured">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="true">Solo destacadas</SelectItem>
                    <SelectItem value="false">No destacadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Rango de fechas
                </Label>
                <DatePickerWithRange
                  date={filters.dateRange}
                  onDateChange={(range) => onFiltersChange({ ...filters, dateRange: range, page: 1 })}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}