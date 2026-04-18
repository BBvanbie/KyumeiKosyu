import crypto from 'node:crypto'
import type { Response } from 'express'
import type { CookieOptions } from 'express'

const COOKIE_NAME = 'kyumei_admin_session'
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24

function getCookieOptions(): CookieOptions {
  if (process.env.NODE_ENV === 'production') {
    return {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: ONE_DAY_IN_MS,
    }
  }

  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ONE_DAY_IN_MS,
  }
}

function getSecret() {
  const secret = process.env.SESSION_SECRET

  if (!secret) {
    throw new Error('SESSION_SECRET is not configured')
  }

  return secret
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex')
}

export function createSessionToken(username: string) {
  const expiresAt = Date.now() + ONE_DAY_IN_MS
  const payload = `${username}:${expiresAt}`
  const signature = sign(payload)

  return `${payload}:${signature}`
}

export function verifySessionToken(token?: string) {
  if (!token) return null

  const parts = token.split(':')
  if (parts.length !== 3) return null

  const [username, expiresAtRaw, signature] = parts
  const payload = `${username}:${expiresAtRaw}`
  const expected = sign(payload)

  if (signature !== expected) return null

  const expiresAt = Number(expiresAtRaw)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null

  return { username }
}

export function setAdminSession(res: Response, username: string) {
  res.cookie(COOKIE_NAME, createSessionToken(username), getCookieOptions())
}

export function clearAdminSession(res: Response) {
  res.clearCookie(COOKIE_NAME, getCookieOptions())
}

export function getAdminSessionCookieName() {
  return COOKIE_NAME
}
