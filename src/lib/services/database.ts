import { MongoClient, Collection, Db, Document } from 'mongodb';
import { DatabaseError } from '@/lib/errors';
import { Event, EventTrend, Metrics } from '@/types/analytics';

export class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect() {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
      }

      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db();
    } catch (error) {
      throw new DatabaseError('Failed to connect to database', error);
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  getCollection<T extends Document>(name: string): Collection<T> {
    if (!this.db) {
      throw new DatabaseError('Database not connected');
    }
    return this.db.collection<T>(name);
  }

  getDb(): Db {
    if (!this.db) {
      throw new DatabaseError('Database not connected');
    }
    return this.db;
  }

  async insertEvent(event: Event) {
    try {
      // Normalize event fields
      const eventName = event.eventName || event.type;
      const properties = event.properties || event.data || {};
      const tenantId = event.tenantId || 'public';
      const userId = event.userId;
      const timestamp = event.timestamp || new Date().toISOString();

      await this.getDb().collection('events').insertOne({
        eventName,
        properties,
        tenantId,
        userId,
        timestamp,
        processedAt: new Date(),
      });
    } catch (error) {
      throw new DatabaseError('Failed to insert event', error);
    }
  }

  async updateMetrics(event: Event) {
    try {
      // Normalize event fields
      const eventName = event.eventName || event.type;
      const tenantId = event.tenantId || 'public';
      await this.getDb().collection('metrics').updateOne(
        {
          tenantId,
          eventName,
          date: new Date().toISOString().split('T')[0],
        },
        {
          $inc: { count: 1 },
          $setOnInsert: {
            tenantId,
            eventName,
            date: new Date().toISOString().split('T')[0],
          },
        },
        { upsert: true }
      );
    } catch (error) {
      throw new DatabaseError('Failed to update metrics', error);
    }
  }

  async getMetrics(): Promise<Metrics> {
    try {
      const db = this.getDb();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalEvents,
        eventsByType,
        eventsByDate,
        eventsByTenant,
        eventsByUser,
        eventsToday,
        eventsThisWeek,
        eventsThisMonth,
        topEvents,
        topTenants,
        topUsers
      ] = await Promise.all([
        db.collection('events').countDocuments(),
        db.collection('events').aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]).toArray().then(results => 
          Object.fromEntries(results.map(r => [r._id, r.count]))
        ),
        db.collection('events').aggregate([
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }
        ]).toArray().then(results => 
          Object.fromEntries(results.map(r => [r._id, r.count]))
        ),
        db.collection('events').aggregate([
          { $group: { _id: '$tenantId', count: { $sum: 1 } } }
        ]).toArray().then(results => 
          Object.fromEntries(results.map(r => [r._id, r.count]))
        ),
        db.collection('events').aggregate([
          { $match: { userId: { $exists: true } } },
          { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]).toArray().then(results => 
          Object.fromEntries(results.map(r => [r._id, r.count]))
        ),
        db.collection('events').countDocuments({ createdAt: { $gte: today } }),
        db.collection('events').countDocuments({ createdAt: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) } }),
        db.collection('events').countDocuments({ createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) } }),
        db.collection('events').aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).toArray().then(results => results.map(r => ({ type: r._id, count: r.count }))),
        db.collection('events').aggregate([
          { $group: { _id: '$tenantId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).toArray().then(results => results.map(r => ({ tenantId: r._id, count: r.count }))),
        db.collection('events').aggregate([
          { $match: { userId: { $exists: true } } },
          { $group: { _id: '$userId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).toArray().then(results => results.map(r => ({ userId: r._id, count: r.count })))
      ]);

      const averageEventsPerDay = totalEvents / 30; // Assuming 30 days for simplicity

      return {
        totalEvents,
        eventsByType,
        eventsByDate,
        eventsByTenant,
        eventsByUser,
        eventsToday,
        eventsThisWeek,
        eventsThisMonth,
        averageEventsPerDay,
        topEvents,
        topTenants,
        topUsers
      };
    } catch (error) {
      throw new DatabaseError('Failed to get metrics', error);
    }
  }

  async getEventTrends(): Promise<EventTrend[]> {
    try {
      const db = this.getDb();
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const trends = await db.collection('events').aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]).toArray();

      return trends.map(trend => ({
        date: trend._id,
        count: trend.count
      }));
    } catch (error) {
      throw new DatabaseError('Failed to get event trends', error);
    }
  }
} 