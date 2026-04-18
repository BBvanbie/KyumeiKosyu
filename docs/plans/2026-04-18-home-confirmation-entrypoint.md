# Home Confirmation Entrypoint Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a safe home-page entrypoint to the reservation confirmation page for users with an in-progress draft.

**Architecture:** Keep the existing booking flow intact and add a secondary hero CTA on the home page. Use a small draft-readiness helper to decide whether to navigate to `/reserve/confirm` or show inline guidance without disrupting the primary reservation CTA.

**Tech Stack:** React 19, TypeScript, React Router, Vitest, Testing Library

---

### Task 1: Add draft readiness helper

**Files:**
- Modify: `src/lib/bookingDraft.ts`

**Step 1:** Reuse the stored draft reader and valid reservation item rules to expose a boolean helper for home-page routing.

### Task 2: Add the home-page confirmation CTA

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/index.css`

**Step 1:** Add a secondary hero CTA for checking an in-progress reservation.

**Step 2:** Navigate to `/reserve/confirm` when a usable draft exists.

**Step 3:** Show a short inline notice when no usable draft exists.

### Task 3: Verify the branch behavior

**Files:**
- Modify: `src/pages/HomePage.test.tsx`

**Step 1:** Mock the site-content request.

**Step 2:** Add one test for the CTA render and one for the missing-draft notice.

**Step 3:** Run targeted tests, lint, and build.
