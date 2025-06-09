# Analytics Dashboard

A full-stack SaaS-style analytics dashboard built with Next.js 15, MongoDB, and Tailwind CSS.

## Features

- Multi-tenant analytics dashboard
- Real-time event ingestion via API
- MongoDB for data storage
- UI with Tailwind CSS
- Server-side rendering with Next.js App Router

## Prerequisites

- Node.js 18+ and pnpm
- MongoDB 6+

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd analytics-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/analytics

# Optional: API key for authentication
API_KEY=your-api-key-here
```

4. Start the development server:
```bash
pnpm dev
```

5. In a separate terminal, start the worker:
```bash
pnpm worker
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utility functions and database connections
└── worker.ts           # Event processing worker
```

## API Usage

### Ingesting Events

Send POST requests to `/api/events` with the following JSON structure:

```json
{
  "eventName": "page_view",
  "properties": {
    "path": "/dashboard",
    "referrer": "https://example.com"
  },
  "userId": "user123",
  "tenantId": "tenant456",
  "timestamp": "2024-03-20T12:00:00Z"  // Optional, defaults to current time
}
```

## Development

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm start` - Start the production server
- `pnpm worker` - Start the event processing worker
- `pnpm lint` - Run ESLint

## License

MIT
