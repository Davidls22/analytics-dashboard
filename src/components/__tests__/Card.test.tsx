import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders card with title and content', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(
      <Card 
        title="Test Card"
        subtitle="Card subtitle"
      >
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card subtitle')).toBeInTheDocument();
  });

  it('renders with header actions', () => {
    render(
      <Card 
        title="Test Card"
        headerActions={<button>Action</button>}
      >
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(
      <Card 
        title="Test Card"
        footer={<div>Footer content</div>}
      >
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-card';
    render(
      <Card 
        title="Test Card"
        className={customClass}
      >
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByRole('article')).toHaveClass(customClass);
  });

  it('applies variant classes', () => {
    const { rerender } = render(
      <Card 
        title="Test Card"
        variant="elevated"
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('article')).toHaveClass('shadow-lg');
    
    rerender(
      <Card 
        title="Test Card"
        variant="outlined"
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('article')).toHaveClass('border');
    
    rerender(
      <Card 
        title="Test Card"
        variant="flat"
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('article')).toHaveClass('bg-gray-50');
  });

  it('applies padding classes', () => {
    const { rerender } = render(
      <Card 
        title="Test Card"
        padding="none"
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('article')).toHaveClass('p-0');
    
    rerender(
      <Card 
        title="Test Card"
        padding="sm"
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('article')).toHaveClass('p-2');
    
    rerender(
      <Card 
        title="Test Card"
        padding="md"
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('article')).toHaveClass('p-4');
    
    rerender(
      <Card 
        title="Test Card"
        padding="lg"
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('article')).toHaveClass('p-6');
  });
}); 