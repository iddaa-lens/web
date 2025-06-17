import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OddsDisplay } from '@/components/events/OddsDisplay';
import { OddsData } from '@/components/events/types';

const mockOdds: OddsData = {
  match: {
    home: 2.10,
    draw: 3.40,
    away: 3.20
  },
  overUnder: {
    over: 1.85,
    under: 2.05,
    line: 2.5
  },
  bothTeamsScore: {
    yes: 1.65,
    no: 2.20
  },
  doubleChance: {
    homeOrDraw: 1.30,
    homeOrAway: 1.25,
    drawOrAway: 1.60
  }
};

describe('OddsDisplay', () => {
  const mockOnOddsClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders compact variant with match odds', () => {
    render(
      <OddsDisplay
        odds={mockOdds}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="compact"
      />
    );

    expect(screen.getByText('2.10')).toBeInTheDocument();
    expect(screen.getByText('3.40')).toBeInTheDocument();
    expect(screen.getByText('3.20')).toBeInTheDocument();
  });

  it('renders full variant with all odds types', () => {
    render(
      <OddsDisplay
        odds={mockOdds}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="full"
      />
    );

    // Match odds
    expect(screen.getByText('Maç Sonucu')).toBeInTheDocument();
    expect(screen.getByText('Ev Sahibi')).toBeInTheDocument();
    expect(screen.getByText('Beraberlik')).toBeInTheDocument();
    expect(screen.getByText('Deplasman')).toBeInTheDocument();

    // Over/Under
    expect(screen.getByText('Alt/Üst 2.5')).toBeInTheDocument();
    expect(screen.getByText('1.85')).toBeInTheDocument();
    expect(screen.getByText('2.05')).toBeInTheDocument();

    // Both teams score
    expect(screen.getByText('Karşılıklı Gol')).toBeInTheDocument();
    expect(screen.getByText('1.65')).toBeInTheDocument();
    expect(screen.getByText('2.20')).toBeInTheDocument();

    // Double chance
    expect(screen.getByText('Çifte Şans')).toBeInTheDocument();
    expect(screen.getByText('1.30')).toBeInTheDocument();
  });

  it('handles odds click for match result', () => {
    render(
      <OddsDisplay
        odds={mockOdds}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="compact"
      />
    );

    fireEvent.click(screen.getByText('2.10'));
    expect(mockOnOddsClick).toHaveBeenCalledWith('1', 'match', 'home');

    fireEvent.click(screen.getByText('3.40'));
    expect(mockOnOddsClick).toHaveBeenCalledWith('1', 'match', 'draw');

    fireEvent.click(screen.getByText('3.20'));
    expect(mockOnOddsClick).toHaveBeenCalledWith('1', 'match', 'away');
  });

  it('handles odds click for over/under in full variant', () => {
    render(
      <OddsDisplay
        odds={mockOdds}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="full"
      />
    );

    const overButton = screen.getAllByText('1.85')[0]; // First one is over
    fireEvent.click(overButton);
    expect(mockOnOddsClick).toHaveBeenCalledWith('1', 'overUnder', 'over');
  });

  it('shows labels when showLabels is true', () => {
    render(
      <OddsDisplay
        odds={mockOdds}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="compact"
        showLabels={true}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles missing odds gracefully', () => {
    const partialOdds: OddsData = {
      match: {
        home: 1.50,
        draw: 0,
        away: 2.30
      }
    };

    render(
      <OddsDisplay
        odds={partialOdds}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="full"
      />
    );

    expect(screen.getByText('1.50')).toBeInTheDocument();
    expect(screen.queryByText('Alt/Üst')).not.toBeInTheDocument();
    expect(screen.queryByText('Karşılıklı Gol')).not.toBeInTheDocument();
  });

  it('formats odds to 2 decimal places', () => {
    const oddsWithDecimals: OddsData = {
      match: {
        home: 2.123456,
        draw: 3.456789,
        away: 3.234567
      }
    };

    render(
      <OddsDisplay
        odds={oddsWithDecimals}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="compact"
      />
    );

    expect(screen.getByText('2.12')).toBeInTheDocument();
    expect(screen.getByText('3.46')).toBeInTheDocument();
    expect(screen.getByText('3.23')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <OddsDisplay
        odds={mockOdds}
        eventId="1"
        onOddsClick={mockOnOddsClick}
        variant="compact"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});