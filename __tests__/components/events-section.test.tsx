import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventsSection } from '@/components/events-section';
import { mockEvents } from '@/components/events/mockData';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('EventsSection', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('renders section heading and view all button', () => {
    render(
      <EventsSection 
        events={mockEvents}
        selectedSports={['all']}
      />
    );

    expect(screen.getByText('Maçlar')).toBeInTheDocument();
    expect(screen.getByText('Tümünü gör')).toBeInTheDocument();
  });

  it('navigates to events page when view all is clicked', () => {
    render(
      <EventsSection 
        events={mockEvents}
        selectedSports={['all']}
      />
    );

    const viewAllButton = screen.getByText('Tümünü gör');
    fireEvent.click(viewAllButton);

    expect(mockPush).toHaveBeenCalledWith('/events');
  });

  it('renders events with correct props', () => {
    render(
      <EventsSection 
        events={mockEvents}
        selectedSports={['football']}
        maxItems={3}
      />
    );

    // Check if events are rendered (by checking for team names)
    // Use getAllByText since team names appear multiple times
    const galatasarayElements = screen.getAllByText('Galatasaray');
    expect(galatasarayElements.length).toBeGreaterThan(0);
    
    const fenerbahceElements = screen.getAllByText('Fenerbahçe');
    expect(fenerbahceElements.length).toBeGreaterThan(0);
  });

  it('navigates to event detail when event is clicked', () => {
    render(
      <EventsSection 
        events={mockEvents}
        selectedSports={['all']}
      />
    );

    // Click on first event - get all elements with Galatasaray and click the first one
    const galatasarayElements = screen.getAllByText('Galatasaray');
    fireEvent.click(galatasarayElements[0]);

    expect(mockPush).toHaveBeenCalledWith('/events/1');
  });

  it('applies responsive text sizes', () => {
    render(
      <EventsSection 
        events={mockEvents}
        selectedSports={['all']}
      />
    );

    const heading = screen.getByText('Maçlar').closest('h2');
    expect(heading).toHaveClass('text-base', 'sm:text-lg');

    const viewAllButton = screen.getByText('Tümünü gör');
    expect(viewAllButton).toHaveClass('text-xs', 'sm:text-sm');
  });
});