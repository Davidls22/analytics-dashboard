import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from '../DateRangePicker';

describe('DateRangePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders date range picker with default values', () => {
    render(<DateRangePicker onChange={mockOnChange} />);
    
    // Check if date inputs are present
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });

  it('calls onChange when dates are selected', () => {
    render(<DateRangePicker onChange={mockOnChange} />);
    
    // Select start date
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2024-03-01' }
    });
    
    // Select end date
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2024-03-07' }
    });
    
    // Check if onChange was called with correct dates
    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: '2024-03-01',
      endDate: '2024-03-07'
    });
  });

  it('validates end date is after start date', () => {
    render(<DateRangePicker onChange={mockOnChange} />);
    
    // Select dates in wrong order
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2024-03-07' }
    });
    
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2024-03-01' }
    });
    
    // Check if error message is displayed
    expect(screen.getByText('End date must be after start date')).toBeInTheDocument();
    
    // Check if onChange was not called
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('clears error message when valid dates are selected', () => {
    render(<DateRangePicker onChange={mockOnChange} />);
    
    // Select dates in wrong order first
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2024-03-07' }
    });
    
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2024-03-01' }
    });
    
    // Then select valid dates
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2024-03-01' }
    });
    
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2024-03-07' }
    });
    
    // Check if error message is not displayed
    expect(screen.queryByText('End date must be after start date')).not.toBeInTheDocument();
  });
}); 