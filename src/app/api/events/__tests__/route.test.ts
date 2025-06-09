import { NextRequest } from 'next/server';
import { POST } from '../route';
import { QueueService } from '@/lib/services/queue';

jest.mock('@/lib/services/queue');

describe('Events API', () => {
  let mockQueueService: jest.Mocked<QueueService>;

  beforeEach(() => {
    mockQueueService = {
      pushEvent: jest.fn(),
    } as any;
    (QueueService.getInstance as jest.Mock).mockReturnValue(mockQueueService);
  });

  describe('POST /api/events', () => {
    it('should accept valid event data', async () => {
      const event = {
        eventName: 'test_event',
        properties: { test: true },
        tenantId: 'test_tenant',
        timestamp: new Date().toISOString(),
      };

      const request = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockQueueService.pushEvent).toHaveBeenCalledWith(event);
    });

    it('should reject invalid event data', async () => {
      const invalidEvent = {
        // Missing required fields
        properties: { test: true },
      };

      const request = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid event data');
      expect(mockQueueService.pushEvent).not.toHaveBeenCalled();
    });

    it('should handle server errors', async () => {
      mockQueueService.pushEvent.mockRejectedValueOnce(new Error('Queue error'));

      const event = {
        eventName: 'test_event',
        properties: { test: true },
        tenantId: 'test_tenant',
        timestamp: new Date().toISOString(),
      };

      const request = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
}); 