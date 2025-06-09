import { QueueService } from '../queue';
import { Event } from '@/types/analytics';
import { DatabaseService } from '../database';

describe('QueueService', () => {
  let queueService: QueueService;
  let db: DatabaseService;

  beforeAll(async () => {
    queueService = QueueService.getInstance();
    db = DatabaseService.getInstance();
    await queueService.connect();
  });

  afterAll(async () => {
    await queueService.disconnect();
    await db.disconnect();
  });

  beforeEach(async () => {
    // Clean up the queue collection before each test
    const collection = db.getCollection('event_queue');
    await collection.deleteMany({});
  });

  describe('pushEvent', () => {
    it('should push an event to the queue', async () => {
      const event: Event = {
        type: 'test_event',
        data: { test: true },
        tenantId: 'test_tenant'
      };

      await queueService.pushEvent(event);

      const queueLength = await queueService.getQueueLength();
      expect(queueLength).toBe(1);
    });
  });

  describe('popEvent', () => {
    it('should pop an event from the queue', async () => {
      const event: Event = {
        type: 'test_event',
        data: { test: true },
        tenantId: 'test_tenant'
      };

      await queueService.pushEvent(event);

      const poppedEvent = await queueService.popEvent();
      expect(poppedEvent).toBeDefined();
      expect(poppedEvent?.type).toBe('test_event');
      expect(poppedEvent?.tenantId).toBe('test_tenant');
    });

    it('should return null when queue is empty', async () => {
      const poppedEvent = await queueService.popEvent();
      expect(poppedEvent).toBeNull();
    });
  });

  describe('getQueueLength', () => {
    it('should return correct queue length', async () => {
      const events: Event[] = [
        {
          type: 'test_event_1',
          data: { test: true },
          tenantId: 'test_tenant'
        },
        {
          type: 'test_event_2',
          data: { test: true },
          tenantId: 'test_tenant'
        }
      ];

      for (const event of events) {
        await queueService.pushEvent(event);
      }

      const queueLength = await queueService.getQueueLength();
      expect(queueLength).toBe(2);
    });
  });

  describe('retryFailedEvents', () => {
    it('should reset processed flag for failed events', async () => {
      const event: Event = {
        type: 'test_event',
        data: { test: true },
        tenantId: 'test_tenant'
      };

      await queueService.pushEvent(event);
      await queueService.popEvent(); // This marks the event as processed

      const initialLength = await queueService.getQueueLength();
      expect(initialLength).toBe(0);

      await queueService.retryFailedEvents();
      const finalLength = await queueService.getQueueLength();
      expect(finalLength).toBe(1);
    });
  });
}); 