import { QueueService } from '@/lib/services/queue';
import { EventProcessor } from './processor';

async function main() {
  try {
    const queue = QueueService.getInstance();
    await queue.connect();

    console.log('Worker started');

    while (true) {
      try {
        const event = await queue.popEvent();
        if (event) {
          await EventProcessor.processEvent(event);
        }
      } catch (error) {
        console.error('Error processing event:', error);
      }
    }
  } catch (error) {
    console.error('Worker error:', error);
    process.exit(1);
  }
}

main(); 