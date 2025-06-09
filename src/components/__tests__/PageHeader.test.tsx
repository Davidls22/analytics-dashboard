import { render, screen } from '@testing-library/react';
import { PageHeader } from '../PageHeader';

describe('PageHeader', () => {
  it('renders title and description', () => {
    const title = 'Test Page';
    const description = 'This is a test page';
    
    render(<PageHeader title={title} description={description} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <PageHeader title="Test Page" description="Test description">
        <button>Test Button</button>
      </PageHeader>
    );
    
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-class';
    render(
      <PageHeader 
        title="Test Page" 
        description="Test description"
        className={customClass}
      />
    );
    
    const container = screen.getByRole('banner');
    expect(container).toHaveClass(customClass);
  });

  it('renders without description when not provided', () => {
    render(<PageHeader title="Test Page" />);
    
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
}); 