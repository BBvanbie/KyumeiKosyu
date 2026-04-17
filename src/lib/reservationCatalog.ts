import type { AdditionalTextbookKey, ReservationItem, ReservationType } from './types'

export const ENGLISH_RESERVATION_TYPE_NAME = '普通（英語版）'

export const additionalTextbookOptions: Array<{
  key: AdditionalTextbookKey
  label: string
}> = [
  { key: 'basicInitial', label: '普通（新規）' },
  { key: 'basicRenewal', label: '普通（再講習）' },
  { key: 'basicEnglish', label: '普通（英語版）' },
  { key: 'advancedInitial', label: '上級（新規）' },
  { key: 'advancedRenewal', label: '上級（再講習）' },
]

export function hasEnglishCourse(items: ReservationItem[], reservationTypes: ReservationType[]) {
  return items.some((item) => {
    if (!item.reservationTypeId) {
      return false
    }

    const reservationType = reservationTypes.find((type) => type.id === item.reservationTypeId)
    return reservationType?.name === ENGLISH_RESERVATION_TYPE_NAME
  })
}
