import { emptyAdditionalTextbookCounts, emptyBookingDraft, type BookingDraft } from './types'

const STORAGE_KEY = 'kyumei-booking-draft'

export function getBookingDraft(): BookingDraft {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return emptyBookingDraft

  try {
    const parsed = JSON.parse(raw) as Partial<BookingDraft>
    return {
      ...emptyBookingDraft,
      ...parsed,
      additionalTextbookCounts: {
        ...emptyAdditionalTextbookCounts,
        ...(parsed.additionalTextbookCounts ?? {}),
      },
      items: Array.isArray(parsed.items)
        ? emptyBookingDraft.items.map((defaultItem, index) => ({
            ...defaultItem,
            ...(parsed.items?.[index] ?? {}),
          }))
        : emptyBookingDraft.items,
    }
  } catch {
    return emptyBookingDraft
  }
}

export function saveBookingDraft(draft: BookingDraft) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
}

export function patchBookingDraft(patch: Partial<BookingDraft>) {
  saveBookingDraft({
    ...getBookingDraft(),
    ...patch,
  })
}

export function clearBookingDraft() {
  sessionStorage.removeItem(STORAGE_KEY)
}
