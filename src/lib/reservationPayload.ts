import { getValidReservationItems } from './reservationSchedule'
import type { BookingDraft } from './types'

export function buildReservationPayload(draft: BookingDraft): BookingDraft {
  return {
    ...draft,
    items: getValidReservationItems(draft.items),
  }
}
