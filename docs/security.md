# Security

BCHealth stores sensitive health information and defaults to least privilege.

Implemented foundation:

- Password hashing in seed and login flow
- JWT access token strategy
- Refresh token hash persistence and rotation
- Nest validation pipe with whitelisting
- Helmet security headers
- CORS configured by environment
- RBAC decorator and guard
- Sensitive user fields omitted from user listing responses
- Audit log entries on login and logout
- Rate limiting on authentication endpoints

Required next hardening:

- Global exception filter with sanitized Prisma errors
- Patient ownership guard for student and faculty/staff access
- Document download authorization
- Structured logger with sensitive-field redaction
- Broader audit coverage for sensitive reads and mutations
