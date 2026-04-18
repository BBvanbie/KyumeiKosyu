import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { adminAuthRouter } from './routes/adminAuth.js'
import { adminNotificationsRouter } from './routes/adminNotifications.js'
import { blockedDatesRouter } from './routes/blockedDates.js'
import { bookingSettingsRouter } from './routes/bookingSettings.js'
import { publicReservationsRouter } from './routes/publicReservations.js'
import { reservationTypesRouter } from './routes/reservationTypes.js'
import { reservationsRouter } from './routes/reservations.js'
import { siteContentRouter } from './routes/siteContent.js'

export const app = express()

const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/admin', adminAuthRouter)
app.use('/api/admin-notifications', adminNotificationsRouter)
app.use('/api/booking-settings', bookingSettingsRouter)
app.use('/api/public-reservations', publicReservationsRouter)
app.use('/api/site-content', siteContentRouter)
app.use('/api/reservation-types', reservationTypesRouter)
app.use('/api/blocked-dates', blockedDatesRouter)
app.use('/api/reservations', reservationsRouter)
