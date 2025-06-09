export interface Event {
  type: string;
  tenantId: string;
  data: Record<string, any>;
  createdAt?: Date;
  processed?: boolean;
  processingAttempts?: number;
}

export interface EventTrend {
  date: string;
  count: number;
}

export interface Metrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByTenant: Record<string, number>;
  recentTrend: EventTrend[];
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