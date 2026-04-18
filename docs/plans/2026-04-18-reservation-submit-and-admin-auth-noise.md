# Reservation Submit And Admin Auth Noise Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix guest reservation submission failures and remove expected admin auth noise from public-page startup.

**Architecture:** Keep the reservation form state shape unchanged, but normalize the outgoing reservation payload so only valid reservation rows are submitted. Change the admin session probe endpoint to return a non-error unauthenticated response so the shared auth bootstrap can run on public pages without producing console noise.

**Tech Stack:** React 19, TypeScript, Vite, Express, Zod, Vitest

---

### Task 1: Normalize reservation submit payload

**Files:**
- Create: `src/lib/reservationPayload.ts`
- Modify: `src/pages/ReservationConfirmPage.tsx`
- Test: `src/lib/reservationPayload.test.ts`

**Step 1:** Add a helper that filters out unselected reservation rows before submit.

**Step 2:** Use the helper from the confirm page instead of posting the raw booking draft.

**Step 3:** Add a Vitest case proving blank rows are removed and valid rows remain.

### Task 2: Quiet unauthenticated admin bootstrap

**Files:**
- Modify: `server/src/routes/adminAuth.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/context/AuthContext.tsx`

**Step 1:** Return `200` with `authenticated: false` and `username: null` from `/api/admin/me` when no admin session exists.

**Step 2:** Update client typing to accept the unauthenticated response shape.

**Step 3:** Make auth state assignment depend on the `authenticated` flag instead of assuming `username` always exists.

### Task 3: Verify regression scope

**Files:**
- Verify only

**Step 1:** Run `npm run test -- src/lib/reservationPayload.test.ts`.

**Step 2:** Run `npm run lint`.

**Step 3:** Run `npm run build`.
