import { Suspense } from 'react';
import { EventChart } from '@/components/EventChart';
import { MetricsOverview } from '@/components/MetricsOverview';
import { RecentEvents } from '@/components/RecentEvents';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MetricsOverview />
          <EventChart />
        </div>
        <div className="mt-12">
          <RecentEvents />
        </div>
      </div>
    </main>
  );
}
