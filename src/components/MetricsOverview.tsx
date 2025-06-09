import { Suspense } from 'react';
import { getMetrics } from '@/lib/metrics';

async function MetricsContent() {
  const metrics = await getMetrics();
  
  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg flex flex-col items-start">
          <p className="text-sm text-gray-500 mb-1">Total Events</p>
          <p className="text-3xl font-bold text-blue-900">{metrics.totalEvents}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg flex flex-col items-start">
          <p className="text-sm text-gray-500 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-green-900">{metrics.activeUsers}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg flex flex-col items-start">
          <p className="text-sm text-gray-500 mb-1">Events Today</p>
          <p className="text-3xl font-bold text-yellow-900">{metrics.eventsToday}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg flex flex-col items-start">
          <p className="text-sm text-gray-500 mb-1">Avg. Events/Day</p>
          <p className="text-3xl font-bold text-purple-900">{metrics.avgEventsPerDay}</p>
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