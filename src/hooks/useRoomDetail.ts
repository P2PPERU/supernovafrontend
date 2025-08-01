import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { roomsService } from '@/services/rooms.service';
import { Room, RoomReview } from '@/types/rooms.types';

// Hook para obtener detalle de sala
export const useRoomDetail = (roomId: string): UseQueryResult<Room | null> => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomsService.getRoomById(roomId),
    enabled: !!roomId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obtener reseñas
export const useRoomReviews = (roomId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['room', roomId, 'reviews', page, limit],
    queryFn: () => roomsService.getRoomReviews(roomId, page, limit),
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener estadísticas
export const useRoomStats = (roomId: string) => {
  return useQuery({
    queryKey: ['room', roomId, 'stats'],
    queryFn: () => roomsService.getRoomStats(roomId),
    enabled: !!roomId,
    staleTime: 60 * 1000, // 1 minuto (stats cambian más frecuentemente)
  });
};

// Hook combinado para toda la data del detalle
export const useRoomFullDetail = (roomId: string) => {
  const { data: room, isLoading: roomLoading, error: roomError } = useRoomDetail(roomId);
  const { data: reviewsData, isLoading: reviewsLoading } = useRoomReviews(roomId);
  const { data: stats, isLoading: statsLoading } = useRoomStats(roomId);

  return {
    room,
    reviews: reviewsData?.reviews || [],
    totalReviews: reviewsData?.total || 0,
    stats,
    isLoading: roomLoading || reviewsLoading || statsLoading,
    error: roomError,
  };
};