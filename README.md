# VaultCircle

> A fintech-inspired savings circle platform — built as a fullstack engineering submission for Abbey Mortgage Bank.

**Live Demo:** https://vaultcircle-tau.vercel.app
**Backend API:** https://vaultcircle-backend.onrender.com/health
**GitHub:** https://github.com/O-BERNARDOFOEGBU/vaultcircle

---

## What is VaultCircle?

VaultCircle is a community savings platform where users can form savings circles, invite members, and track collective financial goals. The concept is rooted in the traditional African "ajo" or "esusu" savings culture — digitised and made accessible via a clean, mobile-first web application.

The app was built to satisfy three core requirements:

- **Authentication** — Secure register, login, logout and session management via HTTP-only cookies
- **Accounts** — User profiles with bio, occupation and savings goal stored per user
- **Relationships** — Circles as the relationship layer: users can create circles, join circles, and view members

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript | React-based, file-system routing, SSR-ready |
| Styling | TailwindCSS | Utility-first, fast iteration, consistent design |
| State | Zustand | Lightweight global auth state without boilerplate |
| Data Fetching | TanStack React Query | Caching, loading states, refetch on focus |
| Backend | Node.js + Express + TypeScript | Familiar, minimal, easy to reason about |
| ORM | Prisma v6 | Type-safe queries, clean migrations, great DX |
| Database | PostgreSQL (Supabase) | Relational, reliable, free hosted tier |
| Auth | JWT in HTTP-only cookies | Secure, no localStorage exposure, works cross-origin |
| Validation | Zod | Runtime schema validation on both routes and forms |
| PWA | next-pwa + manifest.json | Mobile-app feel without a native codebase |
| Hosting | Vercel (frontend) + Render (backend) | Free tier, git-connected, auto-deploy on push |

---

## Architecture Overview

```
vaultcircle/
├── client/                        # Next.js 15 frontend (PWA)
│   ├── app/
│   │   ├── (auth)/                # Unauthenticated routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (app)/                 # Authenticated routes (protected)
│   │       ├── dashboard/
│   │       ├── circles/
│   │       │   └── [id]/
│   │       └── profile/
│   ├── components/
│   │   ├── nav/                   # AppShell, BottomNav
│   │   └── ui/                    # Button, Card, Input, Skeleton
│   ├── lib/
│   │   ├── axios.ts               # Axios instance (baseURL + withCredentials)
│   │   └── queryClient.ts         # TanStack Query config
│   ├── store/
│   │   └── auth.ts                # Zustand auth store
│   └── public/
│       ├── manifest.json          # PWA manifest
│       └── icon-192.png           # PWA icon
│
├── server/                        # Express + TypeScript backend
│   ├── prisma/
│   │   └── schema.prisma          # User, Circle, Membership models
│   └── src/
│       ├── config/env.ts          # Environment variable loader
│       ├── controllers/           # HTTP layer (auth, user, circle)
│       ├── services/              # Business logic (auth, user, circle)
│       ├── routes/                # Route definitions
│       ├── middleware/            # auth, validate, error handlers
│       ├── schemas/               # Zod validation schemas
│       └── utils/                 # JWT helpers, Morgan logger
│
└── docker-compose.yml             # Local PostgreSQL via Docker
```

---

## Database Schema

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  bio          String?
  occupation   String?
  savingsGoal  Int?
  createdAt    DateTime @default(now())
  circlesOwned Circle[]
  memberships  Membership[]
}

model Circle {
  id           String   @id @default(uuid())
  name         String
  description  String?
  targetAmount Int?
  ownerId      String
  createdAt    DateTime @default(now())
  owner        User     @relation(...)
  members      Membership[]
}

model Membership {
  id       String   @id @default(uuid())
  role     Role     @default(MEMBER)  // OWNER | MEMBER
  userId   String
  circleId String
  joinedAt DateTime @default(now())
  @@unique([userId, circleId])
}
```

---

## API Reference

All responses follow the format: `{ success: true, data: {} }` or `{ success: false, message: "..." }`

### Auth Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user, sets cookie |
| POST | `/api/auth/login` | No | Login, sets cookie |
| POST | `/api/auth/logout` | No | Clears cookie |
| GET | `/api/auth/me` | Yes | Returns current user |

### User Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | Yes | Get own profile |
| PATCH | `/api/users/me` | Yes | Update bio, occupation, savingsGoal |
| GET | `/api/users/:id` | Yes | Get any user by ID |
| GET | `/api/users` | Yes | Get all users |

### Circle Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/circles` | Yes | Create a new circle |
| GET | `/api/circles` | Yes | Get all circles |
| GET | `/api/circles/:id` | Yes | Get circle with members |
| POST | `/api/circles/:id/join` | Yes | Join a circle |
| DELETE | `/api/circles/:id/leave` | Yes | Leave a circle |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Returns `{ status: "ok", uptime }` |

---

## Key Engineering Decisions

### JWT in HTTP-only cookies, not localStorage
Storing tokens in localStorage exposes them to XSS attacks. Using HTTP-only cookies means JavaScript cannot read the token at all — only the browser sends it automatically with each request. In production, cookies are set with `secure: true` and `sameSite: 'none'` to work across the Vercel/Render cross-origin setup.

### Clean architecture: Controllers vs Services
Controllers handle HTTP only — they read from `req`, call a service, and write to `res`. Services contain all business logic and never touch `req` or `res`. This separation makes the business logic independently testable and easy to follow.

### Zod for runtime validation
TypeScript types disappear at runtime. Zod schemas validate incoming request bodies at the route level before they reach the controller, returning structured validation errors rather than unexpected crashes.

### PWA over React Native
The challenge asked for a mobile demo. Rather than maintaining a separate React Native codebase (which would duplicate all business logic), we built a Progressive Web App that installs on mobile, runs standalone (no browser chrome), and uses a max-430px phone-frame layout that looks and feels native on every screen size. This is a deliberate architectural tradeoff — one codebase, full mobile experience, zero duplication.

### Prisma v6 with Supabase connection pooling
Supabase provides two connection strings — a direct URL for migrations and a pooled URL for runtime queries. Prisma's `directUrl` config uses the direct connection for `prisma migrate`, while `DATABASE_URL` uses PgBouncer pooling for all app queries, preventing connection exhaustion on the free tier.

### Manual CORS middleware over the `cors` package
Express 5 introduced breaking changes to route matching that caused the `cors` package's preflight handler to crash. We replaced it with a manual middleware that reads the `Origin` header and sets `Access-Control-Allow-Origin` dynamically, supporting both localhost development and all `*.vercel.app` production origins.

---

## Running Locally

### Prerequisites

- Node.js 18+
- Docker Desktop (for local PostgreSQL)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/O-BERNARDOFOEGBU/vaultcircle.git
cd vaultcircle
```

### 2. Start the database

```bash
docker-compose up -d postgres
```

This starts a PostgreSQL instance on `localhost:5432` with:
- User: `postgres`
- Password: `password`
- Database: `vaultcircle`

### 3. Set up the backend

```bash
cd server
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vaultcircle?schema=public"
JWT_SECRET="vaultcircle_super_secret_jwt_key_2024"
PORT=5001
NODE_ENV=development
```

Install dependencies and run migrations:

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Backend runs at `http://localhost:5001`

### 4. Set up the frontend

```bash
cd ../client
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Install and run:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### 5. Verify

Open `http://localhost:3000` and register an account. You should land on the dashboard.

To confirm data is persisting, connect DBeaver (or any Postgres client) to:
- Host: `localhost`
- Port: `5432`
- Database: `vaultcircle`
- User: `postgres`
- Password: `password`

---

## Deployment

| Service | Platform | Config |
|---|---|---|
| Frontend | Vercel | Root dir: `client`, env: `NEXT_PUBLIC_API_URL` |
| Backend | Render | Root dir: `server`, build: `npm install && npx prisma generate && npm run build`, start: `node dist/server.js` |
| Database | Supabase | PostgreSQL, eu-west-1, migrations via `prisma migrate deploy` |

### Backend environment variables (Render)

```
DATABASE_URL=postgresql://postgres.xxx:[password]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:[password]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=5001
```

---

## Scripts

### Backend (`/server`)

```bash
npm run dev       # Start with nodemon + ts-node (development)
npm run build     # Compile TypeScript to dist/
npm start         # Run compiled dist/server.js (production)
```

### Frontend (`/client`)

```bash
npm run dev       # Next.js dev server
npm run build     # Production build
npm start         # Serve production build
```

---

## Submission Checklist

- [x] Authentication — register, login, logout, session via HTTP-only cookies
- [x] Accounts — user profiles with bio, occupation, savings goal
- [x] Relationships — circles with owner/member roles, join/leave functionality
- [x] React + Node.js + Express + TypeScript ✓
- [x] PostgreSQL ✓
- [x] Production code publicly hosted on GitHub ✓
- [x] Frontend hosted on Vercel ✓
- [x] Backend hosted on Render ✓
- [x] Mobile experience via PWA ✓
- [x] Video demo — frontend (browser) + backend (Postman) + mobile (DevTools emulator)

---

## Author

Bernard Ofoegbu
Submission for Abbey Mortgage Bank — Fullstack Engineer Challenge
