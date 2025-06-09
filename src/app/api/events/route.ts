import { NextResponse } from 'next/server';
import { z } from 'zod';
import { QueueService } from '@/lib/services/queue';

const eventSchema = z.object({
  type: z.string(),
  tenantId: z.string(),
  data: z.record(z.any())
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedEvent = eventSchema.parse(body);

    // Get queue service
    const queue = QueueService.getInstance();
    await queue.connect();

    // Add event to queue
    await queue.pushEvent(validatedEvent);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data' },
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