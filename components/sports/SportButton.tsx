"use client";

import { SportButtonProps } from './types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Flame } from 'lucide-react';

export function SportButton({
  sport,
  isSelected,
  onClick,
  showCount = true,
  showPredictions = false,
  showHotBadge = true,
  className = '',
  variant = 'default',
}: SportButtonProps) {
  const handleClick = () => onClick(sport.id);

  if (variant === 'list') {
    return (
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between p-3 rounded-lg
          transition-colors hover:bg-gray-50 dark:hover:bg-gray-800
          ${isSelected ? 'bg-iddaa-green-50 dark:bg-iddaa-green-900/20 border-iddaa-green-500' : 'border-gray-200 dark:border-gray-700'}
          border ${className}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sport.icon}</span>
          <span className={`font-medium ${isSelected ? 'text-iddaa-green-600 dark:text-iddaa-green-400' : ''}`}>
            {sport.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(showCount || showPredictions) && (
            <div className="flex flex-col items-end text-xs">
              {showCount && sport.count && (
                <span className="text-gray-600 dark:text-gray-400">{sport.count} maç</span>
              )}
              {showPredictions && sport.predictions && (
                <span className="text-gray-500 dark:text-gray-500">{sport.predictions} tahmin</span>
              )}
            </div>
          )}
          {showHotBadge && sport.isPopular && (
            <Badge variant="destructive" size="sm">
              <Flame className="w-3 h-3" />
            </Badge>
          )}
        </div>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
          transition-colors ${isSelected 
            ? 'bg-iddaa-green-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${className}
        `}
      >
        <span>{sport.icon}</span>
        <span className="font-medium">{sport.name}</span>
        {showCount && sport.count && (
          <span className="text-xs opacity-75">({sport.count})</span>
        )}
      </button>
    );
  }

  // Default variant
  return (
    <Button
      variant={isSelected ? "sportSelected" : "sportDefault"}
      size="sport"
      className={`rounded-lg ${className}`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="text-2xl">{sport.icon}</span>
        <span className="text-xs font-medium">{sport.name}</span>
        <div className="flex flex-col items-center gap-0">
          {showCount && sport.count && (
            <span className="text-[10px] opacity-75 leading-tight">
              {sport.count} maç
            </span>
          )}
          {showPredictions && sport.predictions && (
            <span className="text-[10px] opacity-75 leading-tight">
              {sport.predictions} tahmin
            </span>
          )}
        </div>
      </div>
      {showHotBadge && sport.isPopular && (
        <div className="absolute -top-1 -right-1">
          <div className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Flame className="w-2.5 h-2.5" />
            HOT
          </div>
        </div>
      )}
    </Button>
  );
}