# Admin Reservation Detail And Monthly CSV Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a reservation detail modal to the admin reservations page and allow CSV export to be filtered by the reservation preferred-date month.

**Architecture:** Keep the admin reservations page as the single control surface for reservation review. Add a detail modal that reuses the existing modal visual language, and extend the CSV export controls with a month input that filters exported rows by `preferredDate` while leaving the on-screen table unchanged.

**Tech Stack:** React 19, TypeScript, Vite

---

### Task 1: Add preferred-date month CSV filter

**Files:**
- Modify: `src/pages/admin/AdminReservationsPage.tsx`

**Step 1:** Add a month input in the page header.

**Step 2:** Filter only the CSV export rows by the selected `preferredDate` month.

**Step 3:** Keep all existing CSV columns intact.

### Task 2: Add reservation detail modal

**Files:**
- Modify: `src/pages/admin/AdminReservationsPage.tsx`

**Step 1:** Add a `詳細` action per reservation row.

**Step 2:** Open a modal containing the reservation’s full submitted data.

**Step 3:** Reuse the current summary and modal styling for consistency.

### Task 3: Verify regression scope

**Files:**
- Verify only

**Step 1:** Run `npm run lint`.

**Step 2:** Run `npm run build`.
