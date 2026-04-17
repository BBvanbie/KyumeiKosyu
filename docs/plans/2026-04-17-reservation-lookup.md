# Reservation Lookup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 会員登録なしで予約確認・キャンセルができる利用者ポータルと、管理者向けキャンセル履歴・通知を実装する

**Architecture:** Prisma に予約確認・通知関連モデルを追加し、Express API で予約照会とキャンセルを提供する。フロントでは確認入口と詳細ページを追加し、管理ホームに通知を表示する。

**Tech Stack:** React, TypeScript, Express, Prisma, PostgreSQL, bcryptjs

---

### Task 1: Prisma モデルを拡張

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`

### Task 2: 予約 API と利用者照会 API を追加

**Files:**
- Modify: `server/src/routes/reservations.ts`
- Create: `server/src/routes/publicReservations.ts`
- Create: `server/src/routes/adminNotifications.ts`
- Modify: `server/src/index.ts`

### Task 3: フロント型・API・完了モーダルを更新

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/components/booking/CompletionModal.tsx`
- Modify: `src/pages/ReservationConfirmPage.tsx`

### Task 4: 利用者向け予約確認ページを追加

**Files:**
- Create: `src/pages/ReservationLookupPage.tsx`
- Create: `src/pages/ReservationLookupResultPage.tsx`
- Modify: `src/router/index.tsx`

### Task 5: 管理ホーム通知を追加

**Files:**
- Modify: `src/pages/admin/AdminHomePage.tsx`

### Task 6: Prisma generate / db push / 検証

**Step 1:** `npm run prisma:generate`
**Step 2:** `npx prisma db push`
**Step 3:** `npm run prisma:seed`
**Step 4:** `npm run lint`
**Step 5:** `npm run build`
**Step 6:** `npm run check:server`
