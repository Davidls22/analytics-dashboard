import { render, screen, fireEvent } from '@testing-library/react';
import { TenantSelector } from '../TenantSelector';
import { getTenants } from '@/lib/tenants';

jest.mock('@/lib/tenants');

describe('TenantSelector', () => {
  const mockTenants = [
    { id: 'tenant1', name: 'Tenant 1' },
    { id: 'tenant2', name: 'Tenant 2' }
  ];

  beforeEach(() => {
    (getTenants as jest.Mock).mockResolvedValue(mockTenants);
  });

  it('renders tenant selector with options', async () => {
    render(<TenantSelector onSelect={jest.fn()} />);

    // Wait for tenants to load
    expect(await screen.findByText('Select Tenant')).toBeInTheDocument();
    
    // Check if tenant options are displayed
    expect(screen.getByText('Tenant 1')).toBeInTheDocument();
    expect(screen.getByText('Tenant 2')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<TenantSelector onSelect={jest.fn()} />);
    expect(screen.getByText('Loading tenants...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (getTenants as jest.Mock).mockRejectedValueOnce(new Error('Failed to load tenants'));
    render(<TenantSelector onSelect={jest.fn()} />);
    
    // Wait for error state
    expect(await screen.findByText('Error loading tenants')).toBeInTheDocument();
  });

  it('calls onSelect when tenant is selected', async () => {
    const onSelect = jest.fn();
    render(<TenantSelector onSelect={onSelect} />);
    
    // Wait for tenants to load
    await screen.findByText('Select Tenant');
    
    // Select a tenant
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'tenant1' } });
    
    // Check if onSelect was called with correct tenant
    expect(onSelect).toHaveBeenCalledWith('tenant1');
  });
}); 