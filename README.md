# Doctor Tracker

Doctor Tracker is a focused administrative portal for securely maintaining doctors, their patient assignments, and operational health insights. It combines searchable directories, efficient record workflows, and responsive analytics in a professional clinical interface.

## Setup guide

### Prerequisites

- Node.js 24 LTS
- pnpm 10+
- The separate Doctor Tracker Express API running locally

### Installation

1. In the backend repository, copy `.env.example` to `.env`, configure MongoDB, run `pnpm install`, `pnpm seed`, and `pnpm dev`.
2. In this repository, copy `.env.example` to `.env.local`.
3. Install dependencies with `pnpm install`.
4. Start the frontend with `pnpm dev`.
5. Open `http://localhost:3000` and sign in using the admin credentials configured in the backend.

`API_SERVER_URL` defaults to `http://localhost:5001`. The Next.js server transparently rewrites `/api/*` requests to the standalone Express service, keeping browser sessions same-origin.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build the production application |
| `pnpm lint` | Run Next.js ESLint rules |
| `pnpm typecheck` | Validate TypeScript |
| `pnpm test` | Run component tests |
| `pnpm test:e2e` | Run Playwright desktop and mobile tests |

## System architecture

```text
Browser
  └─ Next.js App Router UI
       ├─ TanStack Query cache
       ├─ Protected route layout
       └─ Same-origin /api rewrite
              └─ Express REST API
                   ├─ JWT cookie authorization
                   ├─ Zod validation
                   └─ Mongoose → MongoDB (doctor_tracking)
```

## Technical decisions

### TanStack Query and URL state over Redux

The portal’s shared state is predominantly remote server data. TanStack Query provides caching, request deduplication, invalidation after mutations, and clear loading/error states without introducing a global reducer layer. Search filters and pagination live in URL parameters so views are refresh-safe and shareable.

### Referenced patient documents over embedded arrays

Patients are stored in their own collection with an indexed doctor reference. This supports global patient pagination and filtering, avoids unbounded doctor documents, and enables efficient aggregate analytics without loading entire patient lists into application memory.

## Visual evidence

Desktop and mobile captures are generated from the seeded local application:

- `docs/screenshots/dashboard-desktop.png`
- `docs/screenshots/patients-mobile.png`

## Deployment

Deploy the frontend and backend as separate Node.js services. Set `API_SERVER_URL` on the frontend and configure the backend’s `FRONTEND_ORIGIN`, secure cookie setting, MongoDB URI, JWT secret, and admin seed variables. Replace the repository and live project links below after deployment.

- Live project: _To be added_
- Frontend repository: _To be added_
- Backend repository: _To be added_

This assessment project is an administrative tracker, not a certified electronic medical-record or regulatory-compliance platform.
