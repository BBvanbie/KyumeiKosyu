# Reservation Complete Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dedicated post-submit completion page that displays the reservation number and confirmation key after a successful reservation.

**Architecture:** Keep `/reserve/confirm` as the draft-backed pre-submit page and route successful submissions to a new `/reserve/complete` page. Move the transient completion modal responsibility into a full-page route that reads router state and provides clear return actions.

**Tech Stack:** React 19, TypeScript, React Router, Vite, Vitest, Testing Library

---

### Task 1: Add the completion route and page

**Files:**
- Create: `src/pages/ReservationCompletePage.tsx`
- Modify: `src/router/index.tsx`

**Step 1:** Add a new page for `/reserve/complete`.

**Step 2:** Read `reservationNumber` and `confirmationCode` from route state.

**Step 3:** Show a safe fallback panel when the state is missing.

### Task 2: Redirect submit success to the completion page

**Files:**
- Modify: `src/pages/ReservationConfirmPage.tsx`
- Delete or stop using: `src/components/booking/CompletionModal.tsx`

**Step 1:** Remove the transient completion modal flow.

**Step 2:** Navigate to `/reserve/complete` after a successful submit.

**Step 3:** Clear the booking draft before navigation so the old confirm page remains draft-only.

### Task 3: Verify rendering and regressions

**Files:**
- Verify only

**Step 1:** Run `npm run lint`.

**Step 2:** Run `npm run build`.
