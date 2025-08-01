import { Room, RoomCategory, RoomGameType } from '@/types/rooms.types';

export const roomsMockData: Room[] = [
  {
    id: 'x-poker',
    name: 'X-POKER',
    slug: 'x-poker',
    logo: '♠',
    color: 'purple',
    gradientColors: {
      from: 'from-purple-600',
      to: 'to-purple-800'
    },
    description: 'X-POKER es la sala premium líder en Latinoamérica, ofreciendo la mejor experiencia de poker online con tecnología de punta y seguridad garantizada. Con más de 10 años en el mercado, nos hemos consolidado como la opción preferida de jugadores profesionales y recreativos.',
    shortDescription: 'La sala premium con el mejor rakeback del mercado',
    rating: 4.8,
    totalReviews: 2341,
    activePlayers: '2.3K',
    badge: 'Mejor Rakeback',
    badgeColor: 'bg-purple-500',
    featured: true,
    order: 1,
    images: {
      hero: '/images/rooms/xpoker-hero.jpg',
      gallery: [
        '/images/rooms/xpoker-1.jpg',
        '/images/rooms/xpoker-2.jpg',
        '/images/rooms/xpoker-3.jpg'
      ],
      logo: '/images/rooms/xpoker-logo.png'
    },
    bonus: {
      welcome: {
        amount: 1000,
        currency: 'USD',
        percentage: 100,
        maxBonus: 1000,
        description: 'Duplicamos tu primer depósito hasta $1000'
      },
      deposit: {
        percentage: 50,
        maxAmount: 500,
        minDeposit: 20
      },
      reload: {
        percentage: 25,
        frequency: 'weekly'
      },
      specialOffers: [
        'Bono sin depósito de $50 para nuevos jugadores',
        'Torneos exclusivos VIP cada semana',
        'Cashback adicional del 10% en mesas high stakes'
      ]
    },
    rakeback: {
      percentage: 50,
      type: 'progressive',
      tiers: [
        {
          level: 'Bronce',
          percentage: 20,
          requirements: 'Desde el primer día'
        },
        {
          level: 'Plata',
          percentage: 35,
          requirements: '$500 en rake mensual'
        },
        {
          level: 'Oro',
          percentage: 45,
          requirements: '$2000 en rake mensual'
        },
        {
          level: 'Platino',
          percentage: 50,
          requirements: '$5000 en rake mensual'
        }
      ],
      frequency: 'daily',
      description: 'Rakeback diario directo a tu cuenta, sin restricciones'
    },
    features: [
      {
        id: 'f1',
        icon: 'Trophy',
        title: 'Torneos Premium',
        description: 'Más de 100 torneos diarios con garantizados millonarios',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'Shield',
        title: 'Seguridad SSL',
        description: 'Encriptación de grado bancario para proteger tus datos',
        highlighted: false
      },
      {
        id: 'f3',
        icon: 'Headphones',
        title: 'Soporte 24/7',
        description: 'Equipo de soporte en español disponible todo el día',
        highlighted: true
      },
      {
        id: 'f4',
        icon: 'Zap',
        title: 'Pagos Instantáneos',
        description: 'Retiros procesados en menos de 5 minutos',
        highlighted: true
      },
      {
        id: 'f5',
        icon: 'Smartphone',
        title: 'App Móvil',
        description: 'Juega desde cualquier lugar con nuestra app',
        highlighted: false
      }
    ],
    paymentMethods: [
      {
        id: 'pm1',
        name: 'Visa/Mastercard',
        icon: 'CreditCard',
        type: 'both',
        processingTime: 'Instantáneo',
        minAmount: 10,
        maxAmount: 5000,
        fees: 'Sin comisiones'
      },
      {
        id: 'pm2',
        name: 'Bitcoin',
        icon: 'Bitcoin',
        type: 'both',
        processingTime: '10-30 minutos',
        minAmount: 20,
        maxAmount: 10000,
        fees: 'Sin comisiones'
      },
      {
        id: 'pm3',
        name: 'Skrill',
        icon: 'Wallet',
        type: 'both',
        processingTime: 'Instantáneo',
        minAmount: 10,
        maxAmount: 5000,
        fees: '2% depósito'
      }
    ],
    stats: {
      totalPlayers: 45678,
      dailyTournaments: 127,
      tablesAvailable: 890,
      avgPotSize: 234,
      biggestWin: 125000,
      uptime: 99.9
    },
    pros: [
      'El mejor programa de rakeback del mercado',
      'Pagos instantáneos sin restricciones',
      'Torneos exclusivos con grandes premios',
      'Software estable y seguro',
      'Excelente atención al cliente'
    ],
    cons: [
      'Requiere verificación KYC completa',
      'No acepta algunos países',
      'Interfaz puede ser compleja para principiantes'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z'
  },
  {
    id: 'clubgg',
    name: 'CLUBGG',
    slug: 'clubgg',
    logo: '♣',
    color: 'black',
    gradientColors: {
      from: 'from-gray-800',
      to: 'to-black'
    },
    description: 'CLUBGG es la plataforma de poker más popular entre jugadores recreativos y profesionales. Con una interfaz intuitiva y miles de mesas activas 24/7, encontrarás acción en cualquier momento del día.',
    shortDescription: 'La sala más popular con la mayor variedad de juegos',
    rating: 4.7,
    totalReviews: 3156,
    activePlayers: '3.1K',
    badge: 'Más Popular',
    badgeColor: 'bg-red-500',
    featured: true,
    order: 2,
    images: {
      hero: '/images/rooms/clubgg-hero.jpg',
      gallery: [
        '/images/rooms/clubgg-1.jpg',
        '/images/rooms/clubgg-2.jpg',
        '/images/rooms/clubgg-3.jpg'
      ],
      logo: '/images/rooms/clubgg-logo.png'
    },
    bonus: {
      welcome: {
        amount: 800,
        currency: 'USD',
        percentage: 100,
        maxBonus: 800,
        description: 'Bono del 100% hasta $800 en tu primer depósito'
      },
      deposit: {
        percentage: 40,
        maxAmount: 400,
        minDeposit: 20
      },
      noDeposit: {
        amount: 25,
        description: 'Bono gratis de $25 sin necesidad de depósito'
      },
      reload: {
        percentage: 30,
        frequency: 'weekly'
      },
      specialOffers: [
        'Freerolls diarios con $1000 garantizados',
        'Puntos dobles los fines de semana',
        'Torneos satélite para eventos presenciales'
      ]
    },
    rakeback: {
      percentage: 40,
      type: 'fixed',
      frequency: 'weekly',
      description: '40% de rakeback fijo pagado cada semana'
    },
    features: [
      {
        id: 'f1',
        icon: 'Users',
        title: 'Mayor Tráfico',
        description: 'La comunidad más grande de jugadores latinos',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'Globe',
        title: 'Variedad de Juegos',
        description: 'Texas, Omaha, Stud y juegos mixtos',
        highlighted: true
      },
      {
        id: 'f3',
        icon: 'Gift',
        title: 'Bonos Semanales',
        description: 'Promociones y bonos renovados cada semana',
        highlighted: false
      },
      {
        id: 'f4',
        icon: 'Video',
        title: 'Transmisiones en Vivo',
        description: 'Mira las mejores partidas en streaming',
        highlighted: false
      }
    ],
    paymentMethods: [
      {
        id: 'pm1',
        name: 'Transferencia Bancaria',
        icon: 'Building',
        type: 'both',
        processingTime: '1-3 días',
        minAmount: 50,
        maxAmount: 10000,
        fees: 'Variable según banco'
      },
      {
        id: 'pm2',
        name: 'Criptomonedas',
        icon: 'Coins',
        type: 'both',
        processingTime: '30 minutos',
        minAmount: 20,
        maxAmount: 50000,
        fees: 'Sin comisiones'
      }
    ],
    stats: {
      totalPlayers: 67890,
      dailyTournaments: 234,
      tablesAvailable: 1234,
      avgPotSize: 189,
      biggestWin: 89000,
      uptime: 99.7
    },
    pros: [
      'Mayor cantidad de jugadores activos',
      'Gran variedad de juegos y límites',
      'Bonos y promociones constantes',
      'Freerolls diarios',
      'Comunidad activa y amigable'
    ],
    cons: [
      'Rakeback más bajo que la competencia',
      'Software puede ser lento en horas pico',
      'Proceso de retiro puede demorar'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z'
  },
  {
    id: 'pppoker',
    name: 'PPPOKER',
    slug: 'pppoker',
    logo: '♥',
    color: 'green',
    gradientColors: {
      from: 'from-green-600',
      to: 'to-green-800'
    },
    description: 'PPPOKER revoluciona el poker móvil con su aplicación galardonada. Diseñada específicamente para dispositivos móviles, ofrece la mejor experiencia de juego en tu smartphone o tablet.',
    shortDescription: 'La mejor app móvil para jugar poker en cualquier lugar',
    rating: 4.6,
    totalReviews: 1823,
    activePlayers: '1.8K',
    badge: 'Mejor App',
    badgeColor: 'bg-green-500',
    featured: true,
    order: 3,
    images: {
      hero: '/images/rooms/pppoker-hero.jpg',
      gallery: [
        '/images/rooms/pppoker-1.jpg',
        '/images/rooms/pppoker-2.jpg',
        '/images/rooms/pppoker-3.jpg'
      ],
      logo: '/images/rooms/pppoker-logo.png'
    },
    bonus: {
      welcome: {
        amount: 600,
        currency: 'USD',
        percentage: 100,
        maxBonus: 600,
        description: 'Bono de bienvenida del 100% hasta $600'
      },
      deposit: {
        percentage: 35,
        maxAmount: 300,
        minDeposit: 10
      },
      reload: {
        percentage: 20,
        frequency: 'daily'
      },
      specialOffers: [
        'Giros gratis en la ruleta cada día',
        'Misiones diarias con premios en efectivo',
        'Programa VIP con beneficios exclusivos'
      ]
    },
    rakeback: {
      percentage: 50,
      type: 'vip-based',
      tiers: [
        {
          level: 'VIP 1',
          percentage: 20,
          requirements: 'Registro'
        },
        {
          level: 'VIP 2',
          percentage: 30,
          requirements: '100 puntos VIP'
        },
        {
          level: 'VIP 3',
          percentage: 40,
          requirements: '500 puntos VIP'
        },
        {
          level: 'VIP 4',
          percentage: 50,
          requirements: '2000 puntos VIP'
        }
      ],
      frequency: 'instant',
      description: 'Sistema VIP con rakeback instantáneo'
    },
    features: [
      {
        id: 'f1',
        icon: 'Smartphone',
        title: 'Optimizado Móvil',
        description: 'Diseñado exclusivamente para móviles',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'Clock',
        title: 'Torneos 24/7',
        description: 'Torneos comenzando cada 5 minutos',
        highlighted: true
      },
      {
        id: 'f3',
        icon: 'Users',
        title: 'Comunidad Activa',
        description: 'Chat integrado y clubs privados',
        highlighted: false
      },
      {
        id: 'f4',
        icon: 'Award',
        title: 'App Premiada',
        description: 'Mejor app de poker 2023',
        highlighted: true
      }
    ],
    paymentMethods: [
      {
        id: 'pm1',
        name: 'PayPal',
        icon: 'DollarSign',
        type: 'both',
        processingTime: 'Instantáneo',
        minAmount: 10,
        maxAmount: 3000,
        fees: 'Sin comisiones'
      },
      {
        id: 'pm2',
        name: 'Apple Pay',
        icon: 'Smartphone',
        type: 'deposit',
        processingTime: 'Instantáneo',
        minAmount: 10,
        maxAmount: 2000,
        fees: 'Sin comisiones'
      }
    ],
    stats: {
      totalPlayers: 34567,
      dailyTournaments: 456,
      tablesAvailable: 678,
      avgPotSize: 156,
      biggestWin: 45000,
      uptime: 99.8
    },
    pros: [
      'Mejor experiencia móvil del mercado',
      'Interfaz intuitiva y moderna',
      'Torneos rápidos ideales para móvil',
      'Sistema de clubs y comunidades',
      'Rakeback competitivo'
    ],
    cons: [
      'Solo disponible en móvil',
      'Menos variedad de juegos que otras salas',
      'Límites más bajos en general'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z'
  },
  {
    id: 'wpt',
    name: 'WPT Global',
    slug: 'wpt',
    logo: '♦',
    color: 'blue',
    gradientColors: {
      from: 'from-blue-600',
      to: 'to-blue-800'
    },
    description: 'WPT Global trae la experiencia del World Poker Tour a tu casa. Juega donde juegan los profesionales y participa en satélites para los eventos más prestigiosos del poker mundial.',
    shortDescription: 'La sala oficial del World Poker Tour',
    rating: 4.9,
    totalReviews: 2789,
    activePlayers: '2.7K',
    badge: 'Cash Game TOP',
    badgeColor: 'bg-blue-500',
    featured: true,
    order: 4,
    images: {
      hero: '/images/rooms/wpt-hero.jpg',
      gallery: [
        '/images/rooms/wpt-1.jpg',
        '/images/rooms/wpt-2.jpg',
        '/images/rooms/wpt-3.jpg'
      ],
      logo: '/images/rooms/wpt-logo.png'
    },
    bonus: {
      welcome: {
        amount: 1200,
        currency: 'USD',
        percentage: 100,
        maxBonus: 1200,
        description: 'Mega bono de hasta $1200 en tu primer depósito'
      },
      deposit: {
        percentage: 60,
        maxAmount: 600,
        minDeposit: 20
      },
      reload: {
        percentage: 40,
        frequency: 'monthly'
      },
      specialOffers: [
        'Entradas gratis a eventos WPT presenciales',
        'Mesas exclusivas con pros del WPT',
        'Paquetes VIP para eventos en vivo'
      ]
    },
    rakeback: {
      percentage: 20,
      type: 'fixed',
      frequency: 'weekly',
      description: '20% de rakeback + programa de recompensas WPT'
    },
    features: [
      {
        id: 'f1',
        icon: 'Trophy',
        title: 'Eventos WPT',
        description: 'Satélites para el World Poker Tour',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'Star',
        title: 'Juega con Pros',
        description: 'Mesas con jugadores profesionales',
        highlighted: true
      },
      {
        id: 'f3',
        icon: 'Crown',
        title: 'Soporte VIP',
        description: 'Atención personalizada premium',
        highlighted: false
      },
      {
        id: 'f4',
        icon: 'DollarSign',
        title: 'High Stakes',
        description: 'Las mesas con límites más altos',
        highlighted: true
      }
    ],
    paymentMethods: [
      {
        id: 'pm1',
        name: 'Wire Transfer',
        icon: 'Building',
        type: 'both',
        processingTime: '1-2 días',
        minAmount: 100,
        maxAmount: 100000,
        fees: 'Variable'
      },
      {
        id: 'pm2',
        name: 'Neteller',
        icon: 'CreditCard',
        type: 'both',
        processingTime: 'Instantáneo',
        minAmount: 20,
        maxAmount: 10000,
        fees: '2.5%'
      }
    ],
    stats: {
      totalPlayers: 56789,
      dailyTournaments: 89,
      tablesAvailable: 567,
      avgPotSize: 456,
      biggestWin: 250000,
      uptime: 99.95
    },
    pros: [
      'Prestigio de la marca WPT',
      'Satélites para eventos en vivo',
      'Mesas de high stakes',
      'Software de última generación',
      'Eventos exclusivos con profesionales'
    ],
    cons: [
      'Rakeback más bajo',
      'Enfocado en jugadores experimentados',
      'Depósito mínimo más alto'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z'
  }
];

// Helper functions
export const getRoomById = (id: string): Room | undefined => {
  return roomsMockData.find(room => room.id === id);
};

export const getRoomBySlug = (slug: string): Room | undefined => {
  return roomsMockData.find(room => room.slug === slug);
};

export const getFeaturedRooms = (): Room[] => {
  return roomsMockData.filter(room => room.featured);
};

export const getRoomsByCategory = (category: RoomCategory): Room[] => {
  // Lógica de categorización basada en características
  switch (category) {
    case RoomCategory.HIGH_RAKEBACK:
      return roomsMockData.filter(room => room.rakeback.percentage >= 40);
    case RoomCategory.POPULAR:
      return roomsMockData.filter(room => parseInt(room.activePlayers.replace(/[^0-9]/g, '')) > 2000);
    case RoomCategory.PREMIUM:
      return roomsMockData.filter(room => room.rating >= 4.7);
    default:
      return roomsMockData;
  }
};