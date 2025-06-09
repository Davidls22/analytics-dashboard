import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../Tabs';

describe('Tabs', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' }
  ];

  it('renders all tabs', () => {
    render(<Tabs tabs={mockTabs} />);
    
    mockTabs.forEach(tab => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('shows first tab content by default', () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('shows selected tab content when tab is clicked', () => {
    render(<Tabs tabs={mockTabs} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('calls onChange when tab is clicked', () => {
    const onChange = jest.fn();
    render(<Tabs tabs={mockTabs} onChange={onChange} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('applies active styles to selected tab', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');
    
    expect(tab1).toHaveClass('border-blue-500');
    expect(tab2).not.toHaveClass('border-blue-500');
    
    fireEvent.click(tab2);
    expect(tab1).not.toHaveClass('border-blue-500');
    expect(tab2).toHaveClass('border-blue-500');
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-tabs';
    render(<Tabs tabs={mockTabs} className={customClass} />);
    expect(screen.getByRole('tablist')).toHaveClass(customClass);
  });

  it('renders with custom tab renderer', () => {
    const renderTab = (tab: typeof mockTabs[0]) => (
      <div data-testid={`custom-tab-${tab.id}`}>{tab.label}</div>
    );
    
    render(<Tabs tabs={mockTabs} renderTab={renderTab} />);
    
    mockTabs.forEach(tab => {
      expect(screen.getByTestId(`custom-tab-${tab.id}`)).toBeInTheDocument();
    });
  });

  it('renders with custom content renderer', () => {
    const renderContent = (tab: typeof mockTabs[0]) => (
      <div data-testid={`custom-content-${tab.id}`}>{tab.content}</div>
    );
    
    render(<Tabs tabs={mockTabs} renderContent={renderContent} />);
    
    expect(screen.getByTestId('custom-content-tab1')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Tabs tabs={mockTabs} variant="pills" />);
    expect(screen.getByRole('tablist')).toHaveClass('bg-gray-100 rounded-lg p-1');
    
    rerender(<Tabs tabs={mockTabs} variant="underline" />);
    expect(screen.getByRole('tablist')).toHaveClass('border-b border-gray-200');
  });
}); 