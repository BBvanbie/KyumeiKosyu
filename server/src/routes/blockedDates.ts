import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const blockedDateSchema = z.object({
  date: z.string().min(1),
  reason: z.string().optional().or(z.literal('')),
})

const blockedDateDeleteSchema = z.object({
  dates: z.array(z.string().min(1)).min(1),
})

const blockedDateRangeSchema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.string().optional().or(z.literal('')),
})

export const blockedDatesRouter = Router()

blockedDatesRouter.get('/', async (_req, res) => {
  const blockedDates = await prisma.blockedDate.findMany({
    orderBy: { date: 'asc' },
  })

  res.json(blockedDates)
})

blockedDatesRouter.post('/', requireAdmin, async (req, res) => {
  const parsed = blockedDateSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid blocked date payload' })
    return
  }

  const blockedDate = await prisma.blockedDate.create({
    data: {
      date: new Date(parsed.data.date),
      reason: parsed.data.reason || null,
    },
  })

  res.status(201).json(blockedDate)
})

blockedDatesRouter.delete('/', requireAdmin, async (req, res) => {
  const parsed = blockedDateDeleteSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid blocked date delete payload' })
    return
  }

  const deleted = await prisma.blockedDate.deleteMany({
    where: {
      date: {
        in: parsed.data.dates.map((date) => new Date(date)),
      },
    },
  })

  res.json({ deletedCount: deleted.count })
})

blockedDatesRouter.post('/bulk', requireAdmin, async (req, res) => {
  const parsed = blockedDateRangeSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid blocked date range payload' })
    return
  }

  const start = new Date(`${parsed.data.startDate}T00:00:00.000Z`)
  const end = new Date(`${parsed.data.endDate}T00:00:00.000Z`)

  if (end < start) {
    res.status(400).json({ message: '終了日は開始日以降を指定してください' })
    return
  }

  const records = []
  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    records.push({
      date: new Date(cursor),
      reason: parsed.data.reason || null,
    })
  }

  await prisma.blockedDate.createMany({
    data: records,
    skipDuplicates: true,
  })

  const blockedDates = await prisma.blockedDate.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: 'asc' },
  })

  res.status(201).json(blockedDates)
})
