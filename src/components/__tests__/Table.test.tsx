import { render, screen, fireEvent } from '@testing-library/react';
import { Table } from '../Table';

describe('Table', () => {
  const mockData = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
    { id: 3, name: 'Bob', age: 35 }
  ];

  const mockColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' }
  ];

  it('renders table with headers and data', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    // Check headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<Table columns={mockColumns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom empty state message', () => {
    const emptyMessage = 'No records found';
    render(
      <Table 
        columns={mockColumns} 
        data={[]} 
        emptyMessage={emptyMessage}
      />
    );
    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });

  it('handles row click when onRowClick is provided', () => {
    const onRowClick = jest.fn();
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
        onRowClick={onRowClick}
      />
    );
    
    fireEvent.click(screen.getByText('John').closest('tr')!);
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-table';
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
        className={customClass}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass(customClass);
  });

  it('renders loading state', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
}); 