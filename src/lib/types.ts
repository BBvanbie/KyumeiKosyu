export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export type ReservationType = {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  textbookFee: number
  isActive: boolean
  sortOrder: number
}

export type ReservationItem = {
  reservationTypeId: string
  participantCount: number
  sortOrder: number
}

export type ReservationItemWithType = ReservationItem & {
  id: string
  reservationType: ReservationType
}

export type AdditionalTextbookKey =
  | 'basicInitial'
  | 'basicRenewal'
  | 'basicEnglish'
  | 'advancedInitial'
  | 'advancedRenewal'

export type AdditionalTextbookCounts = Record<AdditionalTextbookKey, number>

export type BlockedDate = {
  id: string
  date: string
  reason: string | null
}

export type BookingSetting = {
  id: string
  monthlyLimit: number
  weeklyLimit: number
  dailyLimit: number
  maxConsecutiveOpenDays: number
  updatedAt: string
}

export type SiteContent = {
  id: string
  heroTitle: string
  heroDescription: string
  guideTitle: string
  guideBody: string
  fireStationPhone: string
  feeHelpText: string
  additionalTextbookFeeBasicInitial: number
  additionalTextbookFeeBasicRenewal: number
  additionalTextbookFeeBasicEnglish: number
  additionalTextbookFeeAdvancedInitial: number
  additionalTextbookFeeAdvancedRenewal: number
  updatedAt: string
}

export type AdminNotification = {
  id: string
  type: 'reservation_cancelled'
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

export type EffectiveBlockedDate = {
  date: string
  reason:
    | 'manual_block'
    | 'reserved'
    | 'daily_limit'
    | 'weekly_limit'
    | 'monthly_limit'
    | 'consecutive_limit'
}

export type AvailabilityResponse = {
  setting: BookingSetting
  effectiveBlockedDates: EffectiveBlockedDate[]
  manualBlockedDates: BlockedDate[]
}

export type Reservation = {
  id: string
  reservationNumber: string
  preferredDate: string
  preferredStartTime: string | null
  status: ReservationStatus
  confirmedAt: string | null
  fullName: string
  address: string | null
  phone: string
  email: string | null
  organizationName: string | null
  venueAddress: string | null
  targetAudience: string | null
  interpreterAvailable: boolean | null
  japaneseTextbookCount: number | null
  englishTextbookCount: number | null
  wantsAdditionalTextbooks: boolean
  additionalTextbookCounts: AdditionalTextbookCounts | null
  notes: string | null
  createdAt: string
  items: ReservationItemWithType[]
}

export type ReservationLookupResult = Reservation & {
  cancellationLogs?: Array<{
    id: string
    cancelledBy: string
    note: string | null
    createdAt: string
  }>
}

export type ReservationCreatedResponse = {
  reservation: Reservation
  confirmationCode: string
}

export type BookingDraft = {
  preferredDate: string
  preferredStartTime: string
  fullName: string
  address: string
  phone: string
  email: string
  organizationName: string
  venueAddress: string
  targetAudience: string
  interpreterAvailable: '' | 'available' | 'unavailable'
  japaneseTextbookCount: string
  englishTextbookCount: string
  wantsAdditionalTextbooks: boolean
  additionalTextbookCounts: AdditionalTextbookCounts
  items: ReservationItem[]
  notes: string
}

export const emptyAdditionalTextbookCounts: AdditionalTextbookCounts = {
  basicInitial: 0,
  basicRenewal: 0,
  basicEnglish: 0,
  advancedInitial: 0,
  advancedRenewal: 0,
}

export const emptyBookingDraft: BookingDraft = {
  preferredDate: '',
  preferredStartTime: '',
  fullName: '',
  address: '',
  phone: '',
  email: '',
  organizationName: '',
  venueAddress: '',
  targetAudience: '',
  interpreterAvailable: '',
  japaneseTextbookCount: '',
  englishTextbookCount: '',
  wantsAdditionalTextbooks: false,
  additionalTextbookCounts: emptyAdditionalTextbookCounts,
  items: [
    { reservationTypeId: '', participantCount: 0, sortOrder: 1 },
    { reservationTypeId: '', participantCount: 0, sortOrder: 2 },
    { reservationTypeId: '', participantCount: 0, sortOrder: 3 },
  ],
  notes: '',
}
