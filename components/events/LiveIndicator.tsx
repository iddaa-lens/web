"use client";

import { LiveIndicatorProps } from './types';

export function LiveIndicator({ minute, className = '' }: LiveIndicatorProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" />
        <div className="w-2 h-2 bg-red-500 rounded-full" />
      </div>
      {minute !== undefined && (
        <span className="text-xs font-semibold text-red-500">{minute}&apos;</span>
      )}
    </div>
  );
}