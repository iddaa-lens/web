"use client";

import { OddsDisplayProps } from './types';
import { Button } from '../ui/Button';

export function OddsDisplay({
  odds,
  eventId,
  onOddsClick,
  variant = 'compact',
  showLabels = false,
  className = '',
}: OddsDisplayProps) {
  const handleClick = (market: string, selection: string) => {
    onOddsClick?.(eventId, market, selection);
  };

  if (variant === 'compact' && odds.match) {
    return (
      <div className={`flex gap-1.5 ${className}`}>
        <Button
          variant="odds"
          size="odds"
          onClick={() => handleClick('match', 'home')}
          className="rounded font-medium"
        >
          {showLabels && <span className="text-[10px] opacity-75">1</span>}
          {odds.match.home.toFixed(2)}
        </Button>
        <Button
          variant="odds"
          size="odds"
          onClick={() => handleClick('match', 'draw')}
          className="rounded font-medium"
        >
          {showLabels && <span className="text-[10px] opacity-75">X</span>}
          {odds.match.draw.toFixed(2)}
        </Button>
        <Button
          variant="odds"
          size="odds"
          onClick={() => handleClick('match', 'away')}
          className="rounded font-medium"
        >
          {showLabels && <span className="text-[10px] opacity-75">2</span>}
          {odds.match.away.toFixed(2)}
        </Button>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-3 ${className}`}>
      {odds.match && (
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Maç Sonucu
          </h4>
          <div className="flex gap-2">
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('match', 'home')}
              className="flex-1 flex flex-col"
            >
              <span className="text-[10px] opacity-75">Ev Sahibi</span>
              <span className="font-semibold">{odds.match.home.toFixed(2)}</span>
            </Button>
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('match', 'draw')}
              className="flex-1 flex flex-col"
            >
              <span className="text-[10px] opacity-75">Beraberlik</span>
              <span className="font-semibold">{odds.match.draw.toFixed(2)}</span>
            </Button>
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('match', 'away')}
              className="flex-1 flex flex-col"
            >
              <span className="text-[10px] opacity-75">Deplasman</span>
              <span className="font-semibold">{odds.match.away.toFixed(2)}</span>
            </Button>
          </div>
        </div>
      )}

      {odds.overUnder && (
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Alt/Üst {odds.overUnder.line || 2.5}
          </h4>
          <div className="flex gap-2">
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('overUnder', 'under')}
              className="flex-1"
            >
              <span className="text-[10px] opacity-75 mr-1">Alt</span>
              {odds.overUnder.under.toFixed(2)}
            </Button>
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('overUnder', 'over')}
              className="flex-1"
            >
              <span className="text-[10px] opacity-75 mr-1">Üst</span>
              {odds.overUnder.over.toFixed(2)}
            </Button>
          </div>
        </div>
      )}

      {odds.bothTeamsScore && (
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Karşılıklı Gol
          </h4>
          <div className="flex gap-2">
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('bothTeamsScore', 'yes')}
              className="flex-1"
            >
              <span className="text-[10px] opacity-75 mr-1">Var</span>
              {odds.bothTeamsScore.yes.toFixed(2)}
            </Button>
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('bothTeamsScore', 'no')}
              className="flex-1"
            >
              <span className="text-[10px] opacity-75 mr-1">Yok</span>
              {odds.bothTeamsScore.no.toFixed(2)}
            </Button>
          </div>
        </div>
      )}

      {odds.doubleChance && (
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Çifte Şans
          </h4>
          <div className="flex gap-2">
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('doubleChance', 'homeOrDraw')}
              className="flex-1"
            >
              <span className="text-[10px] opacity-75 mr-1">1X</span>
              {odds.doubleChance.homeOrDraw.toFixed(2)}
            </Button>
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('doubleChance', 'homeOrAway')}
              className="flex-1"
            >
              <span className="text-[10px] opacity-75 mr-1">12</span>
              {odds.doubleChance.homeOrAway.toFixed(2)}
            </Button>
            <Button
              variant="odds"
              size="sm"
              onClick={() => handleClick('doubleChance', 'drawOrAway')}
              className="flex-1"
            >
              <span className="text-[10px] opacity-75 mr-1">X2</span>
              {odds.doubleChance.drawOrAway.toFixed(2)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}