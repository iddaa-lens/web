"use client";

import { Event } from './types';
import { EventCard } from './EventCard';

interface EventsListProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onOddsClick?: (event: Event, market: string) => void;
  showOdds?: boolean;
  showPredictions?: boolean;
  showLeague?: boolean;
  showTime?: boolean;
  showStats?: boolean;
  variant?: 'default' | 'compact';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export function EventsList({
  events,
  onEventClick,
  onOddsClick,
  showOdds = true,
  showPredictions = true,
  showLeague = true,
  showTime = true,
  showStats = false,
  variant = 'default',
  spacing = 'normal',
  className = '',
}: EventsListProps) {
  const spacingClasses = {
    tight: 'space-y-2',
    normal: 'space-y-3',
    loose: 'space-y-4',
  };

  const cardVariant = variant === 'compact' ? 'compact' : 'default';

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
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
          variant={cardVariant}
        />
      ))}
    </div>
  );
}