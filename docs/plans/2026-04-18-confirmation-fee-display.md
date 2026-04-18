# Confirmation Fee Display Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add fee breakdowns and configurable fee help content to the reservation confirmation screen, including additional textbook pricing managed from admin settings.

**Architecture:** Extend `SiteContent` with fee-help and additional-textbook fee fields while reusing `ReservationType.textbookFee` as the lecture per-person fee source. Compute the fee breakdown client-side on the confirmation page using fetched reservation types and site content, and expose the new settings in the existing admin settings screen.

**Tech Stack:** Prisma, Express, React 19, TypeScript, Vite

---

### Task 1: Extend settings data for fee help and additional textbook fees

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Modify: `server/src/routes/siteContent.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/api.ts`

**Step 1:** Add the new site-content fee fields with defaults.

**Step 2:** Seed the default fee help text and textbook-only fee values.

**Step 3:** Update server validation and client types so the new fields are readable and writable.

### Task 2: Expose fee settings in admin settings

**Files:**
- Modify: `src/pages/admin/AdminSettingsPage.tsx`

**Step 1:** Load the new fee settings into local state.

**Step 2:** Add a dedicated settings section for textbook-only fees and help copy.

**Step 3:** Save them through the existing site-content update flow.

### Task 3: Render fee breakdown and help popover on confirmation

**Files:**
- Create: `src/lib/feeSummary.ts`
- Modify: `src/pages/ReservationConfirmPage.tsx`
- Modify: `src/index.css`

**Step 1:** Build a reusable fee-summary helper from reservation types, selected items, and additional textbook counts.

**Step 2:** Fetch the fee-help settings on the confirmation page.

**Step 3:** Render the breakdown and popover next to the fee section heading.

### Task 4: Verify regression scope

**Files:**
- Verify only

**Step 1:** Run `npx prisma db push`.

**Step 2:** Run `npx prisma generate`.

**Step 3:** Run `npm run lint`.

**Step 4:** Run `npm run check:server`.

**Step 5:** Run `npm run build`.
