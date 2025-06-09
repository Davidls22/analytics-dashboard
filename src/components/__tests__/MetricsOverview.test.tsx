import { render, screen } from '@testing-library/react';
import { MetricsOverview } from '../MetricsOverview';
import { getMetrics } from '@/lib/metrics';

jest.mock('@/lib/metrics');

describe('MetricsOverview', () => {
  beforeEach(() => {
    (getMetrics as jest.Mock).mockResolvedValue({
      totalEvents: 1000,
      activeUsers: 50,
      eventsToday: 100,
      avgEventsPerDay: 75,
    });
  });

  it('renders metrics correctly', async () => {
    render(<MetricsOverview />);

    // Wait for metrics to load
    expect(await screen.findByText('1000')).toBeInTheDocument();
    expect(await screen.findByText('50')).toBeInTheDocument();
    expect(await screen.findByText('100')).toBeInTheDocument();
    expect(await screen.findByText('75')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<MetricsOverview />);
    expect(screen.getByText('Loading metrics...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (getMetrics as jest.Mock).mockRejectedValueOnce(new Error('Failed to load metrics'));
    render(<MetricsOverview />);
    
    // Wait for error state
    expect(await screen.findByText('Error loading metrics')).toBeInTheDocument();
  });
}); 