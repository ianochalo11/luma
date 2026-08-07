# Solana Breakpoint 2026 — Event Page Clone

Pixel-close clone of the **single** Luma event page at
[luma.com/breakpoint2026](https://luma.com/breakpoint2026) — layout, email OTP auth,
registration, mocked USDC-on-Solana checkout, and an admin dashboard. Not a clone of
the full Luma product.

## Stack

- **Next.js 16** (App Router) · **React 19** · TypeScript · Tailwind CSS v4
- **Auth.js v5** (`next-auth`) · **MongoDB** via Mongoose · **Resend** (OTP email)
- react-hook-form + Zod · Zustand (ticket flow) · Framer Motion / Lucide
- **Vitest** + Testing Library · **Playwright** · ESLint + Prettier · Husky

## Architecture

```
src/
  app/                 # Routes, layouts, API route handlers
    (marketing)/       # Landing event page `/`
    (auth)/            # `/sign-in`, `/sign-up`
    (account)/         # `/profile`, `/settings` (middleware-guarded)
    admin/             # Admin dashboard (admin-only)
    api/               # Auth, OTP, follows, registrations, me, events
    event/[slug]/      # Register (+ checkout soft-redirect)
  components/          # Presentational / interactive UI (feature folders)
  constants/           # Copy, links, theme tokens, layout, access codes
  hooks/               # Client state helpers (session, wallet, ticket flow)
  lib/                 # Server + shared business logic
    auth/              # Auth.js config + OTP + Resend
    db/                # Mongoose client, models, repositories, seed
    checkout/          # Registration payment orchestration
    solana/            # Mock wallet / tx
    validation/        # Zod schemas
  styles/              # next/font setup
  types/               # Shared TypeScript types
  middleware.ts        # Protects account + admin routes
tests/
  unit/                # Vitest
  e2e/                 # Playwright (+ credentials helper for auth)
```

### Principles

- **Server Components by default.** `'use client'` only where interactivity or browser APIs are required.
- **Business logic lives in `lib/`** (auth, DB repositories, checkout, validation). Components orchestrate UI and call those helpers.
- **Constants are the source of truth for copy and URLs** (`event-content.ts`, `links.ts`). Theme tokens are mirrored in `globals.css` + `constants/theme.ts` (CSS is runtime).
- **Absolute imports:** `@/*` → `src/*`.
- **Edge vs Node auth split:** `lib/auth/config.ts` is edge-safe for middleware; providers/DB live in `lib/auth/index.ts`.

## Auth

Primary UX is **email OTP** (Luma-style modal + `/sign-in`):

1. User enters email → `POST /api/auth/otp/send` stores a hashed code and emails it via Resend.
2. User enters 6-digit code → Auth.js `email-otp` credentials provider verifies and upserts a MongoDB user.
3. Optional **Google** when `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are set.
4. **`/sign-up`** still uses the credentials provider (password ≥ 4 chars) for a simple create-account path.
5. **Admin:** only `ADMIN_EMAIL` (`lumacentre545@gmail.com`) gets `isAdmin` and can open `/admin-145678` (login at `/admin-145678/login` — no public sign-up).
6. Middleware (`src/middleware.ts`) redirects unauthenticated users away from `/profile`, `/settings`, and `/admin-145678`, and non-admins away from the console.

## MongoDB

Singleton connection in `src/lib/db/client.ts`. Models: Users, Events, Registrations, Follows, Otps.

Repositories under `src/lib/db/repositories/` are the only layer that talks to Mongoose from app code. Seed runs lazily on first auth (`seedDatabase`) to ensure the Breakpoint event + demo admin exist.

## Admin dashboard

`/admin-145678` (admins only) — summary stats, bookings list/detail, users list. Login-only at `/admin-145678/login`. Built as colocated App Router UI under `src/app/admin-145678/` with shared table/chrome components.

## Checkout / mock wallet

Registration + payment live on `/event/breakpoint2026/register`. The old `/checkout` path soft-redirects there.

Flow (`lib/checkout` + `lib/solana/mock-tx.ts`):

1. Connect mock wallet (~900ms)
2. Balance check always passes for the demo
3. Confirming → success with a mock signature; booking POST is best-effort

Demo access codes: `SOLANA10` ($55 off), `BREAKPOINT` ($50 off). Form state persists in Zustand (`breakpoint-ticket-flow` in localStorage).

## Environment

Copy `.env.example` → `.env.local`:

| Variable                                | Required    | Purpose                                                             |
| --------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `AUTH_SECRET`                           | Yes (prod)  | Auth.js secret (dev has a fallback)                                 |
| `AUTH_URL`                              | Recommended | e.g. `http://localhost:3000`                                        |
| `MONGODB_URI`                           | Yes         | Atlas / local Mongo connection string                               |
| `MONGODB_DB`                            | No          | Database name (default `luma`)                                      |
| `ADMIN_EMAIL`                           | Recommended | Promoted to `isAdmin` on upsert/seed                                |
| `RESEND_API_KEY`                        | Yes for OTP | Sends sign-in codes                                                 |
| `RESEND_FROM`                           | Yes for OTP | From address on verified domain (e.g. `Luma <support@luma.center>`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | No          | Google sign-in                                                      |
| `NEXT_PUBLIC_SOLANA_*`                  | No          | Reserved for a real RPC later                                       |

## Scripts

```bash
cd luma
npm install
npm run dev        # http://localhost:3000
npm run build
npm start
npm run lint
npm test           # Vitest unit tests
npm run test:e2e   # Playwright (starts next the first time)
```

Playwright covers landing smoke, registration checkout chrome, and a credentials-based
session helper (`tests/e2e/helpers/auth.ts`). Product sign-in remains email OTP; the
credentials provider is used for `/sign-up` and deterministic e2e auth (no Resend).

## Swapping toward production

1. Set a strong `AUTH_SECRET`, real Resend domain/`RESEND_FROM`, and (optional) Google OAuth.
2. Whitelist your IP (or appropriate CIDR) in Atlas Network Access.
3. Replace `lib/solana/mock-tx.ts` with a real wallet adapter + RPC/treasury.
4. Prefer DB/API-backed event payloads over `BREAKPOINT_EVENT` constants when multi-event support lands.
