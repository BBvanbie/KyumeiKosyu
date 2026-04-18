import { Router } from 'express'
import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const siteContentSchema = z.object({
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
  guideTitle: z.string().min(1),
  guideBody: z.string().min(1),
})

export const siteContentRouter = Router()

export async function getHomeSiteContentHandler(_req: Request, res: Response) {
  const content = await prisma.siteContent.findUnique({
    where: { id: 'home' },
  })

  res.json(content)
}

export async function updateHomeSiteContentHandler(req: Request, res: Response) {
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
}

siteContentRouter.get('/home', getHomeSiteContentHandler)
siteContentRouter.put('/home', requireAdmin, updateHomeSiteContentHandler)
