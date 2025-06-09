import { Event } from '@/types/analytics';
import { DatabaseService } from '@/lib/services/database';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const eventSchema = z.object({
  type: z.string(),
  data: z.record(z.any()),
  tenantId: z.string(),
  timestamp: z.string().optional(),
  userId: z.string().optional(),
});

export class EventProcessor {
  private db: DatabaseService;

  constructor() {
    this.db = DatabaseService.getInstance();
  }

  async processEvent(event: Event): Promise<void> {
    try {
      const validatedEvent = eventSchema.parse(event) as Event;
      const timestamp = validatedEvent.timestamp || new Date().toISOString();

      // Store the raw event
      await this.db.getCollection('events').insertOne({
        ...validatedEvent,
        timestamp,
        createdAt: new Date(),
      });

      // Update metrics
      await this.updateMetrics(validatedEvent, timestamp);

      logger.info('Event processed successfully', { type: validatedEvent.type });
    } catch (error) {
      logger.error('Error processing event', { error });
      throw error;
    }
  }

  private async updateMetrics(event: Event, timestamp: string): Promise<void> {
    const date = new Date(timestamp).toISOString().split('T')[0];
    const metricsCollection = this.db.getCollection('metrics');

    // Update total events
    await metricsCollection.updateOne(
      { tenantId: event.tenantId },
      { $inc: { totalEvents: 1 } },
      { upsert: true }
    );

    // Update events by type
    await metricsCollection.updateOne(
      { tenantId: event.tenantId },
      { $inc: { [`eventsByType.${event.type}`]: 1 } },
      { upsert: true }
    );

    // Update events by date
    await metricsCollection.updateOne(
      { tenantId: event.tenantId },
      { $inc: { [`eventsByDate.${date}`]: 1 } },
      { upsert: true }
    );

    // Update events by user if userId is present
    if (event.userId) {
      await metricsCollection.updateOne(
        { tenantId: event.tenantId },
        { $inc: { [`eventsByUser.${event.userId}`]: 1 } },
        { upsert: true }
      );
    }
  }
} 