import type { ReservationItem, ReservationType } from './types'

export function getValidReservationItems(items: ReservationItem[]) {
  return items.filter((item) => item.reservationTypeId && item.participantCount > 0)
}

export function getLongestDurationMinutes(
  items: ReservationItem[],
  reservationTypes: ReservationType[]
) {
  const selectedTypes = getValidReservationItems(items)
    .map((item) => reservationTypes.find((type) => type.id === item.reservationTypeId))
    .filter((type): type is ReservationType => Boolean(type))

  return selectedTypes.reduce((max, type) => Math.max(max, type.durationMinutes), 0)
}

export function calculateEndTime(startTime: string, durationMinutes: number) {
  if (!startTime || durationMinutes <= 0) return ''

  const [hoursRaw, minutesRaw] = startTime.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return ''

  const totalMinutes = hours * 60 + minutes + durationMinutes
  const endHours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const endMinutes = totalMinutes % 60

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}
