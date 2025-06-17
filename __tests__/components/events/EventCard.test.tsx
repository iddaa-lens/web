import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from '@/components/events/EventCard';
import { Event } from '@/components/events/types';

const mockEvent: Event = {
  id: '1',
  sport: { id: 'football', name: 'Futbol', icon: '⚽' },
  league: {
    id: 'tr-super',
    name: 'Süper Lig',
    country: 'Türkiye'
  },
  homeTeam: {
    id: 'gal',
    name: 'Galatasaray',
    logo: 'https://example.com/gal.png'
  },
  awayTeam: {
    id: 'fb',
    name: 'Fenerbahçe',
    logo: 'https://example.com/fb.png'
  },
  startTime: new Date('2024-01-20T19:00:00').toISOString(),
  status: 'scheduled',
  isLive: false,
  hasAIPredictions: true,
  predictions: [
    {
      id: 'p1',
      type: 'win',
      value: 'Ev Sahibi',
      confidence: 85,
      odds: 2.10
    }
  ],
  odds: {
    match: {
      home: 2.10,
      draw: 3.40,
      away: 3.20
    }
  }
};

const mockLiveEvent: Event = {
  ...mockEvent,
  id: '2',
  isLive: true,
  status: 'live',
  minute: 45,
  score: {
    home: 1,
    away: 0
  }
};

const mockTennisEvent: Event = {
  ...mockEvent,
  id: '3',
  sport: { id: 'tennis', name: 'Tenis', icon: '🎾' },
  odds: {
    match: {
      home: 1.75,
      draw: 0, // Tennis doesn't have draws
      away: 2.10
    }
  }
};

describe('EventCard', () => {
  const mockOnClick = jest.fn();
  const mockOnOddsClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders event information correctly', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getAllByText('Galatasaray')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Fenerbahçe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Süper Lig')[0]).toBeInTheDocument();
    expect(screen.getAllByText('vs')[0]).toBeInTheDocument();
  });

  it('displays live indicator for live events', () => {
    render(
      <EventCard 
        event={mockLiveEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getAllByText('45\'')[0]).toBeInTheDocument();
    expect(screen.getAllByText('1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('0')[0]).toBeInTheDocument();
    expect(screen.queryByText('vs')).not.toBeInTheDocument();
  });

  it('handles click events', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    const teamButton = screen.getAllByText('Galatasaray')[0].closest('button');
    fireEvent.click(teamButton!);
    expect(mockOnClick).toHaveBeenCalledWith(mockEvent);
  });

  it('displays odds correctly', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
        showOdds={true}
      />
    );

    expect(screen.getAllByText('2.10')[0]).toBeInTheDocument();
    expect(screen.getAllByText('3.40')[0]).toBeInTheDocument();
    expect(screen.getAllByText('3.20')[0]).toBeInTheDocument();
  });

  it('hides draw odds for tennis', () => {
    render(
      <EventCard 
        event={mockTennisEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
        showOdds={true}
      />
    );

    expect(screen.getAllByText('1.75')[0]).toBeInTheDocument();
    // We check both 2.10 values exist (one for away odds in match odds)
    const allOdds = screen.getAllByText('2.10');
    expect(allOdds.length).toBeGreaterThan(0);
    expect(screen.queryByText('0.00')).not.toBeInTheDocument();
  });

  it('handles odds click events', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
        showOdds={true}
      />
    );

    const homeOddsButton = screen.getAllByText('2.10')[0];
    fireEvent.click(homeOddsButton);
    expect(mockOnOddsClick).toHaveBeenCalledWith(mockEvent, 'match');
  });

  it('displays AI predictions badge', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
        showPredictions={true}
      />
    );

    expect(screen.getAllByText('1')[0]).toBeInTheDocument(); // Number of predictions
  });

  it('hides elements based on props', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onClick={mockOnClick}
        onOddsClick={mockOnOddsClick}
        showLeague={false}
        showTime={false}
        showOdds={false}
        showPredictions={false}
      />
    );

    expect(screen.queryByText('Süper Lig')).not.toBeInTheDocument();
    expect(screen.queryByText('19:00')).not.toBeInTheDocument();
    expect(screen.queryByText('2.10')).not.toBeInTheDocument();
  });
});