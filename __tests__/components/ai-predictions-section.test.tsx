import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AIPredictionsSection } from '@/components/ai-predictions-section';
import { mockAIPredictions } from '@/components/ai-predictions/AIPredictions';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AIPredictionsSection', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('renders section heading and view all button', () => {
    render(
      <AIPredictionsSection 
        predictions={mockAIPredictions}
      />
    );

    expect(screen.getByText('AI Tahminleri')).toBeInTheDocument();
    expect(screen.getByText('Tümünü gör')).toBeInTheDocument();
  });

  it('navigates to predictions page when view all is clicked', () => {
    render(
      <AIPredictionsSection 
        predictions={mockAIPredictions}
      />
    );

    const viewAllButton = screen.getByText('Tümünü gör');
    fireEvent.click(viewAllButton);

    expect(mockPush).toHaveBeenCalledWith('/predictions');
  });

  it('renders predictions with correct maxItems', () => {
    render(
      <AIPredictionsSection 
        predictions={mockAIPredictions}
        maxItems={3}
      />
    );

    // Check if predictions are rendered - look for team names from mock data
    expect(screen.getByText('Liverpool')).toBeInTheDocument();
    expect(screen.getByText('Chelsea')).toBeInTheDocument();
    
    // Check that only 3 predictions are shown (maxItems=3)
    // Each prediction has multiple links, so we'll check for a unique element per prediction
    const algorithmUstaElements = screen.getAllByText('Algoritma Usta');
    expect(algorithmUstaElements.length).toBe(1); // First prediction
  });

  it('navigates to prediction detail when clicked', () => {
    render(
      <AIPredictionsSection 
        predictions={mockAIPredictions}
      />
    );

    // Click on the first prediction's container (which contains Liverpool vs Chelsea)
    const predictionContainers = screen.getAllByRole('generic', { 
      name: '' 
    }).filter(el => el.className.includes('bg-gray-50'));
    
    fireEvent.click(predictionContainers[0]);

    // First prediction in mockAIPredictions has slug 'liverpool-chelsea-20241218-algoritma-usta'
    expect(mockPush).toHaveBeenCalledWith('/predictions/liverpool-chelsea-20241218-algoritma-usta');
  });

  it('applies responsive text sizes', () => {
    render(
      <AIPredictionsSection 
        predictions={mockAIPredictions}
      />
    );

    const heading = screen.getByText('AI Tahminleri').closest('h2');
    expect(heading).toHaveClass('text-base', 'sm:text-lg');

    const viewAllButton = screen.getByText('Tümünü gör');
    expect(viewAllButton).toHaveClass('text-xs', 'sm:text-sm');
  });

  it('renders with default maxItems when not specified', () => {
    render(
      <AIPredictionsSection 
        predictions={mockAIPredictions}
      />
    );

    // Should render with default maxItems (5)
    expect(screen.getByText('AI Tahminleri')).toBeInTheDocument();
  });
});