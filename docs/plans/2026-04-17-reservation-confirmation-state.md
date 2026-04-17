# Reservation Confirmation State Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 予約確定日時の記録・表示と、管理者による確認キー再発行を追加する

**Architecture:** Prisma に `confirmedAt` を追加し、管理者の状態更新時に確定日時を保存する。再発行 API で新しい確認キーを発行し、管理画面で一度だけ表示する。利用者画面では状態の日本語化と確定日時表示を行う。

**Tech Stack:** React, TypeScript, Express, Prisma, PostgreSQL, bcryptjs

---

### Task 1: Prisma と型を更新

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `src/lib/types.ts`

### Task 2: 管理 API に確定日時と確認キー再発行を追加

**Files:**
- Modify: `server/src/routes/reservations.ts`
- Modify: `src/lib/api.ts`

### Task 3: 利用者と管理者 UI を更新

**Files:**
- Modify: `src/pages/ReservationLookupResultPage.tsx`
- Modify: `src/pages/admin/AdminReservationsPage.tsx`

### Task 4: Prisma generate / db push / 検証

**Step 1:** `npm run prisma:generate`
**Step 2:** `npx prisma db push`
**Step 3:** `npm run lint`
**Step 4:** `npm run build`
**Step 5:** `npm run check:server`
