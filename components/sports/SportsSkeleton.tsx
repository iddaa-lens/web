import { Skeleton } from '../ui/Skeleton';

interface SportsSkeletonProps {
  variant?: 'grid' | 'list' | 'compact' | 'carousel';
  count?: number;
  columns?: number | { sm: number; md: number; lg: number };
}

export function SportsSkeleton({ 
  variant = 'grid', 
  count = 7,
  columns = { sm: 2, md: 3, lg: 4 }
}: SportsSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {items.map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  if (variant === 'carousel') {
    return (
      <div className="flex gap-4 overflow-hidden">
        {items.map((i) => (
          <Skeleton key={i} className="h-32 w-28 flex-shrink-0 rounded-lg" />
        ))}
      </div>
    );
  }

  // Grid variant
  const gridCols = typeof columns === 'number' 
    ? `grid-cols-${columns}` 
    : `grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  return (
    <div className={`grid ${gridCols} gap-4`} data-testid="sports-skeleton">
      {items.map((i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  );
}