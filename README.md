# Expense Reimbursement API

A TypeScript + Express backend for managing employee expense claims with role-based access control and approval workflows.

## Features

- JWT authentication and authorization
- Role-based modules (auth, users, claims, dashboard)
- Expense claim lifecycle management
- OpenAPI/Swagger documentation
- Redis caching support
- Cloudinary file upload support

## Tech Stack

- Node.js
- TypeScript
- Express
- Drizzle ORM
- PostgreSQL (Neon)
- Upstash Redis
- Cloudinary
- Zod

## Project Structure

```text
src/
  app.ts
  server.ts
  modules/
    auth/
    users/
    claims/
    dashboard/
  middlewares/
  database/
  docs/
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

DATABASE_URL=postgresql://user:password@host/dbname

UPSTASH_REDIS_REST_URL=https://your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

ACCESS_TOKEN_SECRET=your-secret-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Run in development

```bash
npm run dev
```

### 4. Build and run production

```bash
npm run build
npm start
```

## API Endpoints

Base URL (local):

```text
http://localhost:8000/api/v1
```

Base URL (hosted):

```text
https://expense.divitperiwal.dev/api/v1
```

Available route groups:

- `/auth`
- `/users`
- `/claims`
- `/dashboard`

## API Documentation

Swagger UI:

```text
http://localhost:8000/api/docs
```

OpenAPI JSON:

```text
http://localhost:8000/api/docs?format=json
```

## Health Check

- `GET /`
- `GET /health`

## Scripts

- `npm run dev` - Start development server with watch mode
- `npm run build` - Compile TypeScript and rewrite aliases
- `npm start` - Run compiled app from `dist/server.js`
