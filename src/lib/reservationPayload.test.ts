import { describe, expect, it } from 'vitest'
import { buildReservationPayload } from './reservationPayload'
import { emptyBookingDraft } from './types'

describe('buildReservationPayload', () => {
  it('drops empty reservation rows before submit', () => {
    const payload = buildReservationPayload({
      ...emptyBookingDraft,
      preferredDate: '2026-04-25',
      preferredStartTime: '10:00',
      fullName: '消防 太郎',
      phone: '090-1234-5678',
      organizationName: 'テスト株式会社',
      venueAddress: '東京都千代田区1-2-3',
      targetAudience: '新入社員',
      items: [
        {
          reservationTypeId: 'type-a',
          participantCount: 12,
          sortOrder: 1,
        },
        {
          reservationTypeId: '',
          participantCount: 0,
          sortOrder: 2,
        },
        {
          reservationTypeId: 'type-c',
          participantCount: 3,
          sortOrder: 3,
        },
      ],
    })

    expect(payload.items).toEqual([
      {
        reservationTypeId: 'type-a',
        participantCount: 12,
        sortOrder: 1,
      },
      {
        reservationTypeId: 'type-c',
        participantCount: 3,
        sortOrder: 3,
      },
    ])
  })
})
