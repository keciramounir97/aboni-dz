# Aboni

Digital subscription store (Spotify, Netflix, PlayStation, Xbox, Snapchat, Disney+, YouTube) with multilingual storefront (EN / FR / AR) and admin panel.

## Stack

- **Frontend:** React + TypeScript, Vite (5173), Zustand, React Router, Tailwind, react-hook-form + zod
- **Backend:** NestJS + Express, Knex + Objection, MySQL (5000)
- **Auth:** JWT, roles `user` | `admin` | `super_admin`, checkbox permissions

## Quick start

```bash
# MySQL: create DB (password 636363)
mysql -u root -p636363 -e "CREATE DATABASE IF NOT EXISTS aboni;"

# Backend
cd backend
cp .env.example .env   # or use existing .env with DB_PASSWORD=636363
npm install
npm run migrate
npm run seed
npm run start:dev

# Frontend (other terminal)
cd frontend
npm install
npm run dev
```

- Store: http://localhost:5173  
- API: http://localhost:5000/api/health  

### Seed accounts

| Email | Password | Role |
|-------|----------|------|
| admin@aboni.dz | Admin@1234 | super_admin |
| staff@aboni.dz | Staff@1234 | admin |
| user@aboni.dz | User@1234 | user |

## Smoke test

```powershell
powershell -File scripts/smoke-test.ps1
```
