# React Reservation System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up the initial React frontend foundation for a reservation system with routing, linting, formatting, and unit testing.

**Architecture:** Scaffold a Vite React TypeScript app, then layer in routing and developer tooling. Keep the application shell minimal so later reservation-specific screens can be added without reworking the foundation.

**Tech Stack:** Vite, React, TypeScript, React Router, ESLint, Prettier, Vitest

---

### Task 1: Scaffold the base app

**Files:**
- Create: `package.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `vite.config.ts`

**Step 1: Scaffold the Vite React TypeScript app**

Run: `npm create vite@latest . -- --template react-ts`
Expected: App scaffolded in the current repository

**Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules` and lockfile created

**Step 3: Verify base app builds**

Run: `npm run build`
Expected: Production build completes successfully

### Task 2: Add routing and app structure

**Files:**
- Create: `src/router/index.tsx`
- Create: `src/pages/HomePage.tsx`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

**Step 1: Add routing dependency**

Run: `npm install react-router-dom`
Expected: Router dependency added

**Step 2: Implement a minimal route tree**

Create a home route at `/` and render a simple app shell.

**Step 3: Verify app starts**

Run: `npm run dev`
Expected: Development server starts without runtime errors

### Task 3: Add formatting and test tooling

**Files:**
- Modify: `package.json`
- Create: `.prettierrc`
- Create: `src/test/setup.ts`
- Create: `src/pages/HomePage.test.tsx`
- Modify: `vite.config.ts`

**Step 1: Install tooling**

Run: `npm install -D prettier vitest jsdom @testing-library/react @testing-library/jest-dom`
Expected: Dev dependencies added

**Step 2: Add scripts and test setup**

Define `test` script and configure Vitest with jsdom.

**Step 3: Add a simple route/page test**

Write a small test that verifies the home page renders.

**Step 4: Run tests**

Run: `npm run test -- --run`
Expected: Test suite passes

### Task 4: Final verification

**Files:**
- Modify: `README.md`

**Step 1: Document commands**

Add setup and run commands to the README.

**Step 2: Run verification commands**

Run: `npm run lint`
Expected: Lint passes

Run: `npm run build`
Expected: Build passes

Run: `npm run test -- --run`
Expected: Tests pass

**Step 3: Commit**

```bash
git add .
git commit -m "chore: scaffold react reservation frontend"
```
