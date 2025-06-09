import { Suspense } from 'react';
import { getMetrics } from '@/lib/metrics';

async function MetricsContent() {
  const metrics = await getMetrics();
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-semibold text-gray-900">{metrics.totalEvents}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-semibold text-gray-900">{metrics.activeUsers}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Events Today</p>
          <p className="text-2xl font-semibold text-gray-900">{metrics.eventsToday}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Avg. Events/Day</p>
          <p className="text-2xl font-semibold text-gray-900">{metrics.avgEventsPerDay}</p>
        </div>
      </div>
    </div>
  );
}

export function MetricsOverview() {
  return (
    <Suspense fallback={<div>Loading metrics...</div>}>
      <MetricsContent />
    </Suspense>
  );
} 