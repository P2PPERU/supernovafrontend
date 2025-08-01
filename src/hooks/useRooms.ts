import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';
import { roomsService } from '@/services/rooms.service';
import { Room, RoomFilters, RoomsResponse } from '@/types/rooms.types';
import { useDebounce } from '@/hooks/useDebounce';

// Hook para obtener lista de salas
export const useRooms = (filters?: RoomFilters): UseQueryResult<RoomsResponse> => {
  return useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => roomsService.getRooms(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener salas destacadas
export const useFeaturedRooms = (): UseQueryResult<Room[]> => {
  return useQuery({
    queryKey: ['rooms', 'featured'],
    queryFn: () => roomsService.getFeaturedRooms(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para búsqueda de salas con debounce
export const useRoomSearch = (initialSearch = '') => {
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);
  
  const { data, isLoading, error } = useRooms({ 
    search: debouncedSearch 
  });

  return {
    search,
    setSearch,
    rooms: data?.rooms || [],
    isLoading,
    error,
    total: data?.total || 0
  };
};