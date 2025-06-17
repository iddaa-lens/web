"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SportCategory } from './types';
import { SportButton } from './SportButton';
import { Button } from '../ui/Button';

interface SportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sports: SportCategory[];
  selectedSports: string[];
  onSportsSelect: (sportIds: string[]) => void;
  showCounts?: boolean;
  showPredictions?: boolean;
  showHotBadge?: boolean;
}

export function SportsModal({
  isOpen,
  onClose,
  sports,
  selectedSports,
  onSportsSelect,
  showCounts = true,
  showPredictions = false,
  showHotBadge = true,
}: SportsModalProps) {
  // Local state for multi-select
  const [tempSelection, setTempSelection] = useState<string[]>([]);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelection(selectedSports.length > 0 ? selectedSports : ['all']);
    }
  }, [isOpen, selectedSports]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSportSelect = (sportId: string) => {
    let newSelection: string[];

    if (sportId === 'all') {
      newSelection = ['all'];
    } else {
      const filteredSelection = tempSelection.filter(id => id !== 'all');
      
      if (tempSelection.includes(sportId)) {
        newSelection = filteredSelection.filter(id => id !== sportId);
      } else {
        newSelection = [...filteredSelection, sportId];
      }

      if (newSelection.length === 0) {
        newSelection = ['all'];
      }
      
      const allSportIds = sports.filter(s => s.id !== 'all').map(s => s.id);
      if (newSelection.length === allSportIds.length && 
          allSportIds.every(id => newSelection.includes(id))) {
        newSelection = ['all'];
      }
    }

    setTempSelection(newSelection);
  };

  const handleApply = () => {
    onSportsSelect(tempSelection);
    onClose();
  };

  const isSelected = (sportId: string): boolean => {
    return tempSelection.includes(sportId);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-950 rounded-t-2xl max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Spor Seç</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Sports List */}
        <div className="px-4 py-2 overflow-y-auto max-h-[calc(80vh-60px)]">
          <div className="space-y-2">
            {sports.map((sport) => (
              <SportButton
                key={sport.id}
                sport={sport}
                isSelected={isSelected(sport.id)}
                onClick={handleSportSelect}
                showCount={showCounts}
                showPredictions={showPredictions}
                showHotBadge={showHotBadge}
                variant="list"
              />
            ))}
          </div>
        </div>
        
        {/* Apply button */}
        {
          <div className="sticky bottom-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-4">
            <Button
              onClick={handleApply}
              variant="primary"
              fullWidth
              disabled={tempSelection.length === 0}
            >
              Uygula ({tempSelection.includes('all') ? 'Tümü' : `${tempSelection.length} spor`})
            </Button>
          </div>
        }
      </div>
    </>
  );
}