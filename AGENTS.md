# Aboni — Base44 dev notes

Digital subscription store. React/Vite frontend + NestJS backend + MySQL.

## Architecture & wiring
- **Single-origin wiring.** Only port 3000 is public (mapped to the Vite dev server on 5173).
  Vite proxies `/api` and `/uploads` to the backend service (`http://backend:5000`).
  The backend has no public host port — it is reached only through the frontend proxy.
- `frontend/vite.config.ts` reads the proxy target from `API_PROXY_TARGET` (defaults to
  `http://localhost:5000` for local dev outside Docker). Do not hardcode a resolved host.

## Compose services (`docker-compose.base44.yml`)
- `db` — MySQL 8. Healthcheck via `mysqladmin ping`. NOTE: MySQL 8.4 removed
  `--default-authentication-plugin`; do NOT add it back. mysql2 connects fine with the
  default `caching_sha2_password`.
- `backend-setup` — one-shot: `npm install && npm run migrate && npm run seed`, exits.
  Depends on `db` healthy.
- `backend` — `npm install && npm run start:dev` (Nest watch mode). Depends on `db` healthy
  and `backend-setup` completed successfully.
- `frontend` — `npm install && npm run dev -- --host 0.0.0.0`. Port 3000:5173.
- `node_modules` for backend/frontend live in named volumes (not bind-mounted) to avoid
  host-platform churn.

## Credentials (all local-infra, NOT user secrets)
- DB root password: `636363`, database `aboni`. JWT secret is a dev placeholder.
- No external-service secrets are required to boot.

## Seed accounts
| Email | Password | Role |
|-------|----------|------|
| admin@aboni.dz | Admin@1234 | super_admin |
| staff@aboni.dz | Staff@1234 | admin |
| user@aboni.dz | User@1234 | user |

## Verifying it works
- `curl http://localhost:3000` → Vite-served HTML (live source, not a prebuilt bundle).
- `curl http://localhost:3000/api/health` → `{"success":true,...}`.
- `curl http://localhost:3000/api/products` → seeded product list.

## Re-running migrations/seeds
`docker compose -f docker-compose.base44.yml run --rm backend-setup sh -c "npm run migrate && npm run seed"`
(depends_on still waits for db). To reset the DB: `docker compose ... down -v` then `up -d`.
