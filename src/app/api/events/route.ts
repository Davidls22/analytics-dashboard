import { NextResponse } from 'next/server';
import { z } from 'zod';
import redisClient from '@/lib/redis';

const eventSchema = z.object({
  eventName: z.string(),
  properties: z.record(z.any()),
  userId: z.string().optional(),
  tenantId: z.string(),
  timestamp: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the event data
    const validatedEvent = eventSchema.parse({
      ...body,
      timestamp: body.timestamp || new Date().toISOString(),
    });

    // Get Redis client
    const redis = await redisClient;
    
    // Add event to Redis queue
    await redis.lPush('events:queue', JSON.stringify(validatedEvent));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error processing event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 