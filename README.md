# Task Genie

Task Genie is a production-minded prototype for a two-sided remote hiring marketplace connecting Filipino professionals with global employers. It uses trust-first minimalism for public and job-seeker experiences, with a denser recruiting command center for employers.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). This is a static, populated product preview: no account or real credentials are required. Forms are prefilled and intentionally skip validation. Each fresh page visit restores its seeded data; interactions remain local and never submit applications, send real messages, or charge payments.

## Key routes

- Public: `/`, `/jobs`, `/jobs/executive-assistant`, `/how-it-works`, `/pricing`, `/login`, `/signup`, `/about`, `/trust`, `/support`
- Job seeker: `/dashboard`, `/profile`, `/profile/verification`, `/saved-jobs`, `/applications`, `/messages`, `/payments`, `/settings`
- Employer: `/employer/talent`, `/employer/shortlist`, `/employer/post-job`, `/employer/pipeline`, `/employer/messages`, `/employer/jobs`, `/employer/billing`, `/employer/settings`

## Architecture

- `src/config`: product constants, routes, and feature switches
- `src/domain`: typed marketplace models
- `src/data`: replaceable fixtures standing in for repository/API data
- `src/lib`: pure search and profile-completeness rules with tests
- `src/components`: interactive prototype surfaces and shared UI
- `src/server/paypal`: reserved server-only payment adapter boundary (not deployed to Pages)

The prototype uses a typed, in-memory preview store. Every screen includes complete professional content and representative records. Job responsibilities, compensation, schedules, skills, and direct-hiring flows take their content structure from [OnlineJobs.ph](https://www.onlinejobs.ph/), without copying real people's profiles or implying live job availability. Search falls back to relevant recommendations instead of an empty screen. In production, replace fixtures with authenticated repositories while retaining the domain contracts.

## Visual skin

Every route uses the supplied SpaceCrew-inspired Task Genie skin. Its extracted light/dark theme is in `src/app/spacecrew.css`, with cross-route adaptations in `src/app/spacecrew-app.css`. The supplied logo variants live in `public/brand`. The theme toggle saves the visitor's preference locally; it does not affect account data.

## PayPal sandbox boundary

The UI uses preview-only billing and does not call a payment endpoint. The reserved server adapter is not deployed on GitHub Pages; it never creates or captures a live payment. Before production, implement server-side OAuth exchange, idempotent create/capture endpoints, webhook verification, subscription reconciliation, and audited entitlement updates. Do not add real credentials to the prototype.

## Quality checks

```bash
pnpm check
```

This runs ESLint, TypeScript, Vitest, and a production build.

## Before production

Add real authentication and authorization, database repositories, file scanning/storage, verification vendors, moderation tools, transactional messaging, PayPal sandbox webhooks, analytics consent, rate limiting, audit logs, and end-to-end tests. All names, companies, and data in this repository are fictional.
