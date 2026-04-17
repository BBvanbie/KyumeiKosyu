import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../middleware/requireAdmin'

const siteContentSchema = z.object({
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
  guideTitle: z.string().min(1),
  guideBody: z.string().min(1),
})

export const siteContentRouter = Router()

siteContentRouter.get('/home', async (_req, res) => {
  const content = await prisma.siteContent.findUnique({
    where: { id: 'home' },
  })

  res.json(content)
})

siteContentRouter.put('/home', requireAdmin, async (req, res) => {
  const parsed = siteContentSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid site content payload' })
    return
  }

  const content = await prisma.siteContent.upsert({
    where: { id: 'home' },
    update: parsed.data,
    create: {
      id: 'home',
      ...parsed.data,
    },
  })

  res.json(content)
})
