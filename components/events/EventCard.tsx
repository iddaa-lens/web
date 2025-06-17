"use client";

import Image from 'next/image';
import { Clock, Brain, MoreHorizontal } from 'lucide-react';
import { EventCardProps } from './types';
import { LiveIndicator } from './LiveIndicator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function EventCard({
  event,
  onClick,
  onOddsClick,
  showOdds = true,
  showPredictions = true,
  showLeague = true,
  showTime = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showStats = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'default',
  className = '',
}: EventCardProps) {
  const handleClick = () => onClick?.(event);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOddsClick = (_eventId: string, market: string, _selection: string) => {
    onOddsClick?.(event, market);
  };

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Mobile layout
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <button onClick={handleClick} className="w-full text-left space-y-2">
          {/* Top row: League and Time */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            {showLeague ? (
              <span>{event.league.name}</span>
            ) : (
              <div />
            )}
            {showTime && (
              event.isLive ? (
                <LiveIndicator minute={event.minute} status={event.status} />
              ) : (
                <span>{formatTime(event.startTime)}</span>
              )
            )}
          </div>

          {/* Teams and Score */}
          <div className="flex items-center justify-between gap-2">
            {/* Home Team */}
            <div className="flex items-center gap-1.5 flex-1">
              {event.homeTeam.logo && (
                <Image 
                  src={event.homeTeam.logo} 
                  alt="" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4" 
                />
              )}
              <span className="text-sm font-medium truncate">
                {event.homeTeam.name}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1 text-center px-2">
              {event.isLive && event.score ? (
                <>
                  <span className="text-sm font-bold">{event.score.home}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-sm font-bold">{event.score.away}</span>
                </>
              ) : (
                <span className="text-xs text-gray-400">vs</span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <span className="text-sm font-medium truncate text-right">
                {event.awayTeam.name}
              </span>
              {event.awayTeam.logo && (
                <Image 
                  src={event.awayTeam.logo} 
                  alt="" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4" 
                />
              )}
            </div>
          </div>
        </button>

        {/* Odds and Predictions Row */}
        {(showOdds || showPredictions) && (
          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {/* Odds */}
            {showOdds && event.odds?.match && (
              <div className="flex items-center gap-1">
                <Button
                  variant="odds"
                  size="odds"
                  onClick={() => handleOddsClick(event.id, 'match', 'home')}
                  className="min-w-[40px] text-[11px] px-1"
                >
                  {event.odds.match.home.toFixed(2)}
                </Button>
                {event.odds.match.draw > 0 && (
                  <Button
                    variant="odds"
                    size="odds"
                    onClick={() => handleOddsClick(event.id, 'match', 'draw')}
                    className="min-w-[40px] text-[11px] px-1"
                  >
                    {event.odds.match.draw.toFixed(2)}
                  </Button>
                )}
                <Button
                  variant="odds"
                  size="odds"
                  onClick={() => handleOddsClick(event.id, 'match', 'away')}
                  className="min-w-[40px] text-[11px] px-1"
                >
                  {event.odds.match.away.toFixed(2)}
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Show more odds for', event.id);
                  }}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* AI Predictions */}
            {showPredictions && event.hasAIPredictions && event.predictions && (
              <Badge variant="secondary" size="sm" className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span className="text-xs">{event.predictions.length}</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div
        className={`
          hidden md:flex w-full items-center gap-2 px-2 sm:px-3 py-2 
          bg-white dark:bg-gray-800 rounded-lg
          border border-gray-200 dark:border-gray-700
          hover:border-iddaa-green-500 dark:hover:border-iddaa-green-400
          transition-colors ${className}
        `}
      >
        {/* League */}
        <div className="w-28 flex-shrink-0">
          {showLeague ? (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
              {event.league.name}
            </span>
          ) : (
            <div className="w-full" /> // Placeholder to maintain alignment
          )}
        </div>

        {/* Teams and Score Section */}
        <button
          onClick={handleClick}
          className="flex-1 flex items-center gap-3 text-left"
        >
          {/* Home Team */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {event.homeTeam.name}
            </span>
            {event.homeTeam.logo && (
              <Image 
                src={event.homeTeam.logo} 
                alt="" 
                width={20} 
                height={20} 
                className="w-5 h-5 flex-shrink-0" 
              />
            )}
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-1 text-center min-w-[50px]">
            {event.isLive && event.score ? (
              <>
                <span className="text-sm font-bold">{event.score.home}</span>
                <span className="text-gray-400">-</span>
                <span className="text-sm font-bold">{event.score.away}</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">vs</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2 flex-1">
            {event.awayTeam.logo && (
              <Image 
                src={event.awayTeam.logo} 
                alt="" 
                width={20} 
                height={20} 
                className="w-5 h-5 flex-shrink-0" 
              />
            )}
            <span className="text-sm font-medium truncate max-w-[120px]">
              {event.awayTeam.name}
            </span>
          </div>
        </button>

        {/* Time/Live */}
        <div className="w-16 flex items-center justify-center">
          {showTime ? (
            event.isLive ? (
              <LiveIndicator minute={event.minute} status={event.status} />
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatTime(event.startTime)}</span>
              </div>
            )
          ) : (
            <div className="w-full" /> // Placeholder to maintain alignment
          )}
        </div>

        {/* Odds */}
        {showOdds && (
          <div className="flex items-center gap-1 min-w-[200px] justify-end">
            {event.odds?.match ? (
              <>
                <Button
                  variant="odds"
                  size="odds"
                  onClick={() => handleOddsClick(event.id, 'match', 'home')}
                  className="min-w-[45px] text-xs"
                >
                  {event.odds.match.home.toFixed(2)}
                </Button>
                {event.odds.match.draw > 0 && (
                  <Button
                    variant="odds"
                    size="odds"
                    onClick={() => handleOddsClick(event.id, 'match', 'draw')}
                    className="min-w-[45px] text-xs"
                  >
                    {event.odds.match.draw.toFixed(2)}
                  </Button>
                )}
                <Button
                  variant="odds"
                  size="odds"
                  onClick={() => handleOddsClick(event.id, 'match', 'away')}
                  className="min-w-[45px] text-xs"
                >
                  {event.odds.match.away.toFixed(2)}
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  className="ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Show more odds for', event.id);
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="min-w-[200px]" /> // Placeholder to maintain alignment
            )}
          </div>
        )}

        {/* AI Predictions */}
        {showPredictions && (
          <div className="min-w-[60px] flex justify-end">
            {event.hasAIPredictions && event.predictions ? (
              <Badge variant="secondary" size="sm" className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span className="text-xs">{event.predictions.length}</span>
              </Badge>
            ) : (
              <div className="w-full" /> // Placeholder to maintain alignment
            )}
          </div>
        )}
      </div>
    </>
  );
}