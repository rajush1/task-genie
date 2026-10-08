# Task Genie

Task Genie is a production-minded prototype for a worldwide, two-sided remote hiring marketplace connecting professionals and employers across countries. It uses trust-first minimalism for public and job-seeker experiences, with a denser recruiting command center for employers.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). This is a static, populated product preview: no account or real credentials are required. Forms are prefilled and intentionally skip text-field validation. Apply Points, applications, verification, employer Favorites/tags/hiring stages, and the freelancer waitlist receipt persist locally in this browser; other screens restore their populated examples on a fresh visit. Interactions never send real applications, waitlist registrations, emails, or messages or charge payments.

## Key routes

- Public: `/`, `/jobs`, `/jobs/executive-assistant`, `/how-it-works`, `/pricing`, `/spacecrew`, `/freelancer-waitlist`, `/login`, `/signup`, `/about`, `/trust`, `/support`
- Job seeker: `/dashboard`, `/profile`, `/profile/verification`, `/saved-jobs`, `/applications`, `/apply-points`, `/messages`, `/payments`, `/settings`
- Employer: `/employer/talent`, `/employer/favorites`, `/employer/shortlist`, `/employer/post-job`, `/employer/pipeline`, `/employer/messages`, `/employer/jobs`, `/employer/billing`, `/employer/settings`

## Architecture

- `src/config`: product constants, routes, and feature switches
- `src/domain`: typed marketplace models
- `src/data`: replaceable fixtures standing in for repository/API data
- `src/lib`: pure search, profile-completeness, and Apply Points rules with tests
- `src/components`: interactive prototype surfaces and shared UI
- `src/server/paypal`: reserved server-only payment adapter boundary (not deployed to Pages)

The prototype uses a typed preview store with browser-local persistence for Apply Points, submitted applications, and employer talent organization. Every screen includes complete professional content and representative records. Job responsibilities, compensation, schedules, skills, and direct-hiring flows take their content structure from [OnlineJobs.ph](https://www.onlinejobs.ph/), without copying real people's profiles or implying live job availability. Public job search falls back to relevant recommendations. Employer collections and job filters show only actual matches, with useful actions when a selection has no matches, rather than inserting unrelated profiles. In production, replace fixtures with authenticated repositories while retaining the domain contracts.

The `/spacecrew` marketing page explains SpaceCrew managed VA services alongside Task Genie's self-service marketplace. It shows no SpaceCrew pricing and sends interested employers to SpaceCrewHQ's existing enquiry form; it does not collect enquiries in this prototype.

## Apply Points prototype

The verified Ana account starts with 40 AP and earns up to 10 more on its first job-seeker workspace or application-page visit each local calendar day. Unused points carry over, capped at 60; visiting at the cap records the day without credit, so spending later that day does not create another grant. Applications require at least one whole point and enough balance, are charged once, and show the chosen points in the employer pipeline. Points cannot be purchased and are not refunded for unsuccessful applications.

The wallet, point history, submitted introductions, and Ana's employer-pipeline stages are stored under `task-genie-apply-points-v1` in localStorage. They are not synchronized across browsers or devices, and clearing this site’s browser data resets the example account. The prototype has no real login, identity check, or secure account ledger. Before production, move daily crediting and atomic application debits to an authenticated server with a canonical timezone, idempotency, and database transactions.

## Employer Favorites, tags, and job shortlists

Favorites are an employer-wide running list available from talent search and application details. A freelancer does not need to apply before being favorited or tagged. Employer tags are free-form, removable, searchable, and filterable; they are separate from the freelancer’s skills and application stages.

Shortlisting is an application stage, never a global freelancer flag. `/employer/shortlist?job=executive-assistant` shows only shortlisted applicants for that role. Each job post links to its own shortlist and filtered pipeline. An employer can shortlist/remove an existing application, and changing one application never changes that freelancer’s applications to other jobs or their Favorites/tags. Profiles without applications have no shortlisting action.

Favorites, tags, and stages for all example applications persist under `task-genie-employer-organization-v1`. Restoration matches application ID, candidate ID, and job ID; a stored stage cannot create a new application. Apply Points and introductions remain in their separate store and are restored first. This is browser-local demonstration data, not a private production employer account. Real deployment needs authenticated employer ownership and server-side checks that the application belongs to the employer’s job.

## Freelancer waitlist prototype

The worldwide `/freelancer-waitlist` interest-registration page is linked from the homepage, public navigation, footer, and freelancer signup. Its short professional profile form is prefilled and has no blocking field validation. Submission shows a reviewable receipt; returning visitors can edit their details rather than create a duplicate entry. It is separate from account registration, job applications, Apply Points, and SpaceCrew managed services.

The page follows the signup pattern on [StreetTeams](https://www.streetteams.com/join/), adapted from local creators to worldwide freelancers with country/time zone, professional expertise, experience, availability, and portfolio. It does not copy StreetTeams branding or its US-only ZIP requirement.

A single visitor's entry is stored locally under `task-genie-freelancer-waitlist-v1`. There is no live waitlist database, employer access to these details, queue ranking, or email delivery. Storage failures keep an in-memory receipt for the current visit. Before launch, add an authenticated administration workflow, a consent/privacy policy, secure collection endpoint, deduplication, and email delivery. Browser-local receipts are not production registrations.

## Visual skin

Every route uses the supplied SpaceCrew-inspired Task Genie skin. Its extracted light/dark theme is in `src/app/spacecrew.css`, with cross-route adaptations in `src/app/spacecrew-app.css`. The supplied logo variants live in `public/brand`. The theme toggle saves the visitor's preference locally; it does not affect account data.

Shared form spacing, custom native-select chevrons, mobile control sizing, and dark inset surfaces are normalized in `src/app/ui-polish.css`, loaded after page-specific styles. Keep dropdown arrow gutters intact when adding new select controls. Auth cards use explicit inner padding; password fields show a unified focus state. The UI pass covers all 53 product routes at desktop, tablet, and narrow-phone sizes, with light/dark spot checks for interactive forms and inset panels.

`src/app/brand-surfaces.css` shares the waitlist's ambient purple/pink background with signup/login, public marketing heroes, information-page headers, and promotional banners. It is loaded last to preserve heading and body-text contrast in both themes. Forms, pricing controls, and data cards retain their neutral themed surfaces.

## PayPal sandbox boundary

The UI uses preview-only billing and does not call a payment endpoint. The reserved server adapter is not deployed on GitHub Pages; it never creates or captures a live payment. Before production, implement server-side OAuth exchange, idempotent create/capture endpoints, webhook verification, subscription reconciliation, and audited entitlement updates. Do not add real credentials to the prototype.

## Quality checks

```bash
pnpm check
```

This runs ESLint, TypeScript, Vitest, and a production build.

## Before production

Add real authentication and authorization, database repositories, file scanning/storage, verification vendors, moderation tools, transactional messaging, PayPal sandbox webhooks, analytics consent, rate limiting, audit logs, and end-to-end tests. All names, companies, and data in this repository are fictional.
