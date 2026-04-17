# Booking System Skeleton Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the first full-stack skeleton for the booking system with guest pages, admin pages, database-backed reservations, blocked dates, and cookie-based admin authentication.

**Architecture:** Add an Express + TypeScript backend in the same repository, connect Prisma to Neon PostgreSQL, define a persistent schema, then wire the React frontend to real APIs while preserving the Airbnb-inspired design system.

**Tech Stack:** React, TypeScript, React Router, Express, Prisma, PostgreSQL, Neon, cookie-parser, bcrypt, React Icons

---

### Task 1: Organize project structure and backend entry

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/src/index.ts`
- Modify: `package.json`

**Step 1: Add backend scripts and dependencies**

Install the server runtime and development dependencies.

**Step 2: Add the backend entrypoint**

Create an Express app with JSON parsing, cookie parsing, CORS, and a health endpoint.

**Step 3: Verify the backend boots**

Run the backend dev command and confirm it starts without TypeScript errors.

### Task 2: Configure Prisma and database schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `.env.example`
- Modify: `package.json`

**Step 1: Initialize Prisma for PostgreSQL**

Point Prisma at Neon PostgreSQL.

**Step 2: Define models**

Add `AdminUser`, `ReservationType`, `BlockedDate`, and `Reservation`.

**Step 3: Seed initial data**

Seed the admin user and reservation types.

**Step 4: Run migration and seed**

Generate the client, run a migration, and seed the database.

### Task 3: Implement admin authentication

**Files:**
- Create: `server/src/lib/prisma.ts`
- Create: `server/src/lib/auth.ts`
- Create: `server/src/middleware/requireAdmin.ts`
- Create: `server/src/routes/adminAuth.ts`
- Modify: `server/src/index.ts`

**Step 1: Add password hashing and cookie session utilities**

Create helpers for comparing passwords and issuing/clearing admin cookies.

**Step 2: Add login/logout/me endpoints**

Support admin session creation, inspection, and logout.

**Step 3: Protect admin-only routes**

Use middleware that rejects unauthenticated requests.

### Task 4: Implement booking and admin APIs

**Files:**
- Create: `server/src/routes/reservationTypes.ts`
- Create: `server/src/routes/blockedDates.ts`
- Create: `server/src/routes/reservations.ts`
- Modify: `server/src/index.ts`

**Step 1: Add guest-facing endpoints**

Expose reservation types and blocked dates.

**Step 2: Add reservation create endpoint**

Persist guest reservation submissions.

**Step 3: Add admin endpoints**

Expose reservations list and blocked-date creation.

### Task 5: Add frontend app state and API layer

**Files:**
- Create: `src/lib/api.ts`
- Create: `src/lib/types.ts`
- Create: `src/context/AuthContext.tsx`
- Modify: `src/main.tsx`

**Step 1: Create typed API helpers**

Centralize fetch calls and shared types.

**Step 2: Add admin auth context**

Load current admin session and expose login/logout helpers.

### Task 6: Build guest pages

**Files:**
- Create: `src/pages/ReservePage.tsx`
- Create: `src/pages/ReservationFormPage.tsx`
- Create: `src/pages/ReservationConfirmPage.tsx`
- Create: `src/components/booking/*`
- Modify: `src/router/index.tsx`
- Modify: `src/index.css`

**Step 1: Build the calendar selection page**

Show a large calendar-like date picker and blocked dates.

**Step 2: Build the reservation form**

Include reservationer info, organization info, reservation type, and notes.

**Step 3: Build the confirmation page**

Review all data before submission and show a completion modal after success.

### Task 7: Build admin pages

**Files:**
- Create: `src/pages/admin/AdminLoginPage.tsx`
- Create: `src/pages/admin/AdminHomePage.tsx`
- Create: `src/pages/admin/AdminReservationsPage.tsx`
- Create: `src/pages/admin/AdminBlockedDatesPage.tsx`
- Create: `src/pages/admin/AdminSettingsPage.tsx`
- Create: `src/components/admin/*`
- Modify: `src/App.tsx`
- Modify: `src/router/index.tsx`
- Modify: `src/index.css`

**Step 1: Add admin login flow**

Create the login form and route guard behavior.

**Step 2: Add the admin shell**

Provide navigation and protected layout.

**Step 3: Add reservations and blocked-date screens**

Connect pages to the backend APIs.

### Task 8: Verify and document

**Files:**
- Modify: `README.md`

**Step 1: Document setup**

Add frontend, backend, Prisma, and environment instructions.

**Step 2: Run checks**

Run lint, build, and tests for the frontend, plus backend type verification if configured.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add booking system skeleton"
```

### Task 9: Add booking limits and admin settings

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Create: `server/src/lib/availability.ts`
- Create: `server/src/routes/bookingSettings.ts`
- Modify: `server/src/routes/reservations.ts`
- Modify: `server/src/index.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/pages/ReservePage.tsx`
- Modify: `src/pages/admin/AdminSettingsPage.tsx`

**Step 1: Persist booking limits**

Add a singleton `BookingSetting` model with monthly, weekly, daily, and consecutive-open-day limits.

**Step 2: Centralize availability calculation**

Use one server-side function to combine manual blocked dates, existing reservations, and settings into effective unavailable dates.

**Step 3: Expose settings and availability APIs**

Add admin update endpoints and guest-facing availability data.

**Step 4: Enforce limits on reservation submit**

Reject reservation creation if the selected date is no longer available.

**Step 5: Add the admin settings UI**

Allow the admin to edit the four limits from `/admin/settings`.
