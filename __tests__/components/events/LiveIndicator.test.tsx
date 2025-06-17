import React from 'react';
import { render, screen } from '@testing-library/react';
import { LiveIndicator } from '@/components/events/LiveIndicator';

describe('LiveIndicator', () => {
  it('renders with minute', () => {
    render(<LiveIndicator minute={45} />);
    
    expect(screen.getByText('45\'')).toBeInTheDocument();
  });

  it('renders without minute', () => {
    const { container } = render(<LiveIndicator />);
    
    // Should have the pulsing dot
    const pulsingDot = container.querySelector('.animate-ping');
    expect(pulsingDot).toBeInTheDocument();
    
    // Should not have minute text
    expect(screen.queryByText(/\d+'/)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LiveIndicator minute={90} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with different minutes', () => {
    const { rerender } = render(<LiveIndicator minute={15} />);
    expect(screen.getByText('15\'')).toBeInTheDocument();
    
    rerender(<LiveIndicator minute={90} />);
    expect(screen.getByText('90\'')).toBeInTheDocument();
    
    rerender(<LiveIndicator minute={120} />);
    expect(screen.getByText('120\'')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<LiveIndicator minute={45} />);
    
    // Check for red color classes
    const minuteText = screen.getByText('45\'');
    expect(minuteText).toHaveClass('text-red-500');
    
    // Check for animation classes
    const animatedDot = container.querySelector('.animate-ping');
    expect(animatedDot).toHaveClass('bg-red-500');
  });
});