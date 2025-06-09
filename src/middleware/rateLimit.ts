import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export async function rateLimit(request: NextRequest) {
  const db = DatabaseService.getInstance();
  const collection = db.getCollection('rate_limits');

  // Get IP from headers or use a fallback
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 'anonymous';

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  await collection.deleteMany({
    timestamp: { $lt: windowStart }
  });

  // Count requests in the current window
  const count = await collection.countDocuments({
    ip,
    timestamp: { $gte: windowStart }
  });

  if (count >= MAX_REQUESTS) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Record this request
  await collection.insertOne({
    ip,
    timestamp: now
  });

  return null;
} 