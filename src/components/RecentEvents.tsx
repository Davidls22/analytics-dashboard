import { Suspense } from 'react';
import { getRecentEvents } from '@/lib/metrics';

interface Event {
  eventName?: string;
  type?: string;
  properties?: Record<string, any>;
  data?: Record<string, any>;
  userId?: string;
  tenantId?: string;
  timestamp: string;
}

async function RecentEventsContent() {
  const events = await getRecentEvents();
  
  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Events</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {events.map((event: Event, idx: number) => (
              <tr key={`${event.timestamp}-${event.eventName || event.type || idx}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {event.eventName || event.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {JSON.stringify(event.properties || event.data || {})}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RecentEvents() {
  return (
    <Suspense fallback={<div>Loading recent events...</div>}>
      <RecentEventsContent />
    </Suspense>
  );
} 