# Admin CSV E2E Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 管理者ログインから予約一覧の CSV 出力とファイル保存までを検証する Playwright E2E を追加する。

**Architecture:** Playwright の `webServer` で Vite と Express の開発サーバーをまとめて起動し、テストデータは API 経由で作成する。ブラウザ操作は管理画面の実導線だけを通し、ダウンロードされた CSV を project 直下へ保存して中身を検証する。

**Tech Stack:** Playwright, React, Vite, Express, TypeScript

---

### Task 1: Playwright 基盤を追加する

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`

**Step 1: Playwright を devDependencies に追加する**

Run: `npm install -D @playwright/test`

**Step 2: Chromium 実行環境を入れる**

Run: `npx playwright install chromium`

**Step 3: Playwright 設定を書く**

- `baseURL` を `http://127.0.0.1:5173`
- `webServer.command` は `npm run dev`
- `acceptDownloads: true`
- `testDir` は `e2e`

**Step 4: 実行 script を追加する**

- `test:e2e`
- `test:e2e:headed`

### Task 2: 管理者 CSV 出力 E2E を書く

**Files:**
- Create: `e2e/admin-reservations-csv.spec.ts`

**Step 1: 予約データ作成 helper をテスト内に用意する**

- `/api/reservation-types`
- `/api/booking-settings/availability`
- `/api/reservations`

**Step 2: 管理者ログインから CSV ダウンロードまでのテストを書く**

- `/admin/login`
- `/admin/reservations`
- `CSV対象年月`
- `CSV出力`

**Step 3: ダウンロードを project 直下へ保存して中身を検証する**

- `download.saveAs(...)`
- `fs.readFile(...)`
- 予約番号、氏名、電話番号、受講種別を確認

### Task 3: 実行して確認する

**Files:**
- Verify only

**Step 1: E2E を実行する**

Run: `npx playwright test e2e/admin-reservations-csv.spec.ts`

**Step 2: lint と build を再確認する**

Run: `npm run lint`
Run: `npm run build`

**Step 3: 残件を整理する**

- CSV を残すか削除するかを確認
- 実行条件を最終報告に明記
