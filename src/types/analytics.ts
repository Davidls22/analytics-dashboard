export interface Event {
  type: string;
  data: Record<string, any>;
  tenantId: string;
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