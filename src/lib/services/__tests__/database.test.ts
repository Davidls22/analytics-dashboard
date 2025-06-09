import { DatabaseService } from '../database';
import { Event } from '@/types/analytics';

describe('DatabaseService', () => {
  let db: DatabaseService;

  beforeAll(async () => {
    db = DatabaseService.getInstance();
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    const collections = ['events', 'metrics'];
    for (const collection of collections) {
      await db.getCollection(collection).deleteMany({});
    }
  });

  describe('insertEvent', () => {
    it('should insert an event', async () => {
      const event: Event = {
        type: 'test_event',
        data: { test: true },
        tenantId: 'test_tenant'
      };

      await db.insertEvent(event);
      const result = await db.getCollection('events').findOne({ type: 'test_event' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('test_event');
    });
  });

  describe('updateMetrics', () => {
    it('should update metrics for an event', async () => {
      const event: Event = {
        type: 'test_event',
        data: { test: true },
        tenantId: 'test_tenant'
      };

      await db.updateMetrics(event);
      const result = await db.getCollection('metrics').findOne({
        tenantId: 'test_tenant',
        type: 'test_event'
      });
      expect(result).toBeDefined();
      expect(result?.count).toBe(1);
    });
  });

  describe('getMetrics', () => {
    it('should return metrics', async () => {
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
        await db.insertEvent(event);
        await db.updateMetrics(event);
      }

      const metrics = await db.getMetrics();
      expect(metrics.totalEvents).toBe(2);
      expect(metrics.eventsByType['test_event_1']).toBe(1);
      expect(metrics.eventsByType['test_event_2']).toBe(1);
    });
  });
}); 