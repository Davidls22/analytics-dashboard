import { processEvent } from '../processor';
import { DatabaseService } from '@/lib/services/database';
import { Event } from '@/types/analytics';

jest.mock('@/lib/services/database');

describe('Event Processor', () => {
  let mockDbService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    mockDbService = {
      insertEvent: jest.fn(),
      updateMetrics: jest.fn(),
    } as any;
    (DatabaseService.getInstance as jest.Mock).mockReturnValue(mockDbService);
  });

  it('should process valid event successfully', async () => {
    const event: Event = {
      eventName: 'test_event',
      properties: { test: true },
      tenantId: 'test_tenant',
      timestamp: new Date().toISOString(),
    };

    await processEvent(event);

    expect(mockDbService.insertEvent).toHaveBeenCalledWith(event);
    expect(mockDbService.updateMetrics).toHaveBeenCalledWith(event);
  });

  it('should reject invalid event data', async () => {
    const invalidEvent = {
      // Missing required fields
      properties: { test: true },
    };

    await expect(processEvent(invalidEvent)).rejects.toThrow();
    expect(mockDbService.insertEvent).not.toHaveBeenCalled();
    expect(mockDbService.updateMetrics).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const event: Event = {
      eventName: 'test_event',
      properties: { test: true },
      tenantId: 'test_tenant',
      timestamp: new Date().toISOString(),
    };

    mockDbService.insertEvent.mockRejectedValueOnce(new Error('Database error'));

    await expect(processEvent(event)).rejects.toThrow('Database error');
    expect(mockDbService.insertEvent).toHaveBeenCalledWith(event);
    expect(mockDbService.updateMetrics).not.toHaveBeenCalled();
  });
}); 