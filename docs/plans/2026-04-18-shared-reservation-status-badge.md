# Shared Reservation Status Badge Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify reservation status presentation between the public reservation lookup screen and the admin reservation list.

**Architecture:** Extract a small shared status badge component that owns the `ReservationStatus` label mapping and badge class names. Replace both the public lookup page and the admin list with the same component so color, wording, and spacing stay aligned.

**Tech Stack:** React 19, TypeScript, Vite

---

### Task 1: Create a shared reservation status badge

**Files:**
- Create: `src/components/booking/ReservationStatusBadge.tsx`

**Step 1:** Accept `ReservationStatus` as input.

**Step 2:** Map each status to a user-facing Japanese label.

**Step 3:** Render the existing badge classes so current CSS remains the visual source of truth.

### Task 2: Replace duplicated status rendering

**Files:**
- Modify: `src/pages/ReservationLookupResultPage.tsx`
- Modify: `src/pages/admin/AdminReservationsPage.tsx`

**Step 1:** Replace the public lookup screen's plain text status with the shared badge.

**Step 2:** Replace the admin list's inline badge markup with the shared badge.

### Task 3: Verify regression scope

**Files:**
- Verify only

**Step 1:** Run `npm run lint`.

**Step 2:** Run `npm run build`.
