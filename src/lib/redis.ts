import { createClient } from 'redis';

if (!process.env.REDIS_URL) {
  throw new Error('Please add your Redis URL to .env.local');
}

const redisUrl = process.env.REDIS_URL;

let client;
let clientPromise: Promise<ReturnType<typeof createClient>>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithRedis = global as typeof globalThis & {
    _redisClientPromise?: Promise<ReturnType<typeof createClient>>;
  };

  if (!globalWithRedis._redisClientPromise) {
    client = createClient({
      url: redisUrl,
    });
    globalWithRedis._redisClientPromise = client.connect();
  }
  clientPromise = globalWithRedis._redisClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = createClient({
    url: redisUrl,
  });
  clientPromise = client.connect();
}

export default clientPromise; 