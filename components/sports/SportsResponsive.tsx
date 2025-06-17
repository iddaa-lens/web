"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { SportsModal } from './SportsModal';
import { Sports } from './Sports';
import { SportsProps, defaultSports } from './types';

export function SportsResponsive(props: SportsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSports = props.selectedSports || [];
  const sports = props.sports || defaultSports;
  
  const getFilterButtonText = () => {
    if (selectedSports.length === 0 || selectedSports.includes('all')) {
      return { icon: '🏆', text: 'Tüm Sporlar' };
    } else if (selectedSports.length === 1) {
      const sport = sports.find(s => s.id === selectedSports[0]);
      return { icon: sport?.icon || '🏆', text: sport?.name || 'Spor Seç' };
    } else {
      const icons = selectedSports.slice(0, 2).map(id => {
        const sport = sports.find(s => s.id === id);
        return sport?.icon || '';
      }).join('');
      return { icon: icons, text: `${selectedSports.length} spor seçildi` };
    }
  };

  const buttonInfo = getFilterButtonText();
  
  // Get total counts for the button display
  const getTotalCounts = () => {
    if (selectedSports.includes('all') || selectedSports.length === 0) {
      const allSport = sports.find(s => s.id === 'all');
      return {
        count: allSport?.count || sports.reduce((sum, s) => sum + (s.count || 0), 0),
        predictions: allSport?.predictions || sports.reduce((sum, s) => sum + (s.predictions || 0), 0)
      };
    } else if (selectedSports.length === 1) {
      const sport = sports.find(s => s.id === selectedSports[0]);
      return {
        count: sport?.count || 0,
        predictions: sport?.predictions || 0
      };
    } else {
      // Multiple sports - sum them up
      return selectedSports.reduce((totals, id) => {
        const sport = sports.find(s => s.id === id);
        return {
          count: totals.count + (sport?.count || 0),
          predictions: totals.predictions + (sport?.predictions || 0)
        };
      }, { count: 0, predictions: 0 });
    }
  };

  const totals = getTotalCounts();

  return (
    <>
      {/* Desktop view - always rendered but hidden on mobile via CSS */}
      <div className="hidden md:block">
        <Sports {...props} />
      </div>

      {/* Mobile view - always rendered but hidden on desktop via CSS */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <span className="text-lg">{buttonInfo.icon}</span>
          <span>{buttonInfo.text}</span>
          <div className="flex flex-col items-start ml-1">
            {props.showCounts && totals.count > 0 && (
              <span className="text-[10px] opacity-75 leading-tight">
                {totals.count} maç
              </span>
            )}
            {props.showPredictions && totals.predictions > 0 && (
              <span className="text-[10px] opacity-75 leading-tight">
                {totals.predictions} tahmin
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </Button>
      </div>

      <SportsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sports={sports}
        selectedSports={selectedSports}
        onSportsSelect={props.onSportsSelect || (() => {})}
        showCounts={props.showCounts}
        showPredictions={props.showPredictions}
        showHotBadge={props.showHotBadge}
      />
    </>
  );
}