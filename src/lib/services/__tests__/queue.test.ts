import { createClient } from 'redis';
import { QueueService } from '../queue';
import { Event } from '@/types/analytics';

describe('QueueService', () => {
  let queueService: QueueService;
  let redisClient: ReturnType<typeof createClient>;

  beforeAll(async () => {
    queueService = QueueService.getInstance();
    await queueService.connect();
    redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
  });

  afterAll(async () => {
    await queueService.disconnect();
    await redisClient.quit();
  });

  beforeEach(async () => {
    await redisClient.del('events:queue');
  });

  describe('pushEvent', () => {
    it('should push an event to the queue', async () => {
      const event: Event = {
        eventName: 'test_event',
        properties: { test: true },
        tenantId: 'test_tenant',
        timestamp: new Date().toISOString(),
      };

      await queueService.pushEvent(event);

      const queueLength = await queueService.getQueueLength();
      expect(queueLength).toBe(1);
    });
  });

  describe('popEvent', () => {
    it('should pop an event from the queue', async () => {
      const event: Event = {
        eventName: 'test_event',
        properties: { test: true },
        tenantId: 'test_tenant',
        timestamp: new Date().toISOString(),
      };

      await queueService.pushEvent(event);

      const poppedEvent = await queueService.popEvent();
      expect(poppedEvent).toBeDefined();
      expect(poppedEvent?.eventName).toBe('test_event');
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
          eventName: 'test_event_1',
          properties: { test: true },
          tenantId: 'test_tenant',
          timestamp: new Date().toISOString(),
        },
        {
          eventName: 'test_event_2',
          properties: { test: true },
          tenantId: 'test_tenant',
          timestamp: new Date().toISOString(),
        },
      ];

      for (const event of events) {
        await queueService.pushEvent(event);
      }

      const queueLength = await queueService.getQueueLength();
      expect(queueLength).toBe(2);
    });
  });
}); 