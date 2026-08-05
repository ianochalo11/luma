<!--
## Layout analysis — https://luma.com/breakpoint2026

Two-column light SaaS layout (updated to match visual reference):
- LEFT (380px sticky): square cover `rounded-2xl` → Presented by + Follow + socials →
  Hosted By + Contact/Report text links → `# Crypto` pill.
- RIGHT: Featured in London → title → date/location rows → inline Get Tickets card →
  About Event → Location + Google Maps embed.
- Theme: `#F4F2FA` ground, white cards, accent `#6D5BD0` — not dark mode.
- Auth-consistent navbar: signed-out Discover/Sign In; signed-in Events/Calendars/Discover
  + clock + Create Event + bell + avatar.
-->

# Solana Breakpoint 2026 — Event Page Clone

Pixel-close clone of the **single** Luma event page at
[luma.com/breakpoint2026](https://luma.com/breakpoint2026) — layout, registration, and
mocked USDC-on-Solana checkout. Not a clone of the Luma product.

## Status

| Phase | Scope                                                    | Status |
| ----- | -------------------------------------------------------- | ------ |
| 1     | Folder scaffold + design tokens + content/link constants | Done   |
| 2     | Landing page (`/`)                                       | Done   |
| 3     | Registration + payment flow                              | Done   |
| 4     | Auth (sign-in, profile, settings) + middleware guards    | Done   |
| 5     | MongoDB + Follow + Admin dashboard                       | Done   |

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4
- NextAuth.js (Auth.js) v5 · react-hook-form + zod · Zustand (minimal)
- `@solana/wallet-adapter-*` (mocked tx lifecycle only — **installed in Phase 3**)
- Vitest + RTL · Playwright · ESLint + Prettier · Husky + lint-staged

1. **Light vs dark:** The live Breakpoint page is a **light lavender** surface
   (`#f4f0f9`) with purple CTA `#836aa2`, not a near-black Luma shell. Tokens
   follow the sampled page. Say if you still want a forced dark override.
2. **Title font:** Live uses Typekit `alternate`; we use **Outfit** via `next/font`
   as a licensed stand-in (body = Inter).
3. **Solana packages:** Deferred to Phase 3 install (heavy / flaky on Windows).

## Architecture

Feature-based layout under `src/` (see folder tree in the build brief). Principles:

- Server Components by default; `'use client'` only for interactivity.
- All URLs in `src/constants/links.ts`; all copy in `src/constants/event-content.ts`.
- Theme tokens in `src/constants/theme.ts` mirrored into `src/app/globals.css` `@theme`.
- Absolute imports via `@/*` → `src/*`.

## Auth / session

Auth.js v5 (`src/lib/auth/index.ts`) + MongoDB (`src/lib/db`):

- **Sign-in modal:** navbar “Sign In” opens a Luma-style modal (email magic-link stub,
  Google when configured, Passkey stubbed).
- **Email:** `Continue with Email` upserts a User and signs in (magic-link stub).
- **Admin:** `ADMIN_EMAIL` / demo `josephwamiti8711@gmail.com` gets `isAdmin`
- **Follow:** persists in MongoDB; requires auth (modal → then follow).
- **Guards:** middleware protects `/profile`, `/settings`, `/admin`, checkout.
- **Dashboard:** `/admin` — bookings, users, summary stats (admins only).

## Database

MongoDB via Mongoose singleton (`src/lib/db/client.ts`). Collections: Users,
Events, Registrations, Follows. Set `MONGODB_URI` in `.env.local`.

## Mock wallet payment

Checkout uses `src/lib/solana/mock-tx.ts`:

1. **Connect** — mock address after ~900ms
2. **Balance check** — always enough USDC for demo
3. **Pay** — confirming → success with a mock signature

Demo access codes: `SOLANA10` ($55 off), `BREAKPOINT` ($50 off).

Form state persists in Zustand (`breakpoint-ticket-flow` localStorage) across register ↔ checkout.

## Dev

```bash
cd luma
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Swapping to production later

1. **Auth:** set real `AUTH_SECRET`, optional Google client IDs in `.env.local`.
2. **MongoDB:** whitelist your IP in Atlas Network Access (or `0.0.0.0/0` for demos).
3. **Solana:** point wallet adapter at a real RPC + treasury; replace `lib/solana/mock-tx.ts`.
4. **Events API:** pages still use `event-content` constants; DB holds the seeded Event row for follows/bookings.
