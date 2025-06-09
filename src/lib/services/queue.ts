import { QueueError } from '@/lib/errors';
import { Event } from '@/types/analytics';
import { DatabaseService } from './database';

export class QueueService {
  private static instance: QueueService;
  private db: DatabaseService;
  private collection = 'event_queue';

  private constructor() {
    this.db = DatabaseService.getInstance();
  }

  static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  async connect() {
    try {
      await this.db.connect();
      // Create indexes for efficient queue operations
      await this.db.getCollection(this.collection).createIndex({ createdAt: 1 });
      await this.db.getCollection(this.collection).createIndex({ processed: 1 });
    } catch (error) {
      throw new QueueError('Failed to connect to database', error);
    }
  }

  async disconnect() {
    // No-op as database connection is managed by DatabaseService
  }

  async pushEvent(event: Event) {
    try {
      // Normalize event fields
      const eventName = event.eventName || event.type;
      const properties = event.properties || event.data || {};
      const tenantId = event.tenantId || 'public';
      const userId = event.userId;
      const timestamp = event.timestamp || new Date().toISOString();

      await this.db.getCollection(this.collection).insertOne({
        eventName,
        properties,
        tenantId,
        userId,
        timestamp,
        createdAt: new Date(),
        processed: false,
        processingAttempts: 0
      });
    } catch (error) {
      throw new QueueError('Failed to push event to queue', error);
    }
  }

  async popEvent(): Promise<Event | null> {
    try {
      const result = await this.db.getCollection(this.collection).findOneAndUpdate(
        { 
          processed: false,
          processingAttempts: { $lt: 3 } // Limit retry attempts
        },
        { 
          $inc: { processingAttempts: 1 },
          $set: { processed: true }
        },
        { 
          sort: { createdAt: 1 },
          returnDocument: 'before'
        }
      );

      if (!result) {
        return null;
      }

      // Remove processed events older than 24 hours
      await this.cleanupOldEvents();

      return {
        eventName: result.eventName || result.type,
        properties: result.properties || result.data || {},
        tenantId: result.tenantId || 'public',
        userId: result.userId,
        timestamp: result.timestamp,
      };
    } catch (error) {
      throw new QueueError('Failed to pop event from queue', error);
    }
  }

  async getQueueLength(): Promise<number> {
    try {
      return await this.db.getCollection(this.collection).countDocuments({
        processed: false,
        processingAttempts: { $lt: 3 }
      });
    } catch (error) {
      throw new QueueError('Failed to get queue length', error);
    }
  }

  private async cleanupOldEvents() {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      await this.db.getCollection(this.collection).deleteMany({
        processed: true,
        createdAt: { $lt: oneDayAgo }
      });
    } catch (error) {
      console.error('Failed to cleanup old events:', error);
    }
  }

  async retryFailedEvents() {
    try {
      await this.db.getCollection(this.collection).updateMany(
        { 
          processed: true,
          processingAttempts: { $lt: 3 }
        },
        { 
          $set: { processed: false }
        }
      );
    } catch (error) {
      throw new QueueError('Failed to retry failed events', error);
    }
  }
} 