"use client";

import { Event, ResponsiveColumns } from './types';
import { EventCard } from './EventCard';

interface EventsGridProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onOddsClick?: (event: Event, market: string) => void;
  showOdds?: boolean;
  showPredictions?: boolean;
  showLeague?: boolean;
  showTime?: boolean;
  showStats?: boolean;
  columns?: ResponsiveColumns;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export function EventsGrid({
  events,
  onEventClick,
  onOddsClick,
  showOdds = true,
  showPredictions = true,
  showLeague = true,
  showTime = true,
  showStats = false,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  spacing = 'normal',
  className = '',
}: EventsGridProps) {
  const spacingClasses = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-6',
  };

  const gridClasses = `
    grid
    grid-cols-${columns.mobile || 1}
    md:grid-cols-${columns.tablet || 2}
    lg:grid-cols-${columns.desktop || 3}
    ${spacingClasses[spacing]}
  `;

  return (
    <div className={`${gridClasses} ${className}`}>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onClick={onEventClick}
          onOddsClick={onOddsClick}
          showOdds={showOdds}
          showPredictions={showPredictions}
          showLeague={showLeague}
          showTime={showTime}
          showStats={showStats}
          variant="grid"
        />
      ))}
    </div>
  );
}