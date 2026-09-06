# BCHealth

BCHealth is a web-based clinic information and records management system for a private higher-education institution in Davao City. It is designed as a secure modular monolith, not a hospital system.

## Architecture

- `apps/api`: NestJS REST API with Prisma, JWT authentication, RBAC guards, validation, Swagger, and MySQL configuration.
- `apps/web`: React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod, Axios, and Lucide React.
- `packages/types`: Shared API-facing TypeScript types.
- `packages/config`: Shared role and permission constants.
- `prisma`: Database schema, migrations, and seed data.
- `docs`: Architecture, database, API, security, and development notes.

## Prerequisites

- Node.js 24+
- npm 11+
- MySQL 8.4+ or Docker

## Installation

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Demo accounts use `DemoPass123!` and are clearly marked with `*.demo@bchealth.local` emails.

## Development

```bash
npm run dev --workspace @bchealth/api
npm run dev --workspace @bchealth/web
```

The API runs at `http://localhost:3000/api`.
Swagger runs at `http://localhost:3000/api/docs`.
The web app runs at `http://localhost:5173`.

## Docker

```bash
docker compose up --build
```

Local development is also supported without Docker by running MySQL separately and using `.env`.

## Testing

```bash
npm test
```

## Security Notes

BCHealth handles sensitive health information. Backend authorization is mandatory for sensitive endpoints. Private documents must never be served from public URLs. Audit logs should record important access and mutations without storing unnecessary medical details or secrets.
