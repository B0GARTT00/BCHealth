# Architecture

BCHealth uses a modular monolith split into a frontend application, backend API, shared packages, and Prisma-managed database schema.

## Backend

The NestJS API is organized by feature modules. Controllers handle HTTP boundaries, DTOs validate input, services own business rules, Prisma owns persistence, and guards enforce authentication and role-based authorization.

Initial modules:

- Auth
- Users
- Patients
- Health
- Prisma

Planned modules follow the domain boundaries in the master build prompt: visits, consultations, appointments, requirements, clearances, vaccinations, screenings, inventory, emergencies, certificates, documents, reports, notifications, announcements, archives, and audit.

## Frontend

The React app uses route-level pages and reusable layout/components. The first shell includes institutional navigation, dashboard status, login form validation, and registered routes for the expected modules.

Frontend restrictions are convenience only. Sensitive access must be enforced by backend guards and patient ownership checks.
