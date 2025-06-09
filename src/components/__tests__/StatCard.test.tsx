import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renders title and value', () => {
    const title = 'Total Events';
    const value = '1,234';
    
    render(<StatCard title={title} value={value} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const Icon = () => <span data-testid="test-icon">📊</span>;
    
    render(
      <StatCard 
        title="Test Stat" 
        value="100"
        icon={<Icon />}
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders trend when provided', () => {
    const trend = '+15%';
    
    render(
      <StatCard 
        title="Test Stat" 
        value="100"
        trend={trend}
      />
    );
    
    expect(screen.getByText(trend)).toBeInTheDocument();
  });

  it('applies trend color class based on value', () => {
    const positiveTrend = '+15%';
    const negativeTrend = '-5%';
    
    const { rerender } = render(
      <StatCard 
        title="Test Stat" 
        value="100"
        trend={positiveTrend}
      />
    );
    
    expect(screen.getByText(positiveTrend)).toHaveClass('text-green-500');
    
    rerender(
      <StatCard 
        title="Test Stat" 
        value="100"
        trend={negativeTrend}
      />
    );
    
    expect(screen.getByText(negativeTrend)).toHaveClass('text-red-500');
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-class';
    render(
      <StatCard 
        title="Test Stat" 
        value="100"
        className={customClass}
      />
    );
    
    const container = screen.getByRole('article');
    expect(container).toHaveClass(customClass);
  });
}); 