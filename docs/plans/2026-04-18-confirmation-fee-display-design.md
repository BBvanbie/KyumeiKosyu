# Confirmation Fee Display Design

**Goal:** Show payment amounts on the reservation confirmation screen, including base lecture fees and optional additional textbook fees, with editable admin-side fee settings and a configurable help message.

## Pricing Rules

- Base lecture fee uses each selected reservation type's per-person amount.
- Base lecture total is calculated as:
  - `participantCount * textbookFee` for each selected reservation item
  - summed across all selected reservation items
- Additional textbook fees are configured separately for each of the five textbook-only categories.
- Additional textbook total is calculated as:
  - `count * configuredAdditionalTextbookFee`
  - summed across all selected additional textbook categories

## Confirmation Screen Display

### No additional textbooks

- Single course:
  - `1人あたり X 円`
  - `合計 Y 円`
- Multiple courses:
  - each course shows:
    - `普通（新規） 1人あたり X 円`
    - `普通（新規） 合計 Y 円`
  - final line:
    - `講習料合計 Z 円`

### With additional textbooks

- Base lecture breakdown remains visible
- Additional textbook rows show:
  - textbook label
  - count
  - unit fee
  - subtotal
- Summary lines show:
  - `講習料合計`
  - `追加テキスト代`
  - `お支払い合計`

## Settings Model

- Continue using `ReservationType.textbookFee` as the lecture per-person fee
- Extend `SiteContent` with:
  - `feeHelpText`
  - `additionalTextbookFeeBasicInitial`
  - `additionalTextbookFeeBasicRenewal`
  - `additionalTextbookFeeBasicEnglish`
  - `additionalTextbookFeeAdvancedInitial`
  - `additionalTextbookFeeAdvancedRenewal`

## Admin UX

- Keep lecture fees inside the reservation-type settings table
- Add a new settings section for:
  - additional textbook fee inputs
  - fee help message textarea
- Initial help text:
  - `講習料は振込対応のみです。当日振込用紙をお渡しします。`

## Help UI

- Add a `?` trigger next to the fee section heading
- Clicking opens a small popover-style help bubble
- Bubble text comes from admin settings

## Expected Result

- Staff can configure all fee inputs from admin settings
- Users can see exactly how the payment total is built on the confirmation screen
- Help copy can be changed without code edits
