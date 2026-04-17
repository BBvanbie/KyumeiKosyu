import type { NextFunction, Request, Response } from 'express'
import { getAdminSessionCookieName, verifySessionToken } from '../lib/auth'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[getAdminSessionCookieName()]
  const session = verifySessionToken(token)

  if (!session) {
    res.status(401).json({ message: 'Admin authentication required' })
    return
  }

  req.adminUsername = session.username
  next()
}
