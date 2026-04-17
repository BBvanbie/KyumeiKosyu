# Reserve Page Sticky CTA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 利用者の予約日選択画面で、元のボタンが見えなくなった時だけ画面下部に追従 CTA を表示する

**Architecture:** `ReservePage` で元ボタンの可視状態を監視し、ビューポート外に出た時だけ追従 CTA を表示する。見た目は既存のブランドトーンに合わせた下部バーとして `src/index.css` に追加する。

**Tech Stack:** React, TypeScript, React Router, CSS

---

### Task 1: CTA の可視判定を追加

**Files:**
- Modify: `src/pages/ReservePage.tsx`

**Step 1: 元ボタンの ref と追従表示 state を追加**

**Step 2: IntersectionObserver で元ボタンの可視状態を監視**

**Step 3: 既存 CTA と同じ動作の追従 CTA を条件付き表示**

### Task 2: 追従バーのスタイルを追加

**Files:**
- Modify: `src/index.css`

**Step 1: 下部固定バーと内部レイアウトを追加**

**Step 2: PC とモバイルで破綻しない余白と幅に調整**

### Task 3: 検証

**Files:**
- None

**Step 1: lint を実行**

Run: `npm run lint`
Expected: PASS

**Step 2: build を実行**

Run: `npm run build`
Expected: PASS
