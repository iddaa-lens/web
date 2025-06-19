import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentSections } from '@/components/content-sections';
import { mockEvents } from '@/components/events';
import { mockAIPredictions } from '@/components/ai-predictions';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ContentSections', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders both events and predictions sections', () => {
    render(
      <ContentSections 
        events={mockEvents}
        predictions={mockAIPredictions}
        selectedSports={['all']}
      />
    );

    // Check for both section headings
    expect(screen.getByText('Maçlar')).toBeInTheDocument();
    expect(screen.getByText('AI Tahminleri')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    const { container } = render(
      <ContentSections 
        events={mockEvents}
        predictions={mockAIPredictions}
        selectedSports={['all']}
      />
    );

    // Check for main container classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'pb-12');

    // Check for grid layout
    const gridContainer = mainContainer?.firstChild;
    expect(gridContainer).toHaveClass('grid', 'lg:grid-cols-3', 'gap-8');
  });

  it('renders events section in larger column', () => {
    const { container } = render(
      <ContentSections 
        events={mockEvents}
        predictions={mockAIPredictions}
        selectedSports={['all']}
      />
    );

    // Find the events section container
    const eventsContainer = container.querySelector('.lg\\:col-span-2');
    expect(eventsContainer).toBeInTheDocument();
    
    // Verify it contains the events section
    expect(eventsContainer?.textContent).toContain('Maçlar');
  });

  it('passes selectedSports to events section', () => {
    render(
      <ContentSections 
        events={mockEvents}
        predictions={mockAIPredictions}
        selectedSports={['football', 'basketball']}
      />
    );

    // Events should be rendered (component will filter based on selectedSports)
    expect(screen.getByText('Maçlar')).toBeInTheDocument();
  });

  it('renders on mobile with stacked layout', () => {
    const { container } = render(
      <ContentSections 
        events={mockEvents}
        predictions={mockAIPredictions}
        selectedSports={['all']}
      />
    );

    // Grid should not have fixed columns on mobile (lg:grid-cols-3 only applies on large screens)
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid', 'lg:grid-cols-3');
    
    // Both sections should be present
    expect(screen.getByText('Maçlar')).toBeInTheDocument();
    expect(screen.getByText('AI Tahminleri')).toBeInTheDocument();
  });
});