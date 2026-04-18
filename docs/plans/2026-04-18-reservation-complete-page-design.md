# Reservation Complete Page Design

**Goal:** Keep the reservation confirmation page focused on pre-submit review and move post-submit reservation number / confirmation key display into a dedicated completion page.

## Problem

- `/reserve/confirm` currently depends on a booking draft in `sessionStorage`.
- After submit, the draft is cleared, so re-entering `/reserve/confirm` shows "入力途中の予約情報が見つかりません".
- Returning to the form from that state can also fail because the form expects a selected preferred date.
- The confirmation modal shows the reservation number and confirmation key only transiently.

## Recommended Approach

Create a dedicated completion route at `/reserve/complete`.

- `/reserve/confirm` remains the final pre-submit review page only.
- On successful submit, clear the draft and navigate to `/reserve/complete`.
- Pass `reservationNumber` and `confirmationCode` through router state.
- Render a stable completion screen with:
  - reservation number
  - confirmation key
  - reminder that the reservation is finalized after a phone call
  - primary CTA: `ホームへ戻る`
  - secondary CTA: `予約を確認する`

## Why This Approach

- Keeps each page single-purpose.
- Prevents post-submit users from falling back into draft-only guards.
- Makes the reservation number and confirmation key visible on a full page instead of only in a modal.
- Preserves a clear public follow-up path via the lookup flow.

## Rejected Alternatives

### Reuse `/reserve/confirm` for both pre-submit and post-submit

- Adds branching around draft state and completion state to one page.
- Increases the chance of routing and state bugs.

### Expand the existing modal only

- The information remains transient.
- Refresh and re-entry behavior stays weak.

## Data Flow

1. User fills `/reserve/form`
2. User reviews `/reserve/confirm`
3. Submit succeeds
4. App receives `reservationNumber` and `confirmationCode`
5. Draft is cleared
6. App navigates to `/reserve/complete` with route state
7. Completion page renders final details and return actions

## Error Handling

- If `/reserve/complete` is opened without route state, show a compact status panel.
- That panel should direct the user to home or the reservation lookup page.

## Testing Scope

- Verify submit success navigates away from `/reserve/confirm`
- Verify completion page renders reservation number and confirmation key from route state
- Verify completion page fallback when route state is missing
