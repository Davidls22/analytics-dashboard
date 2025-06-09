import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

export async function rateLimit(request: NextRequest) {
  try {
    const ip = request.ip || 'anonymous';
    const key = `ratelimit:${ip}`;
    
    const db = DatabaseService.getInstance();
    await db.connect();
    
    const collection = db.getCollection('rate_limits');
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_MS);
    
    // Clean up old entries
    await collection.deleteMany({
      createdAt: { $lt: windowStart }
    });
    
    // Count requests in current window
    const count = await collection.countDocuments({
      key,
      createdAt: { $gte: windowStart }
    });
    
    if (count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    // Record this request
    await collection.insertOne({
      key,
      createdAt: now
    });
    
    return null;
  } catch (error) {
    console.error('Rate limit error:', error);
    // If error, allow the request but log the error
    return null;
  }
} 