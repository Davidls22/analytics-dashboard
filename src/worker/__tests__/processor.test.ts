import { EventProcessor } from '../processor';
import { Event } from '@/types/analytics';

describe('EventProcessor', () => {
  let processor: EventProcessor;

  beforeEach(() => {
    processor = new EventProcessor();
  });

  it('should process a valid event', async () => {
    const event: Event = {
      type: 'test_event',
      data: { test: true },
      tenantId: 'test_tenant'
    };

    await expect(processor.processEvent(event)).resolves.not.toThrow();
  });

  it('should throw error for invalid event', async () => {
    const invalidEvent = {
      type: 'test_event',
      // Missing required fields
    } as Event;

    await expect(processor.processEvent(invalidEvent)).rejects.toThrow();
  });
}); 