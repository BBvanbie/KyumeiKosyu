# Pending Reservation Blocking Design

**Goal:** Treat both pending and confirmed reservations as day-level holds so later users cannot select the same date, and move the additional-textbook purchase section below course selection.

## Availability Rule

- A date becomes unavailable when at least one non-cancelled reservation exists on that date.
- This applies equally to `pending` and `confirmed`.
- The behavior is day-level, not time-slot-level.

## Why

- Current booking settings allow more than one reservation per day, so a single pending reservation can still leave the date selectable.
- The desired operation is a temporary hold that prevents competing submissions while staff review and confirm by phone.

## Recommended Approach

- Keep the existing availability aggregation entrypoint.
- Add an explicit reservation-hold branch ahead of the configurable daily/weekly/monthly limits.
- Return a dedicated reason such as `reserved` instead of overloading `daily_limit`.

## Form Layout Change

- Move the `追加テキスト購入` section so it appears immediately after `受講内容`.
- Keep the existing fields, copy, and toggle behavior unchanged.

## Expected Result

- Calendar dates with any `pending` or `confirmed` reservation become unselectable.
- Submit-time revalidation also rejects those dates consistently.
- The form reads in a more natural order:
  - reservationer info
  - organization info
  - course selection
  - additional textbook purchase
  - notes
