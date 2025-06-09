import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input label="Username" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'john' } });
    
    expect(handleChange).toHaveBeenCalledWith('john');
  });

  it('applies error state', () => {
    const error = 'Invalid input';
    render(<Input label="Username" error={error} />);
    
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toHaveClass('border-red-500');
  });

  it('applies disabled state', () => {
    render(<Input label="Username" disabled />);
    expect(screen.getByLabelText('Username')).toBeDisabled();
    expect(screen.getByLabelText('Username')).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('applies placeholder text', () => {
    const placeholder = 'Enter your username';
    render(<Input label="Username" placeholder={placeholder} />);
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-input';
    render(<Input label="Username" className={customClass} />);
    expect(screen.getByLabelText('Username')).toHaveClass(customClass);
  });

  it('renders helper text when provided', () => {
    const helperText = 'Username must be at least 3 characters';
    render(<Input label="Username" helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('renders required indicator when required', () => {
    render(<Input label="Username" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies type attribute', () => {
    render(<Input label="Password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });
}); 