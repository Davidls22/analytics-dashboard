import { NextResponse } from 'next/server';
import { QueueService } from '@/lib/services/queue';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Accept both 'type' or 'name' for event type
    // Accept both 'data' or 'properties' for event data
    // Accept optional 'tenantId', 'userId', and 'timestamp'
    const eventName = body.type || body.name;
    const properties = body.data || body.properties || {};
    const tenantId = body.tenantId || 'public';
    const userId = body.userId || undefined;
    const timestamp = body.timestamp || new Date().toISOString();

    if (!eventName) {
      return NextResponse.json(
        { error: 'Missing event type/name' },
        { status: 400 }
      );
    }

    // Get queue service
    const queue = QueueService.getInstance();
    await queue.connect();

    // Add normalized event to queue
    await queue.pushEvent({
      eventName,
      properties,
      tenantId,
      userId,
      timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 