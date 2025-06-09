import { QueueService } from '@/lib/services/queue';
import { EventProcessor } from './processor';
import { logger } from '@/lib/logger';

async function processQueue() {
  const queue = QueueService.getInstance();
  const processor = new EventProcessor();

  try {
    await queue.connect();
    logger.info('Worker started');

    while (true) {
      const event = await queue.popEvent();
      if (event) {
        try {
          await processor.processEvent(event);
        } catch (error) {
          logger.error('Error processing event', { error });
          // Retry failed events
          await queue.retryFailedEvents();
        }
      }
      // Small delay to prevent CPU spinning
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    logger.error('Worker error', { error });
    process.exit(1);
  }
}

processQueue(); 