import { Suspense } from 'react';
import { getEventTrends } from '@/lib/metrics';

async function EventChartContent() {
  const trends = await getEventTrends();
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Event Trends</h2>
      <div className="h-64">
        <div className="h-full flex items-end space-x-2">
          {trends.map((day, index) => (
            <div
              key={day.date}
              className="flex-1 bg-blue-500 rounded-t"
              style={{
                height: `${(day.count / Math.max(...trends.map(t => t.count))) * 100}%`,
              }}
              title={`${day.date}: ${day.count} events`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{trends[0]?.date}</span>
          <span>{trends[trends.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}

export function EventChart() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <EventChartContent />
    </Suspense>
  );
} 