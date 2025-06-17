export interface SportCategory {
  id: string;
  name: string;
  icon: string;
  count?: number;
  isPopular?: boolean;
  predictions?: number;
  code?: string;
  slug?: string;
  liveCount?: number;
  upcomingCount?: number;
  eventsCount?: number;
  oddsCount?: number;
}

export interface SportsProps {
  // Display variants
  variant?: 'grid' | 'list' | 'compact' | 'carousel';
  
  // Data
  sports?: SportCategory[];
  
  // Selection behavior
  selectedSports?: string[];
  onSportsSelect?: (sportIds: string[]) => void;
  
  // Display options
  showCounts?: boolean;
  showPredictions?: boolean;
  showHotBadge?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
  
  // Layout
  columns?: number | { sm: number; md: number; lg: number };
  spacing?: 'tight' | 'normal' | 'loose';
  
  // Filtering
  filterByPopular?: boolean;
  filterByMinCount?: number;
  customFilter?: (sport: SportCategory) => boolean;
  
  // Styling
  className?: string;
  buttonClassName?: string;
  
  // Loading/Error states
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  
  // Empty state
  emptyMessage?: string;
}

export interface SportButtonProps {
  sport: SportCategory;
  isSelected: boolean;
  onClick: (sportId: string) => void;
  showCount?: boolean;
  showPredictions?: boolean;
  showHotBadge?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'list';
}

// Default sports data - will be replaced by API data later
export const defaultSports: SportCategory[] = [
  { id: "all", name: "Tümü", icon: "🏆", count: 2468, isPopular: true, predictions: 45 },
  { id: "football", name: "Futbol", icon: "⚽", count: 1247, isPopular: true, predictions: 38 },
  { id: "basketball", name: "Basketbol", icon: "🏀", count: 324, isPopular: true, predictions: 22 },
  { id: "tennis", name: "Tenis", icon: "🎾", count: 189, isPopular: true, predictions: 15 },
  { id: "volleyball", name: "Voleybol", icon: "🏐", count: 89, predictions: 12 },
  { id: "hockey", name: "Hokey", icon: "🏒", count: 76, predictions: 10 },
  { id: "esports", name: "E-Spor", icon: "🎮", count: 156, isPopular: true, predictions: 28 },
];