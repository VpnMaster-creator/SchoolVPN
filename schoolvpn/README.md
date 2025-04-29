# MasterVPN App

A modern VPN client application with user authentication, server selection, and connection management features.

## Features

- User authentication (login/register)
- Interactive world map to visualize server locations
- Server selection with connection statistics
- Connection history tracking
- Responsive dashboard interface
- PostgreSQL database integration

## Tech Stack

- Frontend: React + TypeScript
- Backend: Express.js + Node.js
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS + ShadCN UI components
- State Management: React Query

## Prerequisites

- Node.js v18+ installed
- PostgreSQL database setup

## Setup Instructions

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd mastervpn-app
   ```

2. Set up the database
   - Create a PostgreSQL database
   - Set the `DATABASE_URL` environment variable with your connection string:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/mastervpn
     ```

3. Replace the package.json with the clean version
   ```bash
   mv clean-package.json package.json
   ```

4. Replace the vite.config.ts file with the clean version
   ```bash
   mv clean-vite.config.ts vite.config.ts
   ```

5. Install dependencies
   ```bash
   npm install
   ```

6. Push the database schema
   ```bash
   npm run db:push
   ```

7. Start the development server
   ```bash
   npm run dev
   ```

8. Build for production
   ```bash
   npm run build
   npm run start
   ```

## Environment Variables

```
DATABASE_URL=postgresql://username:password@localhost:5432/mastervpn
SESSION_SECRET=your-session-secret
```

## Project Structure

- `client/` - Frontend React application
  - `src/components/` - UI components
  - `src/hooks/` - Custom React hooks
  - `src/pages/` - Application pages
  - `src/lib/` - Utility functions
- `server/` - Backend Express server
  - `auth.ts` - Authentication logic
  - `db.ts` - Database connection
  - `routes.ts` - API routes
  - `storage.ts` - Data access layer
- `shared/` - Shared code between client and server
  - `schema.ts` - Database schema and types

## License

MIT