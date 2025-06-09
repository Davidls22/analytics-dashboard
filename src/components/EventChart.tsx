import { Suspense } from 'react';
import { getEventTrends } from '@/lib/metrics';

async function EventChartContent() {
  const trends = await getEventTrends();
  const maxCount = Math.max(...trends.map(t => t.count), 1);
  
  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Trends</h2>
      <div className="h-64 flex flex-col justify-end">
        <div className="flex items-end space-x-1 h-full">
          {trends.map((day) => (
            <div
              key={day.date}
              className="flex-1 bg-blue-500 rounded-t transition-all duration-300"
              style={{ height: `${(day.count / maxCount) * 100}%` }}
              title={`${day.date}: ${day.count} events`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-500">
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