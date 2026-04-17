import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../middleware/requireAdmin'

export const adminNotificationsRouter = Router()

adminNotificationsRouter.get('/', requireAdmin, async (_req, res) => {
  const notifications = await prisma.adminNotification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  res.json(notifications)
})

adminNotificationsRouter.patch('/:id/read', requireAdmin, async (req, res) => {
  const notification = await prisma.adminNotification.update({
    where: { id: String(req.params.id) },
    data: { isRead: true },
  })

  res.json(notification)
})
