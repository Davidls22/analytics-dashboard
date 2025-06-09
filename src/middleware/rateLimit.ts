import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redisClient from '@/lib/redis';
import { RateLimitError } from '@/lib/errors';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyPrefix: 'rate-limit:',
};

export async function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
) {
  const { windowMs, max, keyPrefix } = { ...defaultConfig, ...config };
  const redis = await redisClient;
  
  // Get client IP or use a default key
  const key = `${keyPrefix}${request.ip || 'unknown'}`;
  
  try {
    // Get current count
    const count = await redis.incr(key);
    
    // Set expiry on first request
    if (count === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }
    
    // Check if rate limit exceeded
    if (count > max) {
      throw new RateLimitError();
    }
    
    return NextResponse.next();
  } catch (error) {
    if (error instanceof RateLimitError) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429 }
      );
    }
    
    // If Redis error, allow the request but log the error
    console.error('Rate limit error:', error);
    return NextResponse.next();
  }
} 