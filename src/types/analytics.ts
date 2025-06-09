export interface Event {
  // Accept both legacy and normalized fields
  type?: string; // legacy
  data?: Record<string, any>; // legacy
  eventName?: string; // normalized
  properties?: Record<string, any>; // normalized
  tenantId?: string; // optional for public events
  timestamp?: string;
  userId?: string;
}

export interface EventTrend {
  date: string;
  count: number;
}

export interface Metrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByDate: Record<string, number>;
  eventsByTenant: Record<string, number>;
  eventsByUser: Record<string, number>;
  eventsToday: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  averageEventsPerDay: number;
  topEvents: Array<{
    type: string;
    count: number;
  }>;
  topTenants: Array<{
    tenantId: string;
    count: number;
  }>;
  topUsers: Array<{
    userId: string;
    count: number;
  }>;
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  createdAt: string;
  lastSeen: string;
} 