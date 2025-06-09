// Test script for sending events to the analytics dashboard
const fetch = require('node-fetch');

const ANALYTICS_URL = 'http://localhost:3002/api/events';

async function sendTestEvent() {
  try {
    const response = await fetch(ANALYTICS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'test_event',
        tenantId: 'test-app',
        data: {
          message: 'Hello from test script',
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Event sent successfully:', result);
  } catch (error) {
    console.error('Error sending event:', error);
  }
}

// Send a test event
sendTestEvent(); 