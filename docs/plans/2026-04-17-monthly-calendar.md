# Monthly Calendar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 利用者と管理者で共通利用する日曜始まりの月間カレンダーを実装する

**Architecture:** `CalendarPicker` を月単位のグリッド表示に作り直し、ナビゲーションと曜日ヘッダーを追加する。利用者ページから上限表示を削除し、管理者ページは同じ部品を使って継続運用する。

**Tech Stack:** React, TypeScript, dayjs, holiday-jp, CSS

---

### Task 1: CalendarPicker を月間表示へ変更

**Files:**
- Modify: `src/components/booking/CalendarPicker.tsx`

### Task 2: 利用者と管理者ページを調整

**Files:**
- Modify: `src/pages/ReservePage.tsx`
- Modify: `src/pages/admin/AdminBlockedDatesPage.tsx`

### Task 3: スタイルを更新

**Files:**
- Modify: `src/index.css`

### Task 4: 検証

**Step 1:** `npm run lint`
**Step 2:** `npm run build`
**Step 3:** `npm run check:server`
