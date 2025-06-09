import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-blue-500');
    
    rerender(<Button variant="secondary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-gray-500');
    
    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-red-500');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button size="sm">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('px-2 py-1 text-sm');
    
    rerender(<Button size="md">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('px-4 py-2 text-base');
    
    rerender(<Button size="lg">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('px-6 py-3 text-lg');
  });

  it('applies disabled state', () => {
    render(<Button disabled>Button</Button>);
    expect(screen.getByText('Button')).toBeDisabled();
    expect(screen.getByText('Button')).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('applies loading state', () => {
    render(<Button loading>Button</Button>);
    expect(screen.getByText('Button')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Button className={customClass}>Button</Button>);
    expect(screen.getByText('Button')).toHaveClass(customClass);
  });

  it('renders icon when provided', () => {
    const Icon = () => <span data-testid="test-icon">🔍</span>;
    render(<Button icon={<Icon />}>Button</Button>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
}); 