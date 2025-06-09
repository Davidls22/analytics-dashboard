import clientPromise from './mongodb';

interface EventTrend {
  date: string;
  count: number;
}

interface Event {
  eventName?: string;
  type?: string;
  properties?: Record<string, any>;
  data?: Record<string, any>;
  userId?: string;
  tenantId?: string;
  timestamp: string;
}

export async function getMetrics() {
  const client = await clientPromise;
  const db = client.db('analytics');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [
    totalEvents,
    activeUsers,
    eventsToday,
    avgEventsPerDay
  ] = await Promise.all([
    // Total events
    db.collection('events').countDocuments(),
    
    // Active users (unique users in the last 30 days)
    db.collection('events').distinct('userId', {
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).then(users => users.length),
    
    // Events today
    db.collection('events').countDocuments({
      timestamp: { $gte: today }
    }),
    
    // Average events per day (last 30 days)
    db.collection('events').aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$count' }
        }
      }
    ]).toArray().then(result => Math.round(result[0]?.avg || 0))
  ]);
  
  return {
    totalEvents,
    activeUsers,
    eventsToday,
    avgEventsPerDay
  };
}

export async function getEventTrends(): Promise<EventTrend[]> {
  const client = await clientPromise;
  const db = client.db('analytics');
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const trends = await db.collection('events').aggregate([
    {
      $match: {
        timestamp: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]).toArray();
  
  return trends.map(trend => ({
    date: trend._id,
    count: trend.count
  }));
}

export async function getRecentEvents(): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db('analytics');
  
  const events = await db.collection('events')
    .find({})
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();
  
  return events.map(event => ({
    eventName: event.eventName || event.type,
    properties: event.properties || event.data || {},
    userId: event.userId,
    tenantId: event.tenantId,
    timestamp: event.timestamp
  }));
} 