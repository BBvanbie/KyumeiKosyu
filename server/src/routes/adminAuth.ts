import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { z } from 'zod'
import {
  clearAdminSession,
  getAdminSessionCookieName,
  setAdminSession,
  verifySessionToken,
} from '../lib/auth.js'
import { prisma } from '../lib/prisma.js'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const adminAuthRouter = Router()

adminAuthRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid login payload' })
    return
  }

  const admin = await prisma.adminUser.findUnique({
    where: { username: parsed.data.username },
  })

  if (!admin) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const isValid = await bcrypt.compare(parsed.data.password, admin.passwordHash)
  if (!isValid) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  setAdminSession(res, admin.username)
  res.json({ username: admin.username })
})

adminAuthRouter.post('/logout', (_req, res) => {
  clearAdminSession(res)
  res.status(204).send()
})

adminAuthRouter.get('/me', (req, res) => {
  const token = req.cookies[getAdminSessionCookieName()]
  const session = verifySessionToken(token)

  if (!session) {
    res.json({ authenticated: false, username: null })
    return
  }

  res.json({
    authenticated: true,
    username: session.username,
  })
})
