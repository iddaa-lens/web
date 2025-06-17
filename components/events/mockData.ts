import { Event } from './types';

export const mockEvents: Event[] = [
  {
    id: '1',
    sport: { id: 'football', name: 'Futbol', icon: '⚽' },
    league: {
      id: 'tr-super',
      name: 'Süper Lig',
      country: 'Türkiye'
    },
    homeTeam: {
      id: 'gal',
      name: 'Galatasaray',
      logo: 'https://media.api-sports.io/football/teams/645.png'
    },
    awayTeam: {
      id: 'fb',
      name: 'Fenerbahçe',
      logo: 'https://media.api-sports.io/football/teams/611.png'
    },
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: true,
    predictions: [
      {
        id: 'p1',
        type: 'win',
        value: 'Ev Sahibi',
        confidence: 85,
        odds: 2.10
      },
      {
        id: 'p2',
        type: 'over',
        value: '2.5 Üst',
        confidence: 78,
        odds: 1.85
      },
      {
        id: 'p3',
        type: 'both_teams_score',
        value: 'KG Var',
        confidence: 92,
        odds: 1.65
      }
    ],
    odds: {
      match: {
        home: 2.10,
        draw: 3.40,
        away: 3.20
      },
      overUnder: {
        over: 1.85,
        under: 2.05,
        line: 2.5
      },
      bothTeamsScore: {
        yes: 1.65,
        no: 2.20
      }
    }
  },
  {
    id: '2',
    sport: { id: 'football', name: 'Futbol', icon: '⚽' },
    league: {
      id: 'tr-super',
      name: 'Süper Lig',
      country: 'Türkiye'
    },
    homeTeam: {
      id: 'bjk',
      name: 'Beşiktaş',
      logo: 'https://media.api-sports.io/football/teams/610.png'
    },
    awayTeam: {
      id: 'ts',
      name: 'Trabzonspor',
      logo: 'https://media.api-sports.io/football/teams/643.png'
    },
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: true,
    predictions: [
      {
        id: 'p4',
        type: 'draw',
        value: 'Beraberlik',
        confidence: 72,
        odds: 3.20
      },
      {
        id: 'p5',
        type: 'under',
        value: '2.5 Alt',
        confidence: 68,
        odds: 2.05
      }
    ],
    odds: {
      match: {
        home: 2.40,
        draw: 3.20,
        away: 2.90
      },
      overUnder: {
        over: 1.95,
        under: 1.85,
        line: 2.5
      }
    }
  },
  {
    id: '3',
    sport: { id: 'football', name: 'Futbol', icon: '⚽' },
    league: {
      id: 'es-laliga',
      name: 'La Liga',
      country: 'İspanya'
    },
    homeTeam: {
      id: 'rm',
      name: 'Real Madrid',
      logo: 'https://media.api-sports.io/football/teams/541.png'
    },
    awayTeam: {
      id: 'fcb',
      name: 'Barcelona',
      logo: 'https://media.api-sports.io/football/teams/529.png'
    },
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Started 30 minutes ago
    status: 'live',
    isLive: true,
    minute: 32,
    score: {
      home: 1,
      away: 1
    },
    hasAIPredictions: true,
    predictions: [
      {
        id: 'p6',
        type: 'win',
        value: 'Deplasman',
        confidence: 65,
        odds: 2.85
      }
    ],
    odds: {
      match: {
        home: 2.60,
        draw: 3.40,
        away: 2.85
      }
    },
    stats: {
      possession: { home: 48, away: 52 },
      shots: { home: 8, away: 11 },
      shotsOnTarget: { home: 3, away: 5 },
      corners: { home: 3, away: 5 },
      fouls: { home: 7, away: 9 },
      yellowCards: { home: 1, away: 2 },
      redCards: { home: 0, away: 0 }
    }
  },
  {
    id: '4',
    sport: { id: 'basketball', name: 'Basketbol', icon: '🏀' },
    league: {
      id: 'euroleague',
      name: 'EuroLeague',
      country: 'Avrupa'
    },
    homeTeam: {
      id: 'efes',
      name: 'Anadolu Efes',
    },
    awayTeam: {
      id: 'fener',
      name: 'Fenerbahçe Beko',
    },
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: true,
    predictions: [
      {
        id: 'p7',
        type: 'over',
        value: '165.5 Üst',
        confidence: 88,
        odds: 1.90
      },
      {
        id: 'p8',
        type: 'win',
        value: 'Ev Sahibi -3.5',
        confidence: 75,
        odds: 1.95
      },
      {
        id: 'p9',
        type: 'custom',
        value: 'İlk Yarı Ev Sahibi',
        confidence: 82,
        odds: 2.20
      },
      {
        id: 'p10',
        type: 'custom',
        value: 'Toplam Üçlük 25.5 Üst',
        confidence: 79,
        odds: 1.85
      }
    ],
    odds: {
      match: {
        home: 1.45,
        draw: 18.00,
        away: 2.75
      },
      overUnder: {
        over: 1.90,
        under: 1.90,
        line: 165.5
      }
    }
  },
  {
    id: '5',
    sport: { id: 'tennis', name: 'Tenis', icon: '🎾' },
    league: {
      id: 'wimbledon',
      name: 'Wimbledon',
      country: 'İngiltere'
    },
    homeTeam: {
      id: 'djokovic',
      name: 'N. Djokovic',
    },
    awayTeam: {
      id: 'alcaraz',
      name: 'C. Alcaraz',
    },
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: true,
    predictions: [
      {
        id: 'p13',
        type: 'win',
        value: 'Djokovic',
        confidence: 78,
        odds: 1.75
      },
      {
        id: 'p14',
        type: 'custom',
        value: 'Toplam Set 3.5 Üst',
        confidence: 82,
        odds: 1.90
      }
    ],
    odds: {
      match: {
        home: 1.75,
        draw: 0, // Tennis doesn't have draws
        away: 2.10
      }
    }
  },
  {
    id: '6',
    sport: { id: 'football', name: 'Futbol', icon: '⚽' },
    league: {
      id: 'tr-super',
      name: 'Süper Lig',
      country: 'Türkiye'
    },
    homeTeam: {
      id: 'ank',
      name: 'Ankaragücü',
      logo: 'https://media.api-sports.io/football/teams/625.png'
    },
    awayTeam: {
      id: 'kon',
      name: 'Konyaspor',
      logo: 'https://media.api-sports.io/football/teams/607.png'
    },
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: true,
    predictions: [
      {
        id: 'p11',
        type: 'under',
        value: '2.5 Alt',
        confidence: 91,
        odds: 1.70
      }
    ],
    odds: {
      match: {
        home: 2.75,
        draw: 3.10,
        away: 2.60
      },
      overUnder: {
        over: 2.10,
        under: 1.70,
        line: 2.5
      },
      bothTeamsScore: {
        yes: 1.95,
        no: 1.85
      }
    }
  },
  {
    id: '7',
    sport: { id: 'football', name: 'Futbol', icon: '⚽' },
    league: {
      id: 'eng-premier',
      name: 'Premier League',
      country: 'İngiltere'
    },
    homeTeam: {
      id: 'mci',
      name: 'Manchester City',
      logo: 'https://media.api-sports.io/football/teams/50.png'
    },
    awayTeam: {
      id: 'ars',
      name: 'Arsenal',
      logo: 'https://media.api-sports.io/football/teams/42.png'
    },
    startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Started 60 minutes ago
    status: 'live',
    isLive: true,
    minute: 67,
    score: {
      home: 2,
      away: 2
    },
    hasAIPredictions: true,
    predictions: [
      {
        id: 'p12',
        type: 'over',
        value: '3.5 Üst',
        confidence: 85,
        odds: 2.20
      }
    ],
    odds: {
      match: {
        home: 1.95,
        draw: 3.80,
        away: 4.20
      },
      overUnder: {
        over: 2.20,
        under: 1.65,
        line: 3.5
      }
    },
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 15, away: 12 },
      shotsOnTarget: { home: 6, away: 5 },
      corners: { home: 7, away: 4 },
      fouls: { home: 9, away: 11 },
      yellowCards: { home: 2, away: 3 },
      redCards: { home: 0, away: 0 }
    }
  }
];