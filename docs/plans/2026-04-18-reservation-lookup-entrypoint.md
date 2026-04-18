# Reservation Lookup Entrypoint Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Promote the public reservation lookup flow from the home page and guide users to call the fire station when lookup details are missing or invalid.

**Architecture:** Replace the home-page draft-based confirmation CTA with a direct link to the existing lookup form. Strengthen the lookup page copy and error messaging so the public-facing flow clearly explains the `reservation number + confirmation code` requirement and what to do when lookup fails.

**Tech Stack:** React 19, TypeScript, React Router, Vitest, Testing Library

---

### Task 1: Switch the home CTA to public lookup

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/HomePage.test.tsx`

**Step 1:** Replace the in-progress reservation CTA with a direct lookup CTA.

**Step 2:** Remove the draft-only inline notice behavior.

**Step 3:** Update home-page tests to match the new CTA.

### Task 2: Improve lookup guidance

**Files:**
- Modify: `src/pages/ReservationLookupPage.tsx`

**Step 1:** Add a short explanation of the required fields.

**Step 2:** Replace generic lookup failures with a message that tells the user to call the fire station when the reservation number or confirmation code is unknown.

### Task 3: Verify regression scope

**Files:**
- Verify only

**Step 1:** Run `npm run test -- src/pages/HomePage.test.tsx`.

**Step 2:** Run `npm run lint`.

**Step 3:** Run `npm run build`.
