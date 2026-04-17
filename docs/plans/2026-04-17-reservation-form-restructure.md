# Reservation Form Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 団体予約向けの予約フォーム再構成と英語版分岐、追加テキスト購入入力を実装する

**Architecture:** フロントでは予約フォームと確認画面を再編し、下書きデータと型を拡張する。バックエンドでは Prisma スキーマと予約作成 API を更新して、新しい予約入力を永続化できるようにする。

**Tech Stack:** React, TypeScript, Express, Prisma, PostgreSQL, Zod

---

### Task 1: 共有型と下書きデータを拡張

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/bookingDraft.ts`
- Create: `src/lib/reservationCatalog.ts`
- Create: `src/lib/phone.ts`

### Task 2: 予約フォームと確認画面を再編

**Files:**
- Modify: `src/pages/ReservationFormPage.tsx`
- Modify: `src/pages/ReservationConfirmPage.tsx`
- Modify: `src/index.css`

### Task 3: 予約 API と DB を更新

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `server/src/routes/reservations.ts`
- Modify: `src/lib/api.ts`

### Task 4: Prisma クライアントと DB を更新

**Files:**
- Modify: `generated/prisma/*`

**Step 1: Prisma generate**

Run: `npm run prisma:generate`
Expected: Prisma client regenerated

**Step 2: DB 反映**

Run: `npx prisma db push`
Expected: Schema synced

### Task 5: 検証

**Step 1: lint**

Run: `npm run lint`
Expected: PASS

**Step 2: build**

Run: `npm run build`
Expected: PASS

**Step 3: server typecheck**

Run: `npm run check:server`
Expected: PASS
