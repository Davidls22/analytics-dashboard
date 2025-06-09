import { MongoClient } from 'mongodb';
import { DatabaseService } from '../database';
import { Event } from '@/types/analytics';

describe('DatabaseService', () => {
  let dbService: DatabaseService;
  let mongoClient: MongoClient;

  beforeAll(async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/analytics-test';
    dbService = DatabaseService.getInstance();
    await dbService.connect();
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
  });

  afterAll(async () => {
    await dbService.disconnect();
    await mongoClient.close();
  });

  beforeEach(async () => {
    const db = mongoClient.db('analytics-test');
    await db.collection('events').deleteMany({});
    await db.collection('metrics').deleteMany({});
  });

  describe('insertEvent', () => {
    it('should insert an event successfully', async () => {
      const event: Event = {
        eventName: 'test_event',
        properties: { test: true },
        tenantId: 'test_tenant',
        timestamp: new Date().toISOString(),
      };

      await dbService.insertEvent(event);

      const db = mongoClient.db('analytics-test');
      const insertedEvent = await db.collection('events').findOne({
        eventName: 'test_event',
      });

      expect(insertedEvent).toBeDefined();
      expect(insertedEvent?.eventName).toBe('test_event');
      expect(insertedEvent?.tenantId).toBe('test_tenant');
    });
  });

  describe('updateMetrics', () => {
    it('should update metrics successfully', async () => {
      const event: Event = {
        eventName: 'test_event',
        properties: { test: true },
        tenantId: 'test_tenant',
        timestamp: new Date().toISOString(),
      };

      await dbService.updateMetrics(event);

      const db = mongoClient.db('analytics-test');
      const metric = await db.collection('metrics').findOne({
        tenantId: 'test_tenant',
        eventName: 'test_event',
      });

      expect(metric).toBeDefined();
      expect(metric?.count).toBe(1);
    });
  });

  describe('getMetrics', () => {
    it('should return correct metrics', async () => {
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
        await dbService.insertEvent(event);
        await dbService.updateMetrics(event);
      }

      const metrics = await dbService.getMetrics();

      expect(metrics.totalEvents).toBe(2);
      expect(metrics.eventsToday).toBe(2);
    });
  });
}); 