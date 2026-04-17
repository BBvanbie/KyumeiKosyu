# Homepage Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** ホームを予約導線ファーストの案内ページへ作り直し、文言を管理者設定から編集可能にする

**Architecture:** Prisma にホーム文言用のモデルを追加し、Express API で取得・更新する。フロントではホーム画面を新構成へ作り直し、管理者設定画面に文言編集フォームを追加する。

**Tech Stack:** React, TypeScript, Express, Prisma, PostgreSQL

---

### Task 1: ホーム文言モデルと API を追加

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Create: `server/src/routes/siteContent.ts`
- Modify: `server/src/index.ts`

### Task 2: フロントの型と API を追加

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/api.ts`

### Task 3: ホーム画面を再構築

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

### Task 4: 管理者設定でホーム文言を編集可能にする

**Files:**
- Modify: `src/pages/admin/AdminSettingsPage.tsx`

### Task 5: Prisma generate / db push / 検証

**Step 1:** `npm run prisma:generate`
**Step 2:** `npx prisma db push`
**Step 3:** `npm run lint`
**Step 4:** `npm run build`
**Step 5:** `npm run check:server`
