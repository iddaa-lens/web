import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Events } from '@/components/events/Events';
import { Event } from '@/components/events/types';

const mockEvents: Event[] = [
  {
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
    },
    awayTeam: {
      id: 'fb',
      name: 'Fenerbahçe',
    },
    startTime: new Date().toISOString(),
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: true,
    predictions: [],
    odds: {
      match: {
        home: 2.10,
        draw: 3.40,
        away: 3.20
      }
    }
  },
  {
    id: '2',
    sport: { id: 'basketball', name: 'Basketbol', icon: '🏀' },
    league: {
      id: 'euroleague',
      name: 'EuroLeague',
      country: 'Avrupa'
    },
    homeTeam: {
      id: 'efes',
      name: 'Anadolu Efes',
    },
    awayTeam: {
      id: 'fener',
      name: 'Fenerbahçe Beko',
    },
    startTime: new Date().toISOString(),
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: false,
    odds: {
      match: {
        home: 1.45,
        draw: 18.00,
        away: 2.75
      }
    }
  }
];

describe('Events', () => {
  const mockOnEventClick = jest.fn();
  const mockOnOddsClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders events list', () => {
    render(
      <Events 
        events={mockEvents}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getAllByText('Galatasaray')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Fenerbahçe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Anadolu Efes')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Fenerbahçe Beko')[0]).toBeInTheDocument();
  });

  it('filters events by sport', () => {
    render(
      <Events 
        events={mockEvents}
        selectedSports={['football']}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getAllByText('Galatasaray')[0]).toBeInTheDocument();
    expect(screen.queryByText('Anadolu Efes')).not.toBeInTheDocument();
  });

  it('shows all events when "all" is selected', () => {
    render(
      <Events 
        events={mockEvents}
        selectedSports={['all']}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getAllByText('Galatasaray')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Anadolu Efes')[0]).toBeInTheDocument();
  });

  it('shows filters when showFilters is true', () => {
    render(
      <Events 
        events={mockEvents}
        showFilters={true}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getByText('Maçlar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Takım veya lig ara...')).toBeInTheDocument();
    expect(screen.getByText('Bugün')).toBeInTheDocument();
    expect(screen.getByText('Canlı')).toBeInTheDocument();
  });

  it('hides filters when showFilters is false', () => {
    render(
      <Events 
        events={mockEvents}
        showFilters={false}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.queryByText('Maçlar')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Takım veya lig ara...')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <Events 
        events={[]}
        loading={true}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getByTestId('events-skeleton')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <Events 
        events={[]}
        error="Failed to load events"
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getByText('Failed to load events')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(
      <Events 
        events={[]}
        emptyMessage="No matches found"
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });

  it('switches between list and grid view', async () => {
    render(
      <Events 
        events={mockEvents}
        showFilters={true}
        variant="list"
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    const gridButton = screen.getByText('Izgara');
    fireEvent.click(gridButton);

    // The grid view should become active
    await waitFor(() => {
      // Check that the EventCard elements are rendered in grid mode
      const eventCards = screen.getAllByText('Galatasaray')[0].closest('[class*="grid"]');
      expect(eventCards).toBeInTheDocument();
    });
  });

  it('limits number of events with maxItems', () => {
    render(
      <Events 
        events={mockEvents}
        maxItems={1}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    expect(screen.getAllByText('Galatasaray')[0]).toBeInTheDocument();
    expect(screen.queryByText('Anadolu Efes')).not.toBeInTheDocument();
    expect(screen.getByText('Daha fazla göster (1 maç daha)')).toBeInTheDocument();
  });

  it('filters by time range', async () => {
    render(
      <Events 
        events={mockEvents}
        showFilters={true}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    const todayButton = screen.getByText('Bugün');
    fireEvent.click(todayButton);

    // The today filter should be applied
    await waitFor(() => {
      // Check that events are still visible (they are from today)
      expect(screen.getAllByText('Galatasaray')[0]).toBeInTheDocument();
    });
  });

  it('filters live events only', async () => {
    const eventsWithLive = [
      ...mockEvents,
      {
        ...mockEvents[0],
        id: '3',
        isLive: true,
        status: 'live' as const,
        minute: 45,
        score: { home: 1, away: 0 }
      }
    ];

    render(
      <Events 
        events={eventsWithLive}
        showFilters={true}
        onEventClick={mockOnEventClick}
        onOddsClick={mockOnOddsClick}
      />
    );

    const liveButton = screen.getByText('Canlı');
    fireEvent.click(liveButton);

    await waitFor(() => {
      expect(screen.queryByText('Anadolu Efes')).not.toBeInTheDocument();
    });
  });
});