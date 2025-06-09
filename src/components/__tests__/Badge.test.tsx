import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders badge with text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Badge variant="primary">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('bg-blue-500');
    
    rerender(<Badge variant="success">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('bg-green-500');
    
    rerender(<Badge variant="warning">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('bg-yellow-500');
    
    rerender(<Badge variant="error">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('bg-red-500');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Badge size="sm">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('text-xs px-2 py-0.5');
    
    rerender(<Badge size="md">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('text-sm px-2.5 py-0.5');
    
    rerender(<Badge size="lg">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('text-base px-3 py-1');
  });

  it('applies custom className', () => {
    const customClass = 'custom-badge';
    render(<Badge className={customClass}>Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass(customClass);
  });

  it('renders with icon when provided', () => {
    const Icon = () => <span data-testid="test-icon">🔔</span>;
    render(<Badge icon={<Icon />}>Test</Badge>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies pill style when rounded is true', () => {
    render(<Badge rounded>Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('rounded-full');
  });

  it('applies outline style when outlined is true', () => {
    render(<Badge outlined>Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('border-2 bg-transparent');
  });

  it('applies dot style when dot is true', () => {
    render(<Badge dot>Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('w-2 h-2 p-0');
  });
}); 