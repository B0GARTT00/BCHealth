# API

The API is exposed under `/api` and documented through Swagger at `/api/docs`.

Initial endpoints:

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users`
- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients`

All sensitive endpoints must use JWT authentication, RBAC, DTO validation, and patient ownership checks where applicable.
