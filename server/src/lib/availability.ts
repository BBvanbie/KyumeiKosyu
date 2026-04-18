import type { BookingSetting } from '../../../generated/prisma/client.js'
import { prisma } from './prisma.js'

type AvailabilityReason =
  | 'manual_block'
  | 'daily_limit'
  | 'weekly_limit'
  | 'monthly_limit'
  | 'consecutive_limit'

export type EffectiveBlockedDate = {
  date: string
  reason: AvailabilityReason
}

function toDateOnlyString(date: Date) {
  return date.toISOString().slice(0, 10)
}

function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`)
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function startOfWeek(date: Date) {
  const result = new Date(date)
  const day = result.getUTCDay()
  result.setUTCDate(result.getUTCDate() - day)
  return result
}

function getWeekKey(date: Date) {
  return toDateOnlyString(startOfWeek(date))
}

function getMonthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1)
}

export async function getBookingSetting() {
  const setting = await prisma.bookingSetting.findUnique({
    where: { id: 'default' },
  })

  if (!setting) {
    throw new Error('Booking setting not initialized')
  }

  return setting
}

export async function calculateAvailability({
  startDate,
  endDate,
  setting,
}: {
  startDate: string
  endDate: string
  setting?: BookingSetting
}) {
  const resolvedSetting = setting ?? (await getBookingSetting())
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  const statsStartCandidates = [
    startOfWeek(start),
    startOfMonth(start),
    addDays(start, -resolvedSetting.maxConsecutiveOpenDays),
  ]
  const statsStart = statsStartCandidates.reduce((earliest, current) =>
    current < earliest ? current : earliest
  )

  const [blockedDates, reservations] = await Promise.all([
    prisma.blockedDate.findMany({
      where: {
        date: {
          gte: statsStart,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
    }),
    prisma.reservation.findMany({
      where: {
        preferredDate: {
          gte: statsStart,
          lte: end,
        },
        status: {
          not: 'cancelled',
        },
      },
      orderBy: { preferredDate: 'asc' },
    }),
  ])

  const manualBlocked = new Set(blockedDates.map((entry) => toDateOnlyString(entry.date)))
  const dayCounts = new Map<string, number>()
  const weekCounts = new Map<string, number>()
  const monthCounts = new Map<string, number>()

  for (const reservation of reservations) {
    const dateKey = toDateOnlyString(reservation.preferredDate)
    increment(dayCounts, dateKey)
    increment(weekCounts, getWeekKey(reservation.preferredDate))
    increment(monthCounts, getMonthKey(reservation.preferredDate))
  }

  const effectiveBlockedDates: EffectiveBlockedDate[] = []
  let openStreak = 0

  for (let cursor = new Date(statsStart); cursor <= end; cursor = addDays(cursor, 1)) {
    const dateKey = toDateOnlyString(cursor)
    const dayCount = dayCounts.get(dateKey) ?? 0
    const weekCount = weekCounts.get(getWeekKey(cursor)) ?? 0
    const monthCount = monthCounts.get(getMonthKey(cursor)) ?? 0

    let reason: AvailabilityReason | null = null

    if (manualBlocked.has(dateKey)) {
      reason = 'manual_block'
    } else if (dayCount >= resolvedSetting.dailyLimit) {
      reason = 'daily_limit'
    } else if (weekCount >= resolvedSetting.weeklyLimit) {
      reason = 'weekly_limit'
    } else if (monthCount >= resolvedSetting.monthlyLimit) {
      reason = 'monthly_limit'
    } else if (openStreak >= resolvedSetting.maxConsecutiveOpenDays) {
      reason = 'consecutive_limit'
    }

    if (reason) {
      if (cursor >= start) {
        effectiveBlockedDates.push({ date: dateKey, reason })
      }
      openStreak = 0
      continue
    }

    openStreak += 1
  }

  return {
    setting: resolvedSetting,
    effectiveBlockedDates,
    manualBlockedDates: blockedDates.map((entry) => ({
      id: entry.id,
      date: toDateOnlyString(entry.date),
      reason: entry.reason,
    })),
  }
}
