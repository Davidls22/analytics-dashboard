import { createClient } from 'redis';
import { processEvent } from './processor';
import { logger } from './utils/logger';

if (!process.env.REDIS_URL) {
  throw new Error('Please add REDIS_URL to .env.local');
}

async function main() {
  const redis = createClient({
    url: process.env.REDIS_URL,
  });
  
  await redis.connect();
  logger.info('Worker started, waiting for events...');
  
  while (true) {
    try {
      const event = await redis.brPop('events:queue', 0);
      if (event) {
        const parsedEvent = JSON.parse(event.element);
        await processEvent(parsedEvent);
      }
    } catch (error) {
      logger.error('Error in worker loop:', error);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
}); 