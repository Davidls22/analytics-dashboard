import { Suspense } from 'react';
import { EventChart } from '@/components/EventChart';
import { MetricsOverview } from '@/components/MetricsOverview';
import { RecentEvents } from '@/components/RecentEvents';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Suspense fallback={<div>Loading metrics...</div>}>
              <MetricsOverview />
            </Suspense>
            
            <Suspense fallback={<div>Loading chart...</div>}>
              <EventChart />
            </Suspense>
          </div>
          
          <div className="mt-8">
            <Suspense fallback={<div>Loading recent events...</div>}>
              <RecentEvents />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
