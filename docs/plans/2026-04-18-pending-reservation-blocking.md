# Pending Reservation Blocking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Block any date with a pending or confirmed reservation and move the additional textbook section below course selection in the reservation form.

**Architecture:** Update the shared server-side availability calculator so non-cancelled reservations create a dedicated day-level blocked reason before configurable capacity checks run. Reorder the form sections in the existing React page without changing field behavior or payload structure.

**Tech Stack:** Express, Prisma, React 19, TypeScript, Vite

---

### Task 1: Add reservation-hold blocking to availability

**Files:**
- Modify: `server/src/lib/availability.ts`
- Modify: `src/lib/types.ts`

**Step 1:** Add a `reserved` blocked-date reason to the shared types.

**Step 2:** Mark any date with a non-cancelled reservation as blocked before daily/weekly/monthly limit checks.

**Step 3:** Preserve existing manual-block precedence.

### Task 2: Reorder the form sections

**Files:**
- Modify: `src/pages/ReservationFormPage.tsx`

**Step 1:** Keep the `受講内容` card where it is.

**Step 2:** Move `追加テキスト購入` to immediately after it.

**Step 3:** Leave behavior and copy intact.

### Task 3: Verify regression scope

**Files:**
- Verify only

**Step 1:** Run `npm run lint`.

**Step 2:** Run `npm run check:server`.

**Step 3:** Run `npm run build`.
