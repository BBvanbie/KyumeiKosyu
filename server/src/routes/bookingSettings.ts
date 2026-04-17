import { Router } from 'express'
import { z } from 'zod'
import { calculateAvailability, getBookingSetting } from '../lib/availability'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../middleware/requireAdmin'

const bookingSettingSchema = z.object({
  monthlyLimit: z.number().int().min(1),
  weeklyLimit: z.number().int().min(1),
  dailyLimit: z.number().int().min(1),
  maxConsecutiveOpenDays: z.number().int().min(1),
})

export const bookingSettingsRouter = Router()

bookingSettingsRouter.get('/', async (_req, res) => {
  const setting = await getBookingSetting()
  res.json(setting)
})

bookingSettingsRouter.put('/', requireAdmin, async (req, res) => {
  const parsed = bookingSettingSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid booking setting payload' })
    return
  }

  const setting = await prisma.bookingSetting.update({
    where: { id: 'default' },
    data: parsed.data,
  })

  res.json(setting)
})

bookingSettingsRouter.get('/availability', async (_req, res) => {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 119)

  const availability = await calculateAvailability({
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  })

  res.json(availability)
})
