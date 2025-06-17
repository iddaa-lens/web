// Sport related types
export interface Sport {
  id: string;
  name: string;
  icon: string;
}

// Team related types
export interface Team {
  id: string;
  name: string;
  logo?: string;
}

// League related types
export interface League {
  id: string;
  name: string;
  country?: string;
}

// Score related types
export interface Score {
  home: number;
  away: number;
}

// Odds related types
export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

export interface OverUnderOdds {
  over: number;
  under: number;
  line?: number; // e.g., 2.5, 3.5
}

export interface OddsData {
  match?: MatchOdds;
  overUnder?: OverUnderOdds;
  bothTeamsScore?: {
    yes: number;
    no: number;
  };
  doubleChance?: {
    homeOrDraw: number;
    homeOrAway: number;
    drawOrAway: number;
  };
}

// Event statistics
export interface EventStats {
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
}

// Event status
export type EventStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';

// Time range for filtering
export type TimeRange = 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'all';

// Responsive columns configuration
export interface ResponsiveColumns {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

// AI Prediction types (keeping from previous implementation)
export interface Prediction {
  id: string;
  type: 'win' | 'draw' | 'loss' | 'over' | 'under' | 'both_teams_score' | 'custom';
  value: string;
  confidence: number; // 0-100
  odds?: number;
}

// Main Event interface
export interface Event {
  id: string;
  sport: Sport;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  startTime: Date | string;
  status: EventStatus;
  score?: Score;
  odds?: OddsData;
  stats?: EventStats;
  isLive: boolean;
  minute?: number;
  predictions?: Prediction[];
  hasAIPredictions?: boolean;
}

// Props interfaces
export interface EventsProps {
  // Data source
  events?: Event[];
  fetchFromAPI?: boolean;
  apiEndpoint?: string;

  // Filtering
  selectedSports?: string[];
  selectedLeagues?: string[];
  selectedTimeRange?: TimeRange;
  showLiveOnly?: boolean;

  // Display options
  variant?: 'grid' | 'list' | 'compact';
  showOdds?: boolean;
  showLeague?: boolean;
  showTime?: boolean;
  showStats?: boolean;
  showPredictions?: boolean;

  // Layout
  columns?: ResponsiveColumns;
  spacing?: 'tight' | 'normal' | 'loose';
  maxItems?: number;

  // Callbacks
  onEventClick?: (event: Event) => void;
  onOddsClick?: (event: Event, market: string) => void;

  // Loading/Error
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;

  // Additional
  className?: string;
  emptyMessage?: string;
  showFilters?: boolean;
}

export interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  onOddsClick?: (event: Event, market: string) => void;
  showOdds?: boolean;
  showPredictions?: boolean;
  showLeague?: boolean;
  showTime?: boolean;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'detailed' | 'grid';
  className?: string;
}

export interface LiveIndicatorProps {
  minute?: number;
  status?: EventStatus;
  className?: string;
}

export interface OddsDisplayProps {
  odds: OddsData;
  eventId: string;
  onOddsClick?: (eventId: string, market: string, selection: string) => void;
  variant?: 'compact' | 'full';
  showLabels?: boolean;
  className?: string;
}

export interface EventsFiltersProps {
  selectedLeagues: string[];
  selectedTimeRange: TimeRange;
  showLiveOnly: boolean;
  availableLeagues: League[];
  onLeaguesChange: (leagues: string[]) => void;
  onTimeRangeChange: (range: TimeRange) => void;
  onLiveOnlyChange: (liveOnly: boolean) => void;
  onSearch?: (query: string) => void;
  className?: string;
}