import { MongoClient } from 'mongodb';
import { z } from 'zod';
import { Event } from '@/types/analytics';
import { logger } from './utils/logger';

const eventSchema = z.object({
  eventName: z.string(),
  properties: z.record(z.any()),
  userId: z.string().optional(),
  tenantId: z.string(),
  timestamp: z.string().datetime(),
});

export async function processEvent(event: unknown) {
  try {
    const validatedEvent = eventSchema.parse(event) as Event;
    const mongoClient = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = mongoClient.db('analytics');
    
    // Store raw event
    await db.collection('events').insertOne({
      ...validatedEvent,
      processedAt: new Date(),
    });
    
    // Update aggregated metrics
    await db.collection('metrics').updateOne(
      {
        tenantId: validatedEvent.tenantId,
        eventName: validatedEvent.eventName,
        date: new Date(validatedEvent.timestamp).toISOString().split('T')[0],
      },
      {
        $inc: { count: 1 },
        $setOnInsert: {
          tenantId: validatedEvent.tenantId,
          eventName: validatedEvent.eventName,
          date: new Date(validatedEvent.timestamp).toISOString().split('T')[0],
        },
      },
      { upsert: true }
    );
    
    await mongoClient.close();
    logger.info('Event processed successfully', { eventName: validatedEvent.eventName });
  } catch (error) {
    logger.error('Error processing event:', error);
    throw error;
  }
} 