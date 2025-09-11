// src/app/clubs/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClubs, useSearchClubs } from '@/hooks/useClubs';
import { 
  Search, 
  MapPin, 
  Users, 
  Globe, 
  Star,
  Filter,
  Gamepad2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Club, ClubFilters } from '@/types/club.types';

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ClubFilters>({
    page: 1,
    limit: 12,
    gameType: '',
    country: '',
    sortBy: 'name',
    order: 'asc',
  });

  // Usar search cuando hay query, sino usar getClubs normal
  const { data: searchData, isLoading: searchLoading } = useSearchClubs(
    searchQuery, 
    searchQuery ? filters : {}
  );
  
  const { data: clubsData, isLoading: clubsLoading } = useClubs(
    searchQuery ? {} : filters
  );

  const isLoading = searchQuery ? searchLoading : clubsLoading;
  const data = searchQuery ? searchData : clubsData;
  const clubs = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: keyof ClubFilters, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value === '' ? undefined : value, 
      page: 1 
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-poker-green to-poker-blue">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Clubs de Poker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre los mejores clubs de poker online. Encuentra tu lugar perfecto para jugar.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <Label htmlFor="search">Buscar clubs</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nombre del club..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Game Type Filter */}
                <div>
                  <Label>Tipo de Juego</Label>
                  <Select 
                    value={filters.gameType || ''} 
                    onValueChange={(value) => handleFilterChange('gameType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Texas Hold'em">Texas Hold'em</SelectItem>
                      <SelectItem value="Omaha">Omaha</SelectItem>
                      <SelectItem value="Tournaments">Torneos</SelectItem>
                      <SelectItem value="Cash Games">Cash Games</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Filter */}
                <div>
                  <Label>País</Label>
                  <Select 
                    value={filters.country || ''} 
                    onValueChange={(value) => handleFilterChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Perú">Perú</SelectItem>
                      <SelectItem value="México">México</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Colombia">Colombia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <Label>Ordenar por</Label>
                  <Select 
                    value={filters.sortBy || 'name'} 
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nombre</SelectItem>
                      <SelectItem value="members">Miembros</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="createdAt">Fecha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="h-96 animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : clubs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron clubs</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `No hay clubs que coincidan con "${searchQuery}"`
                    : 'No hay clubs disponibles con los filtros seleccionados'
                  }
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Limpiar búsqueda
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `${clubs.length} resultado${clubs.length !== 1 ? 's' : ''} para "${searchQuery}"`
                    : `${data?.totalItems || 0} club${(data?.totalItems || 0) !== 1 ? 's' : ''} encontrado${(data?.totalItems || 0) !== 1 ? 's' : ''}`
                  }
                </p>
              </div>

              {/* Clubs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {clubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ClubCard club={club} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                    disabled={(filters.page || 1) === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={(filters.page || 1) === pageNum ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                    disabled={(filters.page || 1) === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Componente de tarjeta de club
function ClubCard({ club }: { club: Club }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
        {/* Banner */}
        {club.banner && (
          <div className="h-32 bg-gradient-to-r from-poker-green to-poker-blue relative overflow-hidden">
            <img 
              src={club.banner} 
              alt={`${club.name} banner`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20" />
            {club.isFeatured && (
              <Badge className="absolute top-3 right-3 bg-poker-gold text-black">
                <Star className="h-3 w-3 mr-1" />
                Destacado
              </Badge>
            )}
          </div>
        )}

        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={club.logo || ''} alt={club.name} />
              <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white font-bold text-lg">
                {club.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold mb-1 truncate">{club.name}</h3>
              {club.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{club.location.city}, {club.location.country}</span>
                </div>
              )}
              {club.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{club.rating}</span>
                  {club.totalReviews && (
                    <span className="text-xs text-muted-foreground">
                      ({club.totalReviews} reseñas)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {club.shortDescription || club.description}
          </p>

          {/* Features */}
          {club.features && club.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {club.features.slice(0, 2).map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {club.features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{club.features.length - 2} más
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between py-3 border-t text-sm">
            {club.stats?.totalMembers && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{club.stats.totalMembers.toLocaleString()}</span>
              </div>
            )}
            {club.gameTypes && club.gameTypes.length > 0 && (
              <div className="flex items-center gap-1">
                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{club.gameTypes.length} juegos</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button asChild className="flex-1" size="sm">
              <Link href={`/clubs/${club.id}`}>
                Ver Detalles
              </Link>
            </Button>
            {club.website && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={club.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}