import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { SportsModal } from '@/components/sports/SportsModal';
import { SportCategory } from '@/components/sports/types';

const mockSports: SportCategory[] = [
  { id: 'all', name: 'Tümü', icon: '🏆', count: 100 },
  { id: 'football', name: 'Futbol', icon: '⚽', count: 50 },
  { id: 'basketball', name: 'Basketbol', icon: '🏀', count: 30 },
];

describe('SportsModal Component', () => {
  beforeEach(() => {
    // Reset body overflow style
    document.body.style.overflow = 'unset';
  });

  it('renders nothing when isOpen is false', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    const { container } = render(
      <SportsModal
        isOpen={false}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Spor Seç')).toBeInTheDocument();
    expect(screen.getByText('Tümü')).toBeInTheDocument();
    expect(screen.getByText('Futbol')).toBeInTheDocument();
    expect(screen.getByText('Basketbol')).toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    // Find and click the backdrop (first div with opacity class)
    const backdrop = document.querySelector('.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when X button is clicked', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('prevents body scroll when modal is open', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when modal closes', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    const { rerender } = render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <SportsModal
        isOpen={false}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('shows Apply button with correct count', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['football', 'basketball']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Uygula (2 spor)')).toBeInTheDocument();
  });

  it('shows "Tümü" in Apply button when all is selected', () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Uygula (Tümü)')).toBeInTheDocument();
  });

  it('updates selection when sport is clicked', async () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    // Click on Futbol
    fireEvent.click(screen.getByText('Futbol'));
    
    // Click Apply
    fireEvent.click(screen.getByText('Uygula (1 spor)'));
    
    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith(['football']);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles selection and apply correctly', async () => {
    const mockOnClose = jest.fn();
    const mockOnSelect = jest.fn();
    
    render(
      <SportsModal
        isOpen={true}
        onClose={mockOnClose}
        sports={mockSports}
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    // Initially should show "Tümü" in Apply button
    expect(screen.getByText('Uygula (Tümü)')).toBeInTheDocument();
    
    // Click on Futbol to deselect "all" and select football
    fireEvent.click(screen.getByText('Futbol'));
    
    // Click Apply - the component will handle the state internally
    const applyButton = screen.getByRole('button', { name: /Uygula/i });
    fireEvent.click(applyButton);
    
    // Verify the callback was called with the correct selection
    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalled();
      const lastCall = mockOnSelect.mock.calls[mockOnSelect.mock.calls.length - 1];
      expect(lastCall[0]).toContain('football');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});