import { Room } from '@/types/rooms.types';
import { RoomCard } from './room-card';
import { RoomGridSkeleton } from './room-skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RoomGridProps {
  rooms: Room[];
  loading?: boolean;
  variant?: 'default' | 'compact';
  columns?: 1 | 2 | 3 | 4; // CAMBIO: Añadido 1 como opción válida
}

export function RoomGrid({ 
  rooms, 
  loading = false,
  variant = 'default',
  columns = 4 
}: RoomGridProps) {
  if (loading) {
    return <RoomGridSkeleton count={8} />;
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No se encontraron salas</p>
        <p className="text-gray-400 text-sm mt-2">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1', // CAMBIO: Añadido configuración para 1 columna
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'grid gap-6',
        gridCols[columns]
      )}
    >
      {rooms.map((room, index) => (
        <RoomCard 
          key={room.id} 
          room={room} 
          variant={variant}
          index={index}
        />
      ))}
    </motion.div>
  );
}