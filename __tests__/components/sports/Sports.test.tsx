import { render, screen, fireEvent } from '../../utils/test-utils';
import { Sports } from '@/components/sports';
import { SportCategory } from '@/components/sports/types';

const mockSports: SportCategory[] = [
  { id: 'all', name: 'Tümü', icon: '🏆', count: 100, isPopular: true },
  { id: 'football', name: 'Futbol', icon: '⚽', count: 50, isPopular: true },
  { id: 'basketball', name: 'Basketbol', icon: '🏀', count: 30 },
  { id: 'tennis', name: 'Tenis', icon: '🎾', count: 20 },
];

describe('Sports Component', () => {
  it('renders all sports', () => {
    render(<Sports sports={mockSports} />);
    
    expect(screen.getByText('Tümü')).toBeInTheDocument();
    expect(screen.getByText('Futbol')).toBeInTheDocument();
    expect(screen.getByText('Basketbol')).toBeInTheDocument();
    expect(screen.getByText('Tenis')).toBeInTheDocument();
  });

  it('shows sport counts when showCounts is true', () => {
    render(<Sports sports={mockSports} showCounts={true} />);
    
    expect(screen.getByText('50 maç')).toBeInTheDocument();
    expect(screen.getByText('30 maç')).toBeInTheDocument();
  });

  it('does not show counts when showCounts is false', () => {
    render(<Sports sports={mockSports} showCounts={false} />);
    
    expect(screen.queryByText('50 maç')).not.toBeInTheDocument();
    expect(screen.queryByText('30 maç')).not.toBeInTheDocument();
  });

  it('calls onSportsSelect when a sport is clicked', () => {
    const mockOnSelect = jest.fn();
    render(
      <Sports 
        sports={mockSports} 
        selectedSports={['all']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Futbol'));
    expect(mockOnSelect).toHaveBeenCalledWith(['football']);
  });

  it('handles multi-selection correctly', () => {
    const mockOnSelect = jest.fn();
    render(
      <Sports 
        sports={mockSports} 
        selectedSports={['football']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Basketbol'));
    expect(mockOnSelect).toHaveBeenCalledWith(['football', 'basketball']);
  });

  it('selects only "all" when "Tümü" is clicked', () => {
    const mockOnSelect = jest.fn();
    render(
      <Sports 
        sports={mockSports} 
        selectedSports={['football', 'basketball']}
        onSportsSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Tümü'));
    expect(mockOnSelect).toHaveBeenCalledWith(['all']);
  });

  it('shows loading skeleton when loading', () => {
    render(<Sports loading={true} />);
    
    // SportsSkeleton should be rendered
    expect(screen.getByTestId('sports-skeleton')).toBeInTheDocument();
  });

  it('shows error state with retry button', () => {
    const mockRetry = jest.fn();
    render(
      <Sports 
        error={new Error('Failed to load')} 
        onRetry={mockRetry}
      />
    );
    
    expect(screen.getByText('Sporlar yüklenirken hata oluştu')).toBeInTheDocument();
    
    const retryButton = screen.getByText('Tekrar Dene');
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalled();
  });

  it('filters sports by popularity', () => {
    render(
      <Sports 
        sports={mockSports} 
        filterByPopular={true}
      />
    );
    
    expect(screen.getByText('Tümü')).toBeInTheDocument();
    expect(screen.getByText('Futbol')).toBeInTheDocument();
    expect(screen.queryByText('Basketbol')).not.toBeInTheDocument();
    expect(screen.queryByText('Tenis')).not.toBeInTheDocument();
  });

  it('shows empty message when no sports available', () => {
    render(<Sports sports={[]} emptyMessage="Hiç spor yok" showAllOption={false} />);
    
    expect(screen.getByText('Hiç spor yok')).toBeInTheDocument();
  });
});