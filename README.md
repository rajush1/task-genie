# Task Genie

Task Genie is a production-minded prototype for a worldwide, two-sided remote hiring marketplace connecting professionals and employers across countries. It uses trust-first minimalism for public and job-seeker experiences, with a denser recruiting command center for employers.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). This is a static, populated product preview: no account or real credentials are required. Forms are prefilled and intentionally skip text-field validation. The Apply Points balance, application records, and verification flag persist locally in this browser; other screens restore their populated examples on a fresh visit. Interactions never send real applications or messages or charge payments.

## Key routes

- Public: `/`, `/jobs`, `/jobs/executive-assistant`, `/how-it-works`, `/pricing`, `/spacecrew`, `/login`, `/signup`, `/about`, `/trust`, `/support`
- Job seeker: `/dashboard`, `/profile`, `/profile/verification`, `/saved-jobs`, `/applications`, `/apply-points`, `/messages`, `/payments`, `/settings`
- Employer: `/employer/talent`, `/employer/shortlist`, `/employer/post-job`, `/employer/pipeline`, `/employer/messages`, `/employer/jobs`, `/employer/billing`, `/employer/settings`

## Architecture

- `src/config`: product constants, routes, and feature switches
- `src/domain`: typed marketplace models
- `src/data`: replaceable fixtures standing in for repository/API data
- `src/lib`: pure search, profile-completeness, and Apply Points rules with tests
- `src/components`: interactive prototype surfaces and shared UI
- `src/server/paypal`: reserved server-only payment adapter boundary (not deployed to Pages)

The prototype uses a typed preview store with browser-local persistence for Apply Points and submitted applications. Every screen includes complete professional content and representative records. Job responsibilities, compensation, schedules, skills, and direct-hiring flows take their content structure from [OnlineJobs.ph](https://www.onlinejobs.ph/), without copying real people's profiles or implying live job availability. Search falls back to relevant recommendations instead of an empty screen. In production, replace fixtures with authenticated repositories while retaining the domain contracts.

The `/spacecrew` marketing page explains SpaceCrew managed VA services alongside Task Genie's self-service marketplace. It shows no SpaceCrew pricing and sends interested employers to SpaceCrewHQ's existing enquiry form; it does not collect enquiries in this prototype.

## Apply Points prototype

The verified Ana account starts with 40 AP and earns up to 10 more on its first job-seeker workspace or application-page visit each local calendar day. Unused points carry over, capped at 60; visiting at the cap records the day without credit, so spending later that day does not create another grant. Applications require at least one whole point and enough balance, are charged once, and show the chosen points in the employer pipeline. Points cannot be purchased and are not refunded for unsuccessful applications.

The wallet, point history, submitted introductions, and Ana's employer-pipeline stages are stored under `task-genie-apply-points-v1` in localStorage. They are not synchronized across browsers or devices, and clearing this site’s browser data resets the example account. The prototype has no real login, identity check, or secure account ledger. Before production, move daily crediting and atomic application debits to an authenticated server with a canonical timezone, idempotency, and database transactions.

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
