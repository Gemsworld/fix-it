# Fix-it — Home, handled.

A mobile-first Next.js application rebuilt from the supplied Fix-it source and both UI references. Uses TypeScript, React, Lucide icons, custom CSS clay surfaces, and locally bundled DM Sans / Manrope fonts.

## Run

Requires Node.js 20.9 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

The development script serves port 4173. For production, `npm run build` creates the `out/` static export. Serve it through any HTTPS static host. For a Node.js deployment instead, remove `output: 'export'` from next.config.ts and use `npm run build` then `npm start`. `out/` is a hosted export, not a file:// offline app.

## Routes

- `/` — landing page, twelve service categories, an interactive phone app screen, store download buttons, repair request modal, FAQs.
- `/login/` — email, Google and GitHub sign-in.
- `/signup/` — customer/artisan registration.
- `/forgot-password/` — password reset request.
- `/auth/callback/` — PKCE callback and password update.
- `/account/` — authenticated account shell, separate from operations demo.
- `/dashboard/` — separate nine-section operations interface. Hash links open individual tabs, for example `/dashboard/#jobs`.
- `/legal/` — transparent preview privacy and terms notes.

## Enable authentication

No provider keys were supplied. The UI intentionally explains this instead of simulating a successful social login.

1. Create a Supabase project. Put its project URL and public anon key in `.env.local` using the names in `.env.example`. Never put a service-role key in browser configuration.
2. In Supabase Authentication, enable Email, Google and GitHub providers. Supply Google OAuth client credentials and a GitHub OAuth app client ID and secret in Supabase's provider settings. Use the Supabase callback URL shown there as the provider application's authorised callback.
3. Set the application Site URL to the production origin. Add `http://localhost:4173/auth/callback/`, `http://localhost:4173/auth/callback/?recovery=1`, and the corresponding production callback URLs to the Supabase redirect allowlist.
4. Configure transactional SMTP and email confirmation/reset templates in Supabase.
5. Rebuild and redeploy. NEXT_PUBLIC variables are injected at build time.
6. Test signup and email confirmation, Google and GitHub sign-in, wrong-password handling, sign-out and password recovery on the actual production origin.

The implementation uses Supabase-managed sessions and PKCE. Authentication leads to `/account/`. It never grants operations privileges based on user-editable signup metadata. The dashboard is an explicitly public local-data demo, not a protected admin application.

## Dashboard sections and interactions

1. Overview — calculated totals, attention cards, recent jobs, notifications.
2. Jobs & dispatch — search, status filters, pagination, create job, assign approved artisan, change status.
3. Artisans — filter applications and profiles, approve/reject/request information locally.
4. Customers — records derived from jobs, search and linked repair details.
5. Payments & payouts — computed local summaries, reviewed demo approvals, CSV export. No payments move.
6. Disputes — filter cases and mark resolved with a required note.
7. Services & pricing — edit twelve illustrative call-out fees.
8. Reports — calculations from current bookings, period filter, area value chart, CSV export.
9. Settings — editable profile, local notification preferences, reset demo data.

## Scope and production integration

This delivery implements the requested redesign and interaction layer. The source upload contained a landing page, not a repair marketplace backend. Dashboard records are fictional fixtures in `lib/data.ts` and persist under versioned localStorage keys. Repair requests are saved locally. No real identity verification, messaging, geolocation matching, dispatch, payouts, support service or native app-store release is connected.

For live operations, replace local storage with a server API/database, enforce server-side admin roles, validate inputs and permissions, add an audit log, integrate payments/webhooks and notifications, and connect artisan verification and job lifecycle endpoints. Review business terms before launch. Never expose real admin/customer data by reusing the public demo route without server-side authorisation.

## Validation

`npm run typecheck` and `npm run build`. Browser QA covers the home page, category search/request, authentication messaging and dashboard workflows. Live OAuth cannot be tested without supplied credentials.

## Assets and design

The original house-and-wrench logo is retained in `public/logo.svg`. Tool illustration and patterned backgrounds use native CSS/SVG. Fonts are bundled for independent delivery; licence files are included. No invented reviews or usage statistics appear as live marketplace claims.

## V2.1 design update

The landing search bar was removed. The floating header, service cards and supporting panels are more compact. The hero now shows an interactive phone screen with Home, Bookings, Help and Profile views. App Store and Google Play buttons appear in the hero and closing call to action. The bottom-right footer tagline was removed.

To connect official app downloads, set `NEXT_PUBLIC_APP_STORE_URL` to the published `https://apps.apple.com/...` listing and `NEXT_PUBLIC_PLAY_STORE_URL` to `https://play.google.com/...`, then rebuild. Until real listings are supplied, the buttons open an honest availability dialog. No app listing or native binary is fabricated.
