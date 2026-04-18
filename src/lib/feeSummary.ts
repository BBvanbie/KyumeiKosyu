import { additionalTextbookOptions } from './reservationCatalog'
import type { AdditionalTextbookKey, BookingDraft, ReservationType, SiteContent } from './types'

type CourseFeeLine = {
  label: string
  participantCount: number
  unitFee: number
  subtotal: number
}

type AdditionalTextbookFeeLine = {
  key: AdditionalTextbookKey
  label: string
  count: number
  unitFee: number
  subtotal: number
}

export type FeeSummary = {
  courseFeeLines: CourseFeeLine[]
  courseTotal: number
  additionalTextbookFeeLines: AdditionalTextbookFeeLine[]
  additionalTextbookTotal: number
  grandTotal: number
}

const additionalTextbookFeeFieldMap: Record<AdditionalTextbookKey, keyof Pick<
  SiteContent,
  | 'additionalTextbookFeeBasicInitial'
  | 'additionalTextbookFeeBasicRenewal'
  | 'additionalTextbookFeeBasicEnglish'
  | 'additionalTextbookFeeAdvancedInitial'
  | 'additionalTextbookFeeAdvancedRenewal'
>> = {
  basicInitial: 'additionalTextbookFeeBasicInitial',
  basicRenewal: 'additionalTextbookFeeBasicRenewal',
  basicEnglish: 'additionalTextbookFeeBasicEnglish',
  advancedInitial: 'additionalTextbookFeeAdvancedInitial',
  advancedRenewal: 'additionalTextbookFeeAdvancedRenewal',
}

export function buildFeeSummary({
  draft,
  reservationTypes,
  siteContent,
}: {
  draft: BookingDraft
  reservationTypes: ReservationType[]
  siteContent: SiteContent | null
}): FeeSummary {
  const courseFeeLines = draft.items
    .map((item) => {
      const reservationType = reservationTypes.find((type) => type.id === item.reservationTypeId)
      if (!reservationType || item.participantCount <= 0) {
        return null
      }

      return {
        label: reservationType.name,
        participantCount: item.participantCount,
        unitFee: reservationType.textbookFee,
        subtotal: reservationType.textbookFee * item.participantCount,
      }
    })
    .filter((line): line is CourseFeeLine => Boolean(line))

  const additionalTextbookFeeLines = additionalTextbookOptions
    .map((option) => {
      const count = draft.additionalTextbookCounts[option.key]
      if (count <= 0) {
        return null
      }

      const unitFee = siteContent?.[additionalTextbookFeeFieldMap[option.key]] ?? 0

      return {
        key: option.key,
        label: option.label,
        count,
        unitFee,
        subtotal: count * unitFee,
      }
    })
    .filter((line): line is AdditionalTextbookFeeLine => Boolean(line))

  const courseTotal = courseFeeLines.reduce((sum, line) => sum + line.subtotal, 0)
  const additionalTextbookTotal = additionalTextbookFeeLines.reduce(
    (sum, line) => sum + line.subtotal,
    0
  )

  return {
    courseFeeLines,
    courseTotal,
    additionalTextbookFeeLines,
    additionalTextbookTotal,
    grandTotal: courseTotal + additionalTextbookTotal,
  }
}
