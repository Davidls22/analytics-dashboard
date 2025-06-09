import { render, screen } from '@testing-library/react';
import { EventChart } from '../EventChart';
import { getEventTrends } from '@/lib/metrics';

jest.mock('@/lib/metrics');

describe('EventChart', () => {
  const mockTrends = [
    { date: '2024-03-01', count: 10 },
    { date: '2024-03-02', count: 20 },
    { date: '2024-03-03', count: 15 },
  ];

  beforeEach(() => {
    (getEventTrends as jest.Mock).mockResolvedValue(mockTrends);
  });

  it('renders chart with correct data', async () => {
    render(<EventChart />);

    // Wait for chart to load
    expect(await screen.findByText('Event Trends')).toBeInTheDocument();
    
    // Check if date range is displayed
    expect(screen.getByText('2024-03-01')).toBeInTheDocument();
    expect(screen.getByText('2024-03-03')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<EventChart />);
    expect(screen.getByText('Loading chart...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (getEventTrends as jest.Mock).mockRejectedValueOnce(new Error('Failed to load trends'));
    render(<EventChart />);
    
    // Wait for error state
    expect(await screen.findByText('Error loading chart')).toBeInTheDocument();
  });

  it('renders correct number of bars', async () => {
    render(<EventChart />);
    
    // Wait for chart to load
    await screen.findByText('Event Trends');
    
    // Check if all bars are rendered
    const bars = document.querySelectorAll('.bg-blue-500');
    expect(bars.length).toBe(mockTrends.length);
  });
}); 