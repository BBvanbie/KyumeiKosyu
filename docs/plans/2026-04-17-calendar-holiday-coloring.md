# Calendar Holiday Coloring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 予約カレンダーで日本の祝日を赤、土曜を青、予約不可日をグレーアウト表示できるようにする

**Architecture:** `CalendarPicker` に曜日種別と祝日判定を持たせ、日付ごとに見た目クラスを切り替える。祝日判定はフロント側のライブラリを使い、既存の予約可否ロジックは変更せず表示だけを強化する。

**Tech Stack:** React, TypeScript, dayjs, holiday-jp, CSS

---

### Task 1: 祝日判定の導入

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: 祝日判定ライブラリを追加**

Run: `npm install holiday-jp`
Expected: `package.json` の dependencies に `holiday-jp` が追加される

### Task 2: カレンダーの表示クラスを追加

**Files:**
- Modify: `src/components/booking/CalendarPicker.tsx`

**Step 1: 日付ごとの表示状態を計算**

- 土曜判定
- 日曜判定
- 日本の祝日判定
- 予約不可日判定

**Step 2: button に状態クラスを付与**

- `is-blocked`
- `is-saturday`
- `is-sunday`
- `is-holiday`

### Task 3: カレンダー配色を更新

**Files:**
- Modify: `src/index.css`

**Step 1: 文字色と背景を状態別に分岐**

- 土曜は青
- 日曜と祝日は赤
- 予約不可日はグレー背景と薄い文字色
- 管理画面ではクリック可能でも視覚的に予約不可と分かる見た目を維持

### Task 4: 検証

**Files:**
- None

**Step 1: 静的検証**

Run: `npm run lint`
Expected: PASS

**Step 2: ビルド検証**

Run: `npm run build`
Expected: PASS
