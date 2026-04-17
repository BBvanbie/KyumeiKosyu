import 'express'

declare global {
  namespace Express {
    interface Request {
      adminUsername?: string
    }
  }
}

export {}
