import { api } from '@/lib/axios';
import { Room, RoomFilters, RoomsResponse, RoomReview } from '@/types/rooms.types';
import { roomsMockData, getRoomById as getRoomByIdMock } from '@/data/rooms-mock';

// Por ahora usaremos datos mock, pero la estructura está lista para API real
const USE_MOCK_DATA = true;

export const roomsService = {
  // Obtener todas las salas con filtros
  getRooms: async (filters?: RoomFilters): Promise<RoomsResponse> => {
    if (USE_MOCK_DATA) {
      // Simulación de filtrado con datos mock
      let filteredRooms = [...roomsMockData];

      // Aplicar búsqueda
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredRooms = filteredRooms.filter(room =>
          room.name.toLowerCase().includes(searchLower) ||
          room.description.toLowerCase().includes(searchLower)
        );
      }

      // Aplicar filtro de rakeback mínimo
      if (filters?.minRakeback) {
        filteredRooms = filteredRooms.filter(room =>
          room.rakeback.percentage >= filters.minRakeback!
        );
      }

      // Aplicar filtro de bonus mínimo
      if (filters?.minBonus) {
        filteredRooms = filteredRooms.filter(room =>
          room.bonus.welcome.amount >= filters.minBonus!
        );
      }

      // Aplicar ordenamiento
      if (filters?.sortBy) {
        filteredRooms.sort((a, b) => {
          switch (filters.sortBy) {
            case 'rating':
              return filters.order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
            case 'players':
              const aPlayers = parseInt(a.activePlayers.replace(/[^0-9]/g, ''));
              const bPlayers = parseInt(b.activePlayers.replace(/[^0-9]/g, ''));
              return filters.order === 'asc' ? aPlayers - bPlayers : bPlayers - aPlayers;
            case 'bonus':
              return filters.order === 'asc' 
                ? a.bonus.welcome.amount - b.bonus.welcome.amount 
                : b.bonus.welcome.amount - a.bonus.welcome.amount;
            case 'rakeback':
              return filters.order === 'asc'
                ? a.rakeback.percentage - b.rakeback.percentage
                : b.rakeback.percentage - a.rakeback.percentage;
            default:
              return 0;
          }
        });
      }

      // Simular respuesta paginada
      return Promise.resolve({
        rooms: filteredRooms,
        total: filteredRooms.length,
        page: 1,
        totalPages: 1
      });
    }

    // Cuando tengamos API real
    const response = await api.get('/rooms', { params: filters });
    return response.data;
  },

  // Obtener sala por ID
  getRoomById: async (id: string): Promise<Room | null> => {
    if (USE_MOCK_DATA) {
      const room = getRoomByIdMock(id);
      return Promise.resolve(room || null);
    }

    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Obtener salas destacadas
  getFeaturedRooms: async (): Promise<Room[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(roomsMockData.filter(room => room.featured));
    }

    const response = await api.get('/rooms/featured');
    return response.data;
  },

  // Obtener reseñas de una sala
  getRoomReviews: async (roomId: string, page = 1, limit = 10): Promise<{
    reviews: RoomReview[];
    total: number;
    totalPages: number;
  }> => {
    if (USE_MOCK_DATA) {
      // Datos mock de reseñas
      const mockReviews: RoomReview[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Carlos M.',
          userAvatar: '/avatars/user1.jpg',
          roomId,
          rating: 5,
          title: 'Excelente sala, la mejor que he probado',
          content: 'Llevo 6 meses jugando aquí y la experiencia ha sido increíble. Los pagos son rápidos y el rakeback es el mejor del mercado.',
          pros: ['Pagos rápidos', 'Buen rakeback', 'Software estable'],
          cons: ['Verificación inicial lenta'],
          verifiedPlayer: true,
          playTime: '6 meses',
          helpfulVotes: 45,
          createdAt: '2024-11-15T10:00:00Z'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'María G.',
          userAvatar: '/avatars/user2.jpg',
          roomId,
          rating: 4,
          title: 'Muy buena sala con algunos detalles',
          content: 'En general es una excelente sala. El único problema es que a veces hay pocos jugadores en límites bajos.',
          pros: ['Buenos bonos', 'Interfaz amigable', 'Soporte en español'],
          cons: ['Poco tráfico en microlímites'],
          verifiedPlayer: true,
          playTime: '3 meses',
          helpfulVotes: 23,
          createdAt: '2024-11-10T15:30:00Z'
        }
      ];

      return Promise.resolve({
        reviews: mockReviews.filter(r => r.roomId === roomId),
        total: 2,
        totalPages: 1
      });
    }

    const response = await api.get(`/rooms/${roomId}/reviews`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Obtener estadísticas de sala
  getRoomStats: async (roomId: string): Promise<any> => {
    if (USE_MOCK_DATA) {
      const room = getRoomByIdMock(roomId);
      return Promise.resolve(room?.stats || null);
    }

    const response = await api.get(`/rooms/${roomId}/stats`);
    return response.data;
  }
};