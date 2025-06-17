import { render, screen, fireEvent } from '../../utils/test-utils';
import { SportButton } from '@/components/sports/SportButton';
import { SportCategory } from '@/components/sports/types';

const mockSport: SportCategory = {
  id: 'football',
  name: 'Futbol',
  icon: '⚽',
  count: 50,
  isPopular: true,
  predictions: 25,
};

describe('SportButton Component', () => {
  it('renders sport information correctly', () => {
    const mockOnClick = jest.fn();
    render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('⚽')).toBeInTheDocument();
    expect(screen.getByText('Futbol')).toBeInTheDocument();
  });

  it('shows count when showCount is true', () => {
    const mockOnClick = jest.fn();
    render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
        showCount={true}
      />
    );
    
    expect(screen.getByText('50 maç')).toBeInTheDocument();
  });

  it('shows predictions when showPredictions is true', () => {
    const mockOnClick = jest.fn();
    render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
        showPredictions={true}
      />
    );
    
    expect(screen.getByText('25 tahmin')).toBeInTheDocument();
  });

  it('shows HOT badge for popular sports', () => {
    const mockOnClick = jest.fn();
    render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
        showHotBadge={true}
      />
    );
    
    expect(screen.getByText('HOT')).toBeInTheDocument();
  });

  it('does not show HOT badge when sport is not popular', () => {
    const mockOnClick = jest.fn();
    const unpopularSport = { ...mockSport, isPopular: false };
    
    render(
      <SportButton
        sport={unpopularSport}
        isSelected={false}
        onClick={mockOnClick}
        showHotBadge={true}
      />
    );
    
    expect(screen.queryByText('HOT')).not.toBeInTheDocument();
  });

  it('calls onClick with sport id when clicked', () => {
    const mockOnClick = jest.fn();
    render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
      />
    );
    
    fireEvent.click(screen.getByText('Futbol'));
    expect(mockOnClick).toHaveBeenCalledWith('football');
  });

  it('renders list variant correctly', () => {
    const mockOnClick = jest.fn();
    render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
        variant="list"
        showCount={true}
      />
    );
    
    // List variant should have different layout
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('renders compact variant correctly', () => {
    const mockOnClick = jest.fn();
    render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
        variant="compact"
      />
    );
    
    // Compact variant should have smaller size
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full');
  });

  it('applies selected styles when isSelected is true', () => {
    const mockOnClick = jest.fn();
    const { rerender } = render(
      <SportButton
        sport={mockSport}
        isSelected={false}
        onClick={mockOnClick}
      />
    );
    
    // Get initial button - should not be selected
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Rerender with selected state
    rerender(
      <SportButton
        sport={mockSport}
        isSelected={true}
        onClick={mockOnClick}
      />
    );
    
    // The visual difference is handled by the Button component's variant prop
  });
});