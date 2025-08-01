'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRooms } from '@/hooks/useRooms';
import { RoomFilters as RoomFiltersType } from '@/types/rooms.types';
import { RoomGrid } from '@/components/rooms/room-grid';
import { RoomFilters } from '@/components/rooms/room-filters';
import { RoomSearch } from '@/components/rooms/room-search';
import { RoomSort } from '@/components/rooms/room-sort';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad2, TrendingUp, Users, Filter, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RoomsPage() {
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Aplicar búsqueda a los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  // Aplicar ordenamiento a los filtros
  useEffect(() => {
    const [field, order] = sortBy.split('-');
    setFilters(prev => ({
      ...prev,
      sortBy: field as any,
      order: order as 'asc' | 'desc'
    }));
  }, [sortBy]);

  const { data, isLoading } = useRooms(filters);
  const rooms = data?.rooms || [];

  // Stats cards
  const stats = [
    {
      icon: Gamepad2,
      label: 'Salas Activas',
      value: rooms.length,
      color: 'text-poker-green',
    },
    {
      icon: Users,
      label: 'Jugadores Online',
      value: rooms.reduce((acc, room) => {
        const players = parseInt(room.activePlayers.replace(/[^0-9]/g, ''));
        return acc + players;
      }, 0).toLocaleString(),
      color: 'text-poker-blue',
    },
    {
      icon: TrendingUp,
      label: 'Rakeback Promedio',
      value: `${Math.round(rooms.reduce((acc, room) => acc + room.rakeback.percentage, 0) / rooms.length)}%`,
      color: 'text-poker-gold',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-poker-green/10 via-transparent to-poker-purple/10 opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-6">
              <Gamepad2 className="h-4 w-4 mr-1" />
              Salas Premium
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Elige tu <span className="gradient-text">Sala de Poker</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Compara las mejores salas de poker online. Bonos exclusivos, rakeback competitivo 
              y miles de jugadores esperándote las 24 horas.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="glass p-6">
                      <Icon className={cn('h-8 w-8 mx-auto mb-2', stat.color)} />
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <RoomSearch
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nombre, características o bonos..."
              className="mb-8"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">
                {rooms.length} Salas Disponibles
              </h2>
              {filters.category && (
                <Badge variant="outline">
                  Filtrado por: {filters.category}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mobile Filters Toggle */}
              <div className="md:hidden">
                <RoomFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  mobile
                />
              </div>
              
              {/* Sort */}
              <RoomSort value={sortBy} onChange={setSortBy} />
              
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 p-1 rounded-lg glass">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block lg:col-span-1">
              <div className="sticky top-24">
                <RoomFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="lg:col-span-3">
              <RoomGrid
                rooms={rooms}
                loading={isLoading}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                columns={viewMode === 'list' ? 1 : 3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-background/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass max-w-4xl mx-auto p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Contáctanos y te ayudaremos a encontrar la sala perfecta para tu estilo de juego
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-poker-green hover:bg-poker-darkGreen">
                  Contactar Soporte
                </Button>
                <Button size="lg" variant="outline" className="glass border-white/20">
                  Ver Guía de Salas
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}