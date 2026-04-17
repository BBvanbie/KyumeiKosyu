import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { ReservationStatus } from '../../../generated/prisma/enums'
import { z } from 'zod'
import { calculateAvailability } from '../lib/availability'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../middleware/requireAdmin'

const additionalTextbookCountsSchema = z.object({
  basicInitial: z.number().int().min(0),
  basicRenewal: z.number().int().min(0),
  basicEnglish: z.number().int().min(0),
  advancedInitial: z.number().int().min(0),
  advancedRenewal: z.number().int().min(0),
})

const reservationSchema = z.object({
  preferredDate: z.string().min(1),
  preferredStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  fullName: z.string().min(1),
  address: z.string().optional().or(z.literal('')),
  phone: z.string().min(1),
  email: z.string().optional().or(z.literal('')),
  organizationName: z.string().min(1),
  venueAddress: z.string().min(1),
  targetAudience: z.string().min(1),
  interpreterAvailable: z.enum(['', 'available', 'unavailable']),
  japaneseTextbookCount: z.string(),
  englishTextbookCount: z.string(),
  wantsAdditionalTextbooks: z.boolean(),
  additionalTextbookCounts: additionalTextbookCountsSchema,
  notes: z.string().optional().or(z.literal('')),
  items: z
    .array(
      z.object({
        reservationTypeId: z.string().min(1),
        participantCount: z.number().int().min(1),
        sortOrder: z.number().int().min(1).max(3),
      })
    )
    .min(1)
    .max(3),
})

const statusSchema = z.object({
  status: z.enum([
    ReservationStatus.pending,
    ReservationStatus.confirmed,
    ReservationStatus.cancelled,
  ]),
})

export const reservationsRouter = Router()

reservationsRouter.get('/', requireAdmin, async (_req, res) => {
  const reservations = await prisma.reservation.findMany({
    include: {
      items: {
        include: { reservationType: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json(reservations)
})

reservationsRouter.post('/', async (req, res) => {
  const parsed = reservationSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid reservation payload' })
    return
  }

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const selectedDate = parsed.data.preferredDate
  const availability = await calculateAvailability({
    startDate: today.toISOString().slice(0, 10),
    endDate: selectedDate,
  })

  const isBlocked = availability.effectiveBlockedDates.some(
    (entry) => entry.date === selectedDate
  )

  if (isBlocked) {
    res.status(400).json({ message: 'Selected date is no longer available' })
    return
  }

  const reservationTypes = await prisma.reservationType.findMany({
    where: {
      id: {
        in: parsed.data.items.map((item) => item.reservationTypeId),
      },
    },
  })

  const hasEnglishReservation = reservationTypes.some(
    (type) => type.name === '普通（英語版）'
  )

  if (hasEnglishReservation) {
    if (parsed.data.interpreterAvailable !== 'available') {
      res.status(400).json({ message: '英語版講習は消防署で電話受付となります' })
      return
    }

    if (
      parsed.data.japaneseTextbookCount === '' ||
      parsed.data.englishTextbookCount === ''
    ) {
      res.status(400).json({ message: '英語版テキストの必要部数を入力してください' })
      return
    }
  }

  const confirmationCode = createConfirmationCode()
  const reservation = await prisma.reservation.create({
    data: {
      reservationNumber: createReservationNumber(),
      confirmationCodeHash: await bcrypt.hash(confirmationCode, 10),
      ...parsed.data,
      preferredDate: new Date(parsed.data.preferredDate),
      preferredStartTime: parsed.data.preferredStartTime,
      address: parsed.data.address || null,
      email: parsed.data.email || null,
      organizationName: parsed.data.organizationName,
      venueAddress: parsed.data.venueAddress,
      targetAudience: parsed.data.targetAudience,
      interpreterAvailable: hasEnglishReservation
        ? parsed.data.interpreterAvailable === 'available'
        : null,
      japaneseTextbookCount: hasEnglishReservation
        ? Number(parsed.data.japaneseTextbookCount)
        : null,
      englishTextbookCount: hasEnglishReservation
        ? Number(parsed.data.englishTextbookCount)
        : null,
      wantsAdditionalTextbooks: parsed.data.wantsAdditionalTextbooks,
      additionalTextbookCounts: parsed.data.wantsAdditionalTextbooks
        ? parsed.data.additionalTextbookCounts
        : undefined,
      notes: parsed.data.notes || null,
      items: {
        create: parsed.data.items.map((item) => ({
          reservationTypeId: item.reservationTypeId,
          participantCount: item.participantCount,
          sortOrder: item.sortOrder,
        })),
      },
    },
    include: {
      items: {
        include: { reservationType: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  res.status(201).json({
    reservation,
    confirmationCode,
  })
})

reservationsRouter.patch('/:id/status', requireAdmin, async (req, res) => {
  const parsed = statusSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid status payload' })
    return
  }

  const reservation = await prisma.reservation.update({
    where: { id: String(req.params.id) },
    data: {
      status: parsed.data.status,
      confirmedAt:
        parsed.data.status === ReservationStatus.confirmed ? new Date() : null,
    },
    include: {
      items: {
        include: { reservationType: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  res.json(reservation)
})

reservationsRouter.post('/:id/regenerate-code', requireAdmin, async (req, res) => {
  const confirmationCode = createConfirmationCode()

  await prisma.reservation.update({
    where: { id: String(req.params.id) },
    data: {
      confirmationCodeHash: await bcrypt.hash(confirmationCode, 10),
    },
  })

  res.json({ confirmationCode })
})

function createReservationNumber() {
  return `R${Date.now().toString().slice(-8)}`
}

function createConfirmationCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}
