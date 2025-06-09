import { QueueService } from '@/lib/services/queue';

// Read allowed origins from .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

function getCORSHeaders(origin: string | null) {
  // Only allow if origin is in the list, otherwise use the first allowed origin or '*'
  const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*';
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  } as Record<string, string>;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: getCORSHeaders(origin),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
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
      return new Response(JSON.stringify({ error: 'Missing event type/name' }), {
        status: 400,
        headers: getCORSHeaders(origin),
      });
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: getCORSHeaders(origin),
    });
  } catch (error) {
    console.error('Error processing event:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: getCORSHeaders(origin),
    });
  }
} 