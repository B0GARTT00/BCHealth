# Development

## Environment

Copy `.env.example` to `.env` and replace secrets before running outside local development.

## Commands

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev --workspace @bchealth/api
npm run dev --workspace @bchealth/web
```

## Implementation Order

The project should advance phase by phase:

1. Foundation
2. Database
3. Authentication and RBAC
4. Patient management
5. Clinic visits and consultations
6. Appointments
7. Requirements and clearances
8. Inventory
9. Certificates and documents
10. Reports, notifications, archives, audit, testing, and deployment

Each feature should include schema changes, DTOs, services, controllers, authorization, frontend integration, tests, and documentation updates.
