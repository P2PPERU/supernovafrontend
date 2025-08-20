import { Room, RoomCategory, RoomGameType } from '@/types/rooms.types';

export const roomsMockData: Room[] = [
  {
    id: 'suprema-poker',
    name: 'SUPREMA POKER',
    slug: 'suprema-poker',
    logo: 'S',
    color: 'yellow',
    gradientColors: {
      from: 'from-yellow-500',
      to: 'to-yellow-700'
    },
    description: 'SUPREMA POKER es la sala líder en rakeback del mercado latinoamericano. Con el porcentaje más alto de retorno y beneficios exclusivos para jugadores VIP, es la elección preferida de profesionales que buscan maximizar sus ganancias.',
    shortDescription: 'El rakeback más alto del mercado - hasta 70%',
    rating: 4.9,
    totalReviews: 1847,
    activePlayers: '1.4K',
    badge: 'LÍDER RAKEBACK',
    badgeColor: 'bg-yellow-500',
    featured: true,
    order: 0,
    images: {
      hero: '/images/rooms/suprema-hero.jpg',
      gallery: [
        '/images/rooms/suprema-1.jpg',
        '/images/rooms/suprema-2.jpg',
        '/images/rooms/suprema-3.jpg'
      ],
      logo: '/images/rooms/suprema-logo.png'  // ✅ Aquí está tu logo
    },
    bonus: {
      welcome: {
        amount: 2500,
        currency: 'USD',
        percentage: 100,
        maxBonus: 2500,
        description: 'Bono VIP del 100% hasta $2500 + giros de ruleta gratis'
      },
      deposit: {
        percentage: 70,
        maxAmount: 1000,
        minDeposit: 50
      },
      reload: {
        percentage: 50,
        frequency: 'daily'
      },
      specialOffers: [
        '12 giros diarios en la ruleta premium garantizados',
        'Acceso VIP a torneos exclusivos con $50K GTD',
        'Rakeback diario del 70% sin restricciones',
        'Bono mensual de hasta $2,500 adicionales'
      ]
    },
    rakeback: {
      percentage: 70,
      type: 'vip-based',
      tiers: [
        {
          level: 'VIP Suprema',
          percentage: 70,
          requirements: 'Acceso directo por SUPERNOVA'
        },
        {
          level: 'Gold',
          percentage: 60,
          requirements: '$1000 en rake mensual'
        },
        {
          level: 'Platinum',
          percentage: 65,
          requirements: '$3000 en rake mensual'
        },
        {
          level: 'Diamond',
          percentage: 70,
          requirements: '$8000 en rake mensual'
        }
      ],
      frequency: 'instant',
      description: 'Rakeback instantáneo del 70% - el más alto del mercado'
    },
    features: [
      {
        id: 'f1',
        icon: 'Crown',
        title: 'Rakeback Líder',
        description: 'Hasta 70% de rakeback instantáneo garantizado',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'Gamepad2',
        title: 'Ruleta Premium',
        description: '12 giros diarios garantizados con premios en efectivo',
        highlighted: true
      },
      {
        id: 'f3',
        icon: 'Trophy',
        title: 'Torneos GTD',
        description: 'Torneos garantizados exclusivos para miembros VIP',
        highlighted: true
      },
      {
        id: 'f4',
        icon: 'Headphones',
        title: 'Soporte VIP',
        description: 'Atención prioritaria 24/7 con agentes especializados',
        highlighted: true
      },
      {
        id: 'f5',
        icon: 'Zap',
        title: 'Pagos Express',
        description: 'Retiros procesados en menos de 2 horas',
        highlighted: false
      }
    ],
    paymentMethods: [
      {
        id: 'pm1',
        name: 'Bitcoin/Crypto',
        icon: 'Bitcoin',
        type: 'both',
        processingTime: '15 minutos',
        minAmount: 25,
        maxAmount: 25000,
        fees: 'Sin comisiones'
      },
      {
        id: 'pm2',
        name: 'Visa/Mastercard',
        icon: 'CreditCard',
        type: 'both',
        processingTime: 'Instantáneo',
        minAmount: 50,
        maxAmount: 10000,
        fees: 'Sin comisiones'
      },
      {
        id: 'pm3',
        name: 'Transferencia',
        icon: 'Building',
        type: 'both',
        processingTime: '1-2 horas',
        minAmount: 100,
        maxAmount: 50000,
        fees: 'Variable según monto'
      }
    ],
    stats: {
      totalPlayers: 28450,
      dailyTournaments: 85,
      tablesAvailable: 450,
      avgPotSize: 340,
      biggestWin: 180000,
      uptime: 99.9
    },
    pros: [
      'El rakeback más alto del mercado (70%)',
      'Giros diarios garantizados en ruleta premium',
      'Bonos mensuales de hasta $2,500',
      'Retiros express en menos de 2 horas',
      'Acceso VIP exclusivo por SUPERNOVA',
      'Soporte prioritario especializado'
    ],
    cons: [
      'Acceso exclusivo solo por SUPERNOVA',
      'Depósito mínimo más alto ($50)',
      'Enfocado en jugadores serios y VIP'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z'
  },
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
    shortDescription: 'Especialistas en torneos garantizados',
    rating: 4.8,
    totalReviews: 2341,
    activePlayers: '980',
    badge: 'TORNEOS TOP',
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
      logo: '/images/rooms/xpoker-logo.png'  // ✅ Logo X-POKER
    },
    bonus: {
      welcome: {
        amount: 1800,
        currency: 'USD',
        percentage: 100,
        maxBonus: 1800,
        description: 'Bono del 100% hasta $1800 + 8 giros diarios'
      },
      deposit: {
        percentage: 60,
        maxAmount: 600,
        minDeposit: 20
      },
      reload: {
        percentage: 30,
        frequency: 'weekly'
      },
      specialOffers: [
        '8 giros diarios en ruleta garantizados',
        'Torneos exclusivos premium cada semana',
        'Fast fold poker con action constante',
        'Bono mensual de hasta $1,800'
      ]
    },
    rakeback: {
      percentage: 60,
      type: 'progressive',
      tiers: [
        {
          level: 'Bronce',
          percentage: 30,
          requirements: 'Desde el primer día'
        },
        {
          level: 'Plata',
          percentage: 45,
          requirements: '$500 en rake mensual'
        },
        {
          level: 'Oro',
          percentage: 55,
          requirements: '$2000 en rake mensual'
        },
        {
          level: 'Platino',
          percentage: 60,
          requirements: '$5000 en rake mensual'
        }
      ],
      frequency: 'daily',
      description: 'Rakeback diario progresivo hasta 60%'
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
        icon: 'Zap',
        title: 'Fast Fold',
        description: 'Poker de acción rápida para maximizar las manos',
        highlighted: true
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
        icon: 'DollarSign',
        title: 'Pagos 24h',
        description: 'Retiros procesados en menos de 24 horas',
        highlighted: false
      },
      {
        id: 'f5',
        icon: 'Shield',
        title: 'Seguridad SSL',
        description: 'Encriptación de grado bancario para proteger tus datos',
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
      totalPlayers: 35678,
      dailyTournaments: 127,
      tablesAvailable: 890,
      avgPotSize: 234,
      biggestWin: 125000,
      uptime: 99.9
    },
    pros: [
      'Excelente programa de torneos garantizados',
      'Fast fold poker único en el mercado',
      'Pagos en menos de 24 horas',
      'Software estable y seguro',
      'Rakeback progresivo hasta 60%'
    ],
    cons: [
      'Requiere verificación KYC completa',
      'Menos variedad en cash games',
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
    color: 'gray',
    gradientColors: {
      from: 'from-gray-600',
      to: 'to-gray-800'
    },
    description: 'CLUBGG es la plataforma de poker más popular entre jugadores recreativos y profesionales. Con una interfaz intuitiva y miles de mesas activas 24/7, encontrarás acción en cualquier momento del día.',
    shortDescription: 'La comunidad más grande y activa',
    rating: 4.7,
    totalReviews: 3156,
    activePlayers: '1.6K',
    badge: 'MÁS ACTIVO',
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
      logo: '/images/rooms/clubgg-logo.png'  // ✅ Logo CLUBGG
    },
    bonus: {
      welcome: {
        amount: 1500,
        currency: 'USD',
        percentage: 100,
        maxBonus: 1500,
        description: 'Bono del 100% hasta $1500 + 6 giros diarios'
      },
      deposit: {
        percentage: 55,
        maxAmount: 500,
        minDeposit: 20
      },
      noDeposit: {
        amount: 25,
        description: 'Bono gratis de $25 sin necesidad de depósito'
      },
      reload: {
        percentage: 35,
        frequency: 'weekly'
      },
      specialOffers: [
        '6 giros diarios en ruleta garantizados',
        'Freerolls diarios con $1000 garantizados',
        'Puntos dobles los fines de semana',
        'Bono mensual de hasta $1,500'
      ]
    },
    rakeback: {
      percentage: 55,
      type: 'fixed',
      frequency: 'weekly',
      description: '55% de rakeback fijo pagado cada semana'
    },
    features: [
      {
        id: 'f1',
        icon: 'Users',
        title: 'Más Jugadores',
        description: 'La comunidad más grande de jugadores latinos',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'DollarSign',
        title: 'Cash Games',
        description: 'Mesas de cash game activas las 24 horas',
        highlighted: true
      },
      {
        id: 'f3',
        icon: 'Gift',
        title: 'Freerolls',
        description: 'Torneos gratuitos diarios con premios reales',
        highlighted: true
      },
      {
        id: 'f4',
        icon: 'Globe',
        title: 'Variedad',
        description: 'Texas, Omaha, Stud y juegos mixtos',
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
      totalPlayers: 47890,
      dailyTournaments: 234,
      tablesAvailable: 1234,
      avgPotSize: 189,
      biggestWin: 89000,
      uptime: 99.7
    },
    pros: [
      'Mayor cantidad de jugadores activos',
      'Gran variedad de juegos y límites',
      'Freerolls diarios garantizados',
      'Comunidad activa y amigable',
      'Rakeback sólido del 55%'
    ],
    cons: [
      'Software puede ser lento en horas pico',
      'Proceso de retiro puede demorar',
      'Menos enfoque en high stakes'
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
    shortDescription: 'Experiencia móvil optimizada',
    rating: 4.6,
    totalReviews: 1823,
    activePlayers: '750',
    badge: 'MEJOR APP',
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
      logo: '/images/rooms/pppoker-logo.jpg'  // ✅ Logo PPPOKER
    },
    bonus: {
      welcome: {
        amount: 1200,
        currency: 'USD',
        percentage: 100,
        maxBonus: 1200,
        description: 'Bono móvil del 100% hasta $1200 + 7 giros diarios'
      },
      deposit: {
        percentage: 58,
        maxAmount: 400,
        minDeposit: 10
      },
      reload: {
        percentage: 25,
        frequency: 'daily'
      },
      specialOffers: [
        '7 giros diarios en ruleta móvil',
        'Misiones diarias con premios en efectivo',
        'Programa VIP con beneficios exclusivos',
        'Bono mensual de hasta $1,200'
      ]
    },
    rakeback: {
      percentage: 58,
      type: 'vip-based',
      tiers: [
        {
          level: 'VIP 1',
          percentage: 25,
          requirements: 'Registro'
        },
        {
          level: 'VIP 2',
          percentage: 35,
          requirements: '100 puntos VIP'
        },
        {
          level: 'VIP 3',
          percentage: 48,
          requirements: '500 puntos VIP'
        },
        {
          level: 'VIP 4',
          percentage: 58,
          requirements: '2000 puntos VIP'
        }
      ],
      frequency: 'instant',
      description: 'Sistema VIP con rakeback hasta 58%'
    },
    features: [
      {
        id: 'f1',
        icon: 'Smartphone',
        title: 'Mejor App',
        description: 'Diseñado exclusivamente para móviles',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'Zap',
        title: 'Mobile First',
        description: 'Experiencia optimizada para dispositivos móviles',
        highlighted: true
      },
      {
        id: 'f3',
        icon: 'Clock',
        title: 'MTT Diarios',
        description: 'Torneos multi-mesa comenzando cada hora',
        highlighted: true
      },
      {
        id: 'f4',
        icon: 'Users',
        title: 'Clubs',
        description: 'Sistema de clubs y comunidades privadas',
        highlighted: false
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
      totalPlayers: 24567,
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
      'Rakeback competitivo hasta 58%'
    ],
    cons: [
      'Enfocado principalmente en móvil',
      'Menos variedad de juegos que otras salas',
      'Límites más conservadores'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z'
  },
  {
    id: 'wpt',
    name: 'WPT',
    slug: 'wpt',
    logo: '♦',
    color: 'blue',
    gradientColors: {
      from: 'from-blue-600',
      to: 'to-blue-800'
    },
    description: 'WPT Global trae la experiencia del World Poker Tour a tu casa. Juega donde juegan los profesionales y participa en satélites para los eventos más prestigiosos del poker mundial.',
    shortDescription: 'Mesas de alto nivel y profesionales',
    rating: 4.5,
    totalReviews: 2789,
    activePlayers: '1.1K',
    badge: 'CASH GAMES',
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
      logo: '/images/rooms/wpt-logo.jpg'  // ✅ Logo WPT
    },
    bonus: {
      welcome: {
        amount: 900,
        currency: 'USD',
        percentage: 100,
        maxBonus: 900,
        description: 'Bono profesional hasta $900 + 5 giros semanales'
      },
      deposit: {
        percentage: 45,
        maxAmount: 450,
        minDeposit: 25
      },
      reload: {
        percentage: 30,
        frequency: 'monthly'
      },
      specialOffers: [
        '5 giros semanales en ruleta premium',
        'Satélites para eventos WPT presenciales',
        'Mesas exclusivas con pros del WPT',
        'Bono mensual de hasta $900'
      ]
    },
    rakeback: {
      percentage: 45,
      type: 'fixed',
      frequency: 'weekly',
      description: '45% de rakeback + programa de recompensas WPT'
    },
    features: [
      {
        id: 'f1',
        icon: 'Trophy',
        title: 'Cash Premium',
        description: 'Mesas de cash game de alto nivel',
        highlighted: true
      },
      {
        id: 'f2',
        icon: 'DollarSign',
        title: 'High Stakes',
        description: 'Las mesas con límites más altos',
        highlighted: true
      },
      {
        id: 'f3',
        icon: 'Star',
        title: 'Eventos WPT',
        description: 'Satélites para el World Poker Tour',
        highlighted: true
      },
      {
        id: 'f4',
        icon: 'Crown',
        title: 'Profesional',
        description: 'Ambiente de poker profesional',
        highlighted: false
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
      totalPlayers: 32789,
      dailyTournaments: 89,
      tablesAvailable: 567,
      avgPotSize: 456,
      biggestWin: 250000,
      uptime: 99.95
    },
    pros: [
      'Prestigio de la marca WPT',
      'Mesas de cash games premium',
      'Satélites para eventos en vivo',
      'Software de última generación',
      'Ambiente profesional único'
    ],
    cons: [
      'Enfocado en jugadores experimentados',
      'Depósito mínimo más alto',
      'Menos promociones frecuentes'
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
  return roomsMockData.filter(room => room.featured).sort((a, b) => a.order - b.order);
};

export const getRoomsByCategory = (category: RoomCategory): Room[] => {
  // Lógica de categorización basada en características
  switch (category) {
    case RoomCategory.HIGH_RAKEBACK:
      return roomsMockData.filter(room => room.rakeback.percentage >= 50);
    case RoomCategory.POPULAR:
      return roomsMockData.filter(room => parseInt(room.activePlayers.replace(/[^0-9]/g, '')) > 1000);
    case RoomCategory.PREMIUM:
      return roomsMockData.filter(room => room.rating >= 4.7);
    default:
      return roomsMockData;
  }
};