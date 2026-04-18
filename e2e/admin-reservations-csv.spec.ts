import { expect, test } from '@playwright/test'
import type { APIRequestContext } from '@playwright/test'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const csvOutputPath = path.join(process.cwd(), 'admin-reservations-export.csv')

test.beforeEach(async () => {
  await fs.rm(csvOutputPath, { force: true })
})

test('管理者が予約一覧から CSV を project 直下へ保存できる', async ({ page, request }) => {
  const reservation = await createReservationFixture(request)

  await page.goto('/admin/login')
  await page.getByLabel('管理者ID').fill('admin')
  await page.getByLabel('パスワード').fill('Change123')
  await page.getByRole('button', { name: 'ログイン' }).click()

  await expect(page).toHaveURL(/\/admin$/)
  await page.getByRole('link', { name: '予約一覧' }).click()
  await expect(page.getByRole('heading', { name: '予約一覧' })).toBeVisible()
  await expect(page.getByText(reservation.reservationNumber)).toBeVisible()

  await page.getByLabel('CSV対象年月').fill(reservation.preferredDate.slice(0, 7))

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'CSV出力' }).click()
  const download = await downloadPromise
  await download.saveAs(csvOutputPath)

  const csvContent = await fs.readFile(csvOutputPath, 'utf8')
  expect(csvContent).toContain(reservation.reservationNumber)
  expect(csvContent).toContain(reservation.fullName)
  expect(csvContent).toContain(reservation.phone)
  expect(csvContent).toContain(reservation.itemSummary)
})

async function createReservationFixture(request: APIRequestContext) {
  const reservationTypesResponse = await request.get('/api/reservation-types')
  expect(reservationTypesResponse.ok()).toBeTruthy()
  const reservationTypes = (await reservationTypesResponse.json()) as Array<{
    id: string
    name: string
    isActive: boolean
  }>
  const reservationType = reservationTypes.find((entry) => entry.isActive)

  expect(reservationType).toBeTruthy()

  const availabilityResponse = await request.get('/api/booking-settings/availability')
  expect(availabilityResponse.ok()).toBeTruthy()
  const availability = (await availabilityResponse.json()) as {
    effectiveBlockedDates: Array<{ date: string }>
  }

  const preferredDate = findAvailableDate(
    new Set(availability.effectiveBlockedDates.map((entry) => entry.date))
  )
  const participantCount = 3
  const fullName = `E2E CSV ${Date.now()}`
  const phone = `090${String(Date.now()).slice(-8)}`
  const itemSummary = `${reservationType!.name}:${participantCount}名`

  const createResponse = await request.post('/api/reservations', {
    data: {
      preferredDate,
      preferredStartTime: '10:00',
      fullName,
      address: '東京都千代田区1-2-3',
      phone,
      email: 'e2e@example.com',
      organizationName: 'E2E検証団体',
      venueAddress: '東京都千代田区1-2-3 E2E会場',
      targetAudience: '職員',
      interpreterAvailable: '',
      japaneseTextbookCount: '',
      englishTextbookCount: '',
      wantsAdditionalTextbooks: false,
      additionalTextbookCounts: {
        basicInitial: 0,
        basicRenewal: 0,
        basicEnglish: 0,
        advancedInitial: 0,
        advancedRenewal: 0,
      },
      notes: 'E2E CSV export verification',
      items: [
        {
          reservationTypeId: reservationType!.id,
          participantCount,
          sortOrder: 1,
        },
      ],
    },
  })

  expect(createResponse.ok()).toBeTruthy()
  const created = (await createResponse.json()) as {
    reservation: { reservationNumber: string; preferredDate: string; fullName: string; phone: string }
  }

  return {
    reservationNumber: created.reservation.reservationNumber,
    preferredDate,
    fullName,
    phone,
    itemSummary,
  }
}

function findAvailableDate(blockedDates: Set<string>) {
  const today = new Date()

  for (let offset = 2; offset < 110; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    candidate.setUTCDate(candidate.getUTCDate() + offset)
    const key = formatDate(candidate)

    if (!blockedDates.has(key)) {
      return key
    }
  }

  throw new Error('E2E 用の空き日が見つかりませんでした')
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}
