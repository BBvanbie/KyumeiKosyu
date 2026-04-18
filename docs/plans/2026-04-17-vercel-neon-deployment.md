# Vercel Neon Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the existing Render deployment guidance with a Vercel frontend + Vercel API + Neon database deployment guide.

**Architecture:** Keep the current Vite frontend unchanged, keep the existing Express API, and deploy them as two separate Vercel projects. The frontend uses `VITE_API_BASE_URL` to call the API project, and the API uses Neon through `DATABASE_URL`.

**Tech Stack:** Vite, React, Express, Prisma, PostgreSQL, Vercel, Neon

---

### Task 1: Capture the deployment decision

**Files:**
- Create: `docs/plans/2026-04-17-vercel-neon-deployment-design.md`

**Step 1: Write the decision record**

- Document the chosen topology: frontend Vercel, API Vercel, database Neon.

**Step 2: Record alternatives**

- Summarize the rejected options:
  - single-project Vercel API colocation
  - full Next.js migration

**Step 3: Record the reasoning**

- Explain that this is the minimum-change path to remove Render while keeping the current codebase structure.

### Task 2: Replace the root deployment handoff

**Files:**
- Modify: `DEPLOY_VERCEL_RENDER.md`

**Step 1: Replace Render-specific content**

- Remove Render PostgreSQL creation steps
- Remove Render Web Service steps
- Remove Render-specific troubleshooting

**Step 2: Write Vercel + Neon guidance**

- Add frontend Vercel project setup
- Add API Vercel project setup
- Add Neon environment variable setup
- Add local DB initialization commands

**Step 3: Make the handoff concrete**

- Include exact environment variable names
- Include example URLs
- Include verification steps for health endpoint, booking flow, and admin login

### Task 3: Verify references against the current repo

**Files:**
- Verify only:
  - `src/lib/api.ts`
  - `server/src/index.ts`
  - `.env.example`
  - `prisma/schema.prisma`
  - `prisma/seed.ts`

**Step 1: Confirm required env vars**

- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CLIENT_ORIGIN`
- `VITE_API_BASE_URL`

**Step 2: Confirm runtime assumptions**

- The API still runs from `server/src/index.ts`
- DB initialization still depends on `prisma db push` and `prisma:seed`

**Step 3: Sanity-check the guide**

- Ensure every command and file path in the handoff exists in this repository

### Task 4: Final review

**Files:**
- Review:
  - `DEPLOY_VERCEL_RENDER.md`
  - `docs/plans/2026-04-17-vercel-neon-deployment-design.md`
  - `docs/plans/2026-04-17-vercel-neon-deployment.md`

**Step 1: Check for stale Render references**

- Remove or replace any remaining Render-only instructions

**Step 2: Check user-facing clarity**

- Keep the guide ordered by execution sequence
- Keep examples aligned with `kyumei-kosyu.vercel.app`

**Step 3: Prepare handoff**

- Point the user to the root deployment guide as the operational document

