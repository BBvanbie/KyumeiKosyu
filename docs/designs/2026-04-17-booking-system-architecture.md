# Booking System Architecture Design

**Goal:** Build the first full-stack skeleton for a booking system with guest and admin roles, persistent data, admin authentication, and extensible reservation flows.

## Scope

- Add guest-facing booking pages
- Add admin-facing pages and authentication
- Add backend API with Express + Prisma
- Connect PostgreSQL on Neon
- Implement a first database schema for reservations, blocked dates, reservation types, and admin users
- Keep detailed business logic lightweight for now, but ensure the foundation is real and persistent

## Roles

### Guest

- No registration required
- Can browse the home page
- Can choose a date from the booking calendar
- Can complete a reservation form
- Can review data on a confirmation page
- Can submit the reservation
- Sees a completion modal stating that the reservation is confirmed after a phone call

### Admin

- Must log in
- Uses server-side authentication with `httpOnly` cookie session
- Can view an admin home page
- Can inspect reservations
- Can register blocked dates
- Has a settings page placeholder for later expansion

## Route Structure

### Guest routes

- `/`
- `/reserve`
- `/reserve/form`
- `/reserve/confirm`

### Admin routes

- `/admin/login`
- `/admin`
- `/admin/reservations`
- `/admin/blocked-dates`
- `/admin/settings`

## Backend Architecture

- `Express` API in the same repository
- `Prisma` for schema and queries
- `PostgreSQL` on Neon
- Cookie-based admin authentication
- Frontend calls backend through `/api/*`

## Data Model

### BookingSetting

- `id`
- `monthlyLimit`
- `weeklyLimit`
- `dailyLimit`
- `maxConsecutiveOpenDays`
- `updatedAt`

この設定は 1 レコードのみを保持し、管理者設定画面から更新する。

### AdminUser

- `id`
- `username`
- `passwordHash`
- `createdAt`
- `updatedAt`

Initial seed:

- username: `admin`
- password: `Change123`

### ReservationType

- `id`
- `name`
- `description`
- `groupSizeLabel`
- `sortOrder`
- `createdAt`

Initial records:

- 4 selectable types for the booking form

### BlockedDate

- `id`
- `date`
- `reason`
- `createdAt`

### Reservation

- `id`
- `preferredDate`
- `status`
- `fullName`
- `address`
- `phone`
- `email`
- `organizationName`
- `location`
- `targetAudience`
- `reservationTypeId`
- `notes`
- `createdAt`
- `updatedAt`

Status values:

- `pending`
- `confirmed`
- `cancelled`

## Core Flows

### Guest booking flow

1. Guest opens `/reserve`
2. Calendar displays available and blocked dates
3. Guest selects a date and proceeds to `/reserve/form`
4. Guest completes the form
5. Guest reviews details on `/reserve/confirm`
6. Guest submits reservation
7. Reservation is stored with `pending` status
8. Completion modal explains that phone confirmation finalizes the booking

### Admin flow

1. Admin logs in through `/admin/login`
2. Server validates credentials and sets an `httpOnly` cookie
3. Admin accesses protected routes
4. Admin reviews reservations and blocked dates
5. Admin can later update statuses and settings

## UI Principles

- Follow the Airbnb-inspired system in `DESIGN.md`
- Guest pages prioritize calm browsing and clear progress
- Admin pages keep the same token system, but use denser information layouts
- Booking pages should feel guided rather than technical

## Validation Rules For This Phase

- Required booking fields:
  - `fullName`
  - `phone`
  - `preferredDate`
  - `reservationTypeId`
- Other fields can be optional for now
- Detailed domain validation can be added after the skeleton is stable

## Availability Rules

- `dailyLimit` に達した日付は予約不可
- `weeklyLimit` に達した週は残り日も予約不可
- `monthlyLimit` に達した月は残り日も予約不可
- `maxConsecutiveOpenDays` を超える連続営業日は予約不可
- 手動の `BlockedDate` は最優先で予約不可
- 利用者カレンダー表示と予約送信時のバリデーションで同じ判定ロジックを使う

## Out of Scope For This Phase

- Full search/filter logic
- Email notifications
- Telephone confirmation workflow automation
- Fine-grained admin roles
- Advanced scheduling rules beyond blocked dates
