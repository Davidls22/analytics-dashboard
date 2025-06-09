import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthenticationError } from '@/lib/errors';

export async function authenticate(
  request: NextRequest,
  options: { requireAuth?: boolean } = {}
) {
  const { requireAuth = true } = options;
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey && requireAuth) {
    throw new AuthenticationError('API key is required');
  }
  
  if (apiKey && apiKey !== process.env.API_KEY) {
    throw new AuthenticationError('Invalid API key');
  }
  
  return NextResponse.next();
}

export function withAuth(handler: Function) {
  return async function (request: NextRequest, ...args: any[]) {
    try {
      await authenticate(request);
      return handler(request, ...args);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return new NextResponse(
          JSON.stringify({ error: error.message }),
          { status: 401 }
        );
      }
      throw error;
    }
  };
} 