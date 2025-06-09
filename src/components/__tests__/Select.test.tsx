import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';

describe('Select', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ];

  it('renders select with label', () => {
    render(<Select label="Category" options={mockOptions} />);
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select label="Category" options={mockOptions} />);
    
    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(
      <Select 
        label="Category" 
        options={mockOptions}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByLabelText('Category');
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('applies error state', () => {
    const error = 'Please select an option';
    render(
      <Select 
        label="Category" 
        options={mockOptions}
        error={error}
      />
    );
    
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toHaveClass('border-red-500');
  });

  it('applies disabled state', () => {
    render(
      <Select 
        label="Category" 
        options={mockOptions}
        disabled
      />
    );
    
    expect(screen.getByLabelText('Category')).toBeDisabled();
    expect(screen.getByLabelText('Category')).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('applies placeholder text', () => {
    const placeholder = 'Select an option';
    render(
      <Select 
        label="Category" 
        options={mockOptions}
        placeholder={placeholder}
      />
    );
    
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-select';
    render(
      <Select 
        label="Category" 
        options={mockOptions}
        className={customClass}
      />
    );
    
    expect(screen.getByLabelText('Category')).toHaveClass(customClass);
  });

  it('renders helper text when provided', () => {
    const helperText = 'Select a category from the list';
    render(
      <Select 
        label="Category" 
        options={mockOptions}
        helperText={helperText}
      />
    );
    
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('renders required indicator when required', () => {
    render(
      <Select 
        label="Category" 
        options={mockOptions}
        required
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });
}); 