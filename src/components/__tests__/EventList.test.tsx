import { render, screen } from '@testing-library/react';
import { EventList } from '../EventList';
import { getRecentEvents } from '@/lib/metrics';

jest.mock('@/lib/metrics');

describe('EventList', () => {
  const mockEvents = [
    {
      id: '1',
      type: 'page_view',
      tenantId: 'tenant1',
      timestamp: new Date('2024-03-01T10:00:00Z'),
      properties: { path: '/home' }
    },
    {
      id: '2',
      type: 'click',
      tenantId: 'tenant1',
      timestamp: new Date('2024-03-01T10:01:00Z'),
      properties: { element: 'button' }
    }
  ];

  beforeEach(() => {
    (getRecentEvents as jest.Mock).mockResolvedValue(mockEvents);
  });

  it('renders list of events', async () => {
    render(<EventList />);

    // Wait for events to load
    expect(await screen.findByText('Recent Events')).toBeInTheDocument();
    
    // Check if events are displayed
    expect(screen.getByText('page_view')).toBeInTheDocument();
    expect(screen.getByText('click')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<EventList />);
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (getRecentEvents as jest.Mock).mockRejectedValueOnce(new Error('Failed to load events'));
    render(<EventList />);
    
    // Wait for error state
    expect(await screen.findByText('Error loading events')).toBeInTheDocument();
  });

  it('displays event properties', async () => {
    render(<EventList />);
    
    // Wait for events to load
    await screen.findByText('Recent Events');
    
    // Check if event properties are displayed
    expect(screen.getByText('/home')).toBeInTheDocument();
    expect(screen.getByText('button')).toBeInTheDocument();
  });
}); 