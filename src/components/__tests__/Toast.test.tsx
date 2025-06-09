import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders toast with message', () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Toast message="Test" variant="success" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-green-500');
    
    rerender(<Toast message="Test" variant="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-500');
    
    rerender(<Toast message="Test" variant="warning" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-500');
    
    rerender(<Toast message="Test" variant="info" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-500');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" onClose={onClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after duration', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" duration={3000} onClose={onClose} />);
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto-close when duration is 0', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" duration={0} onClose={onClose} />);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-toast';
    render(<Toast message="Test" className={customClass} />);
    expect(screen.getByRole('alert')).toHaveClass(customClass);
  });

  it('renders without close button when closeable is false', () => {
    render(<Toast message="Test" closeable={false} />);
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('renders icon based on variant', () => {
    const { rerender } = render(<Toast message="Test" variant="success" />);
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    
    rerender(<Toast message="Test" variant="error" />);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    
    rerender(<Toast message="Test" variant="warning" />);
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
    
    rerender(<Toast message="Test" variant="info" />);
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });
}); 