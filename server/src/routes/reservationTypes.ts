import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

export const reservationTypesRouter = Router()

const reservationTypeSchema = z.object({
  durationMinutes: z.number().int().min(0),
  textbookFee: z.number().int().min(0),
  isActive: z.boolean(),
})

reservationTypesRouter.get('/', async (_req, res) => {
  const reservationTypes = await prisma.reservationType.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  res.json(reservationTypes)
})

reservationTypesRouter.put('/:id', requireAdmin, async (req, res) => {
  const parsed = reservationTypeSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid reservation type payload' })
    return
  }

  const reservationType = await prisma.reservationType.update({
    where: { id: String(req.params.id) },
    data: parsed.data,
  })

  res.json(reservationType)
})
