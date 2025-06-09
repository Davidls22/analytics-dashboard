import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../Navbar';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('Navbar', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders logo and navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('navigates to dashboard when logo is clicked', () => {
    render(<Navbar />);
    
    fireEvent.click(screen.getByText('Analytics Dashboard'));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('navigates to events page when events link is clicked', () => {
    render(<Navbar />);
    
    fireEvent.click(screen.getByText('Events'));
    expect(mockRouter.push).toHaveBeenCalledWith('/events');
  });

  it('navigates to settings page when settings link is clicked', () => {
    render(<Navbar />);
    
    fireEvent.click(screen.getByText('Settings'));
    expect(mockRouter.push).toHaveBeenCalledWith('/settings');
  });

  it('renders user menu when user is logged in', () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    render(<Navbar user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders login button when user is not logged in', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
}); 