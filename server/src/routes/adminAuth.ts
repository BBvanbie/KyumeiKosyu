import bcrypt from 'bcryptjs'
import { Router } from 'express'
import type { Request, Response } from 'express'
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

export async function adminLoginHandler(req: Request, res: Response) {
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
}

export function adminLogoutHandler(_req: Request, res: Response) {
  clearAdminSession(res)
  res.status(204).send()
}

export function adminMeHandler(req: Request, res: Response) {
  const token = req.cookies[getAdminSessionCookieName()]
  const session = verifySessionToken(token)

  if (!session) {
    res.status(401).json({ authenticated: false })
    return
  }

  res.json({
    authenticated: true,
    username: session.username,
  })
}

adminAuthRouter.post('/login', adminLoginHandler)
adminAuthRouter.post('/logout', adminLogoutHandler)
adminAuthRouter.get('/me', adminMeHandler)
