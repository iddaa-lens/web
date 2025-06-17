import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventsFilters } from '@/components/events/EventsFilters';
import { League } from '@/components/events/types';

const mockLeagues: League[] = [
  { id: 'tr-super', name: 'Süper Lig', country: 'Türkiye' },
  { id: 'eng-premier', name: 'Premier League', country: 'İngiltere' },
  { id: 'es-laliga', name: 'La Liga', country: 'İspanya' }
];

describe('EventsFilters', () => {
  const mockOnLeaguesChange = jest.fn();
  const mockOnTimeRangeChange = jest.fn();
  const mockOnLiveOnlyChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter options', () => {
    render(
      <EventsFilters
        selectedLeagues={[]}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByPlaceholderText('Takım veya lig ara...')).toBeInTheDocument();
    expect(screen.getByText('Bugün')).toBeInTheDocument();
    expect(screen.getByText('Yarın')).toBeInTheDocument();
    expect(screen.getByText('Bu Hafta')).toBeInTheDocument();
    expect(screen.getByText('Tümü')).toBeInTheDocument();
    expect(screen.getByText('Canlı')).toBeInTheDocument();
    expect(screen.getByText('Ligler')).toBeInTheDocument();
  });

  it('handles search input', () => {
    render(
      <EventsFilters
        selectedLeagues={[]}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText('Takım veya lig ara...');
    fireEvent.change(searchInput, { target: { value: 'Galatasaray' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('Galatasaray');
  });

  it('handles time range selection', () => {
    render(
      <EventsFilters
        selectedLeagues={[]}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    fireEvent.click(screen.getByText('Bugün'));
    expect(mockOnTimeRangeChange).toHaveBeenCalledWith('today');

    fireEvent.click(screen.getByText('Yarın'));
    expect(mockOnTimeRangeChange).toHaveBeenCalledWith('tomorrow');
  });

  it('handles live only toggle', () => {
    render(
      <EventsFilters
        selectedLeagues={[]}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    fireEvent.click(screen.getByText('Canlı'));
    expect(mockOnLiveOnlyChange).toHaveBeenCalledWith(true);
  });

  it('shows and hides league filter dropdown', () => {
    render(
      <EventsFilters
        selectedLeagues={[]}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    // Initially hidden
    expect(screen.queryByText('Lig Filtresi')).not.toBeInTheDocument();

    // Show dropdown
    fireEvent.click(screen.getByText('Ligler'));
    expect(screen.getByText('Lig Filtresi')).toBeInTheDocument();
    expect(screen.getByText('Süper Lig')).toBeInTheDocument();
    expect(screen.getByText('Premier League')).toBeInTheDocument();
  });

  it('handles league selection', () => {
    render(
      <EventsFilters
        selectedLeagues={[]}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByText('Ligler'));

    // Select a league
    const superLigCheckbox = screen.getByRole('checkbox', { name: /Süper Lig/i });
    fireEvent.click(superLigCheckbox);

    expect(mockOnLeaguesChange).toHaveBeenCalledWith(['tr-super']);
  });

  it('shows selected leagues count', () => {
    render(
      <EventsFilters
        selectedLeagues={['tr-super', 'eng-premier']}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Badge showing count
  });

  it('clears all leagues', () => {
    render(
      <EventsFilters
        selectedLeagues={['tr-super', 'eng-premier']}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByText('Ligler'));

    // Clear all
    fireEvent.click(screen.getByText('Temizle'));
    expect(mockOnLeaguesChange).toHaveBeenCalledWith([]);
  });

  it('shows active filters summary', () => {
    render(
      <EventsFilters
        selectedLeagues={['tr-super']}
        selectedTimeRange="today"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('1 lig seçili')).toBeInTheDocument();
  });

  it('clears search when X is clicked', () => {
    render(
      <EventsFilters
        selectedLeagues={[]}
        selectedTimeRange="all"
        showLiveOnly={false}
        availableLeagues={mockLeagues}
        onLeaguesChange={mockOnLeaguesChange}
        onTimeRangeChange={mockOnTimeRangeChange}
        onLiveOnlyChange={mockOnLiveOnlyChange}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText('Takım veya lig ara...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Click the X button
    const clearButton = searchInput.parentElement?.querySelector('button');
    fireEvent.click(clearButton!);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});